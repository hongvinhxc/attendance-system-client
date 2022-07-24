import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  message,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { AlignType } from "rc-table/lib/interface";
import * as exportReportService from "services/export-report";
import ExportModal from "./exportModal";
import "./style.scss";

const ExportReport: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Report name",
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: "Month",
      dataIndex: "report_month",
      key: "report_month",
      render: (text: string, record: object, index: number) =>
        text.split("-").slice(0, -1).join("-"),
    },
    {
      title: "Date export",
      dataIndex: "creation_date",
      key: "creation_date",
    },
    {
      title: "Action",
      render: (text: string, record: object, index: number) => {
        return (
          <>
            <Tooltip title="Download">
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => onDownloadReport(record)}
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

  const onDownloadReport = async (row: any) => {
    let res = await exportReportService.downloadReport(row["_id"]);
    if (res.status) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
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
    let res = await exportReportService.deleteReport(_id);
    if (res.status) {
      message.success(res.message);
      onReloadData();
    } else {
      message.error(res.message);
    }
  };

  const getData = async (values?: object) => {
    setIsLoading(true);
    let res = await exportReportService.getReports(values);
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

  const onPageChange: PaginationProps["onChange"] = (current, pageSize) => {
    getData({
      size: pageSize,
      page: current,
    });
  };

  const onReloadData = (page?: number) => {
    getData({
      size: pagination.pageSize,
      page: page ? page : pagination.current,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="export-report">
      <Card
        title="Export Report"
        extra={<ExportModal onReload={onReloadData} />}
        bordered={false}
      >
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

export default ExportReport;
