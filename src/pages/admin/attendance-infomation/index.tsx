import { Card, Table } from "antd";
import React, { useEffect } from "react";
// import { getProfiles } from "services/profile";
import "./style.scss";

const AttendanceInfomation: React.FC = () => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const getData = async () => {
    // let res = await getProfiles();
  };

  useEffect(() => {
    getData();
  });
  return (
    <div className="attendance-infomation">
      <Card title="Attendance Infomation" bordered={false}>
        <Table dataSource={dataSource} columns={columns} />;
      </Card>
    </div>
  );
};

export default AttendanceInfomation;
