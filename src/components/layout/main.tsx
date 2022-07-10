import {
  SettingOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { SelectInfo } from "rc-menu/lib/interface";
import { Button, Col, MenuProps, message, Modal, Row } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "assets/images/logo.png";
import "./layout.scss";
import { logout } from "services/auth";
import { AuthContext } from "context";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Mangement", "Mangement", <SettingOutlined />, [
    getItem(
      <NavLink to="/admin/profile-management">Profile</NavLink>,
      "Profile",
      <TeamOutlined />
    ),
    getItem(
      <NavLink to="/admin/attendance-infomation">Attendance</NavLink>,
      "Attendance",
      <ClockCircleOutlined />
    ),
  ]),
  getItem(
    <NavLink to="/admin/change-password">Change password</NavLink>,
    "Change password",
    <KeyOutlined />
  ),
];

const rootSubmenuKeys = ["Management"];

function Main() {
  const context = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["Mangement"]);
  const [keyPath, setKeyPath] = useState(["Profile", "Mangement"]);
  const location = useLocation();

  useEffect(() => {
    Modal.destroyAll();
  }, [location]);

  const onSelect: MenuProps["onSelect"] = ({ keyPath }: SelectInfo) => {
    setKeyPath(keyPath);
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onLogout = async () => {
    let res = await logout();
    if (res?.status) {
      context.onLogin();
    } else {
      message.error(res.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          <img src={logo} alt="logo" />
          {!collapsed && <span>Attendance Portal</span>}
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["Profile"]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onSelect={onSelect}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Row justify="space-between">
            <Col>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>{keyPath[1]}</Breadcrumb.Item>
                <Breadcrumb.Item>{keyPath[0]}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span>Hello, administrator</span>
              <Button type="link" onClick={onLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Attendance Portal © 2022
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Main;
