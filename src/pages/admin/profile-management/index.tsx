import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import * as profileService from "services/profile";
import AddEditModal from "./addModal";
import "./style.scss";

const ProfileManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValues, setSearchValues] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const [modalData, setModalData] = useState<any>(null);

  const columns = [
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
      title: "Action",
      render: (text: string, record: object, index: number) => {
        return (
          <>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => onEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => onDeleteRow(record)}
                danger
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onEditRow = (row: object) => {
    setModalData(row);
  };

  const onDeleteRow = (row: any) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete " + row.name + "?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk() {
        deleteProfile(row._id);
      },
    });
  };

  const deleteProfile = async (_id: string) => {
    let res = await profileService.deleteProfile(_id);
    if (res.status) {
      message.success(res.message);
      onReloadData();
    } else {
      message.error(res.message);
    }
  };

  const getData = async (values?: object) => {
    setIsLoading(true);
    let res = await profileService.getProfiles(values);
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

  const onReloadData = (page?: number) => {
    getData({
      ...searchValues,
      size: pagination.pageSize,
      page: page ? page : pagination.current,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="profile-management">
      <AddEditModal
        data={modalData}
        onClose={() => setModalData(null)}
        onReload={onReloadData}
      />
      <Card
        title="Profile Management"
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setModalData({})}
          >
            New Profile
          </Button>
        }
        bordered={false}
      >
        <Row style={{ marginBottom: "20px" }} justify="end">
          <Form layout="inline" onFinish={onSearch}>
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
