import {
  DownloadOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  PaginationProps,
  Row,
  Table,
  Tooltip,
} from "antd";
import { AlignType } from "rc-table/lib/interface";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import * as attendanceService from "services/attendance";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { RangePickerProps } from "antd/lib/date-picker";

const ProfileManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<any>({ month: moment() });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "No",
      width: 50,
      align: "center" as AlignType,
      render: (text: string, record: object, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Absence",
      dataIndex: "absence",
      key: "",
      align: "center" as AlignType,
    },
    {
      title: "Arrive late",
      dataIndex: "late",
      key: "late",
      align: "center" as AlignType,
    },
    {
      title: "Leave early",
      dataIndex: "early",
      key: "early",
      align: "center" as AlignType,
    },
    {
      title: "Action",
      align: "center" as AlignType,
      render: (text: string, record: object, index: number) => {
        return (
          <>
            <Tooltip title="View detail">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(record)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onViewDetail = (row: any) => {
    navigate(row._id, {
      state: {
        ...searchValues,
        month: searchValues.month.toDate(),
        size: pagination.pageSize,
        page: pagination.current,
      },
    });
  };

  const getData = async (values?: any) => {
    setIsLoading(true);
    const body = {
      ...values,
      month: (values.month as Moment).startOf("month").format("YYYY-MM"),
    };
    let res = await attendanceService.getAttendance(body);
    setIsLoading(false);
    if (res.status) {
      let data = res.data;
      setDataSource(data.rows);
      setPagination({
        current: data.page,
        pageSize: data.size,
        total: data.total,
      });
    } else {
      message.error(res.message);
    }
  };

  const onSearch = (values: object) => {
    getData({
      ...values,
      size: pagination.pageSize,
      page: 1,
    });
    setSearchValues(values);
  };

  const onPageChange: PaginationProps["onChange"] = (current, pageSize) => {
    getData({
      ...searchValues,
      size: pageSize,
      page: current,
    });
  };

  useEffect(() => {
    let query: any = { month: moment() };
    if (location.state) {
      query = location.state;
      query.month = moment(query.month);
      form.setFieldsValue(query);
    }
    getData(query);
  }, []);

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    return current && current > moment().endOf('day');
  };

  return (
    <div className="attendance-information">
      <Card
        title="Attendance Information"
        extra={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => console.log("Export")}
          >
            Export
          </Button>
        }
        bordered={false}
      >
        <Row style={{ marginBottom: "20px" }} justify="end">
          <Form
            form={form}
            layout="inline"
            onFinish={onSearch}
            initialValues={searchValues}
          >
            <Form.Item name="month" label="Month">
              <DatePicker picker="month" disabledDate={disabledDate}/>
            </Form.Item>
            <Form.Item name="name" label="Name">
              <Input placeholder="Ex: Nguyen Van A" />
            </Form.Item>
            <Form.Item name="code" label="Code">
              <Input placeholder="Ex: 20209062" />
            </Form.Item>
            <Form.Item name="position" label="Postion">
              <Input placeholder="Ex: Nhan vien" />
            </Form.Item>
            <Form.Item>
              <Button
                icon={<SearchOutlined />}
                htmlType="submit"
                disabled={isLoading}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={false}
        />
        <Row style={{ marginTop: "20px" }} justify="end">
          <Pagination
            disabled={isLoading}
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            onChange={onPageChange}
          />
        </Row>
      </Card>
    </div>
  );
};

export default ProfileManagement;
