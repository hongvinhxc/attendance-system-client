import {
  SettingOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  TeamOutlined,
  ToolOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { SelectInfo } from "rc-menu/lib/interface";
import { Button, Col, MenuProps, message, Modal, Row } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  getItem("Management", "Management", <SettingOutlined />, [
    getItem(
      <NavLink to="/admin/profile-management">Profile</NavLink>,
      "Profile",
      <TeamOutlined />
    ),
    getItem(
      <NavLink to="/admin/attendance-information">Attendance</NavLink>,
      "Attendance",
      <ClockCircleOutlined />
    ),
    getItem(
      <NavLink to="/admin/working-time">Working time</NavLink>,
      "Working time",
      <ToolOutlined />
    ),
  ]),
  getItem(
    <NavLink to="/admin/export-report">Export Report</NavLink>,
    "Export Report",
    <DownloadOutlined />
  ),
  getItem(
    <NavLink to="/admin/change-password">Change password</NavLink>,
    "Change password",
    <KeyOutlined />
  ),
];

const rootSubmenuKeys = ["Management"];

const menuMap: any = {
  "profile-management": ["Profile", "Management"],
  "attendance-information": ["Attendance", "Management"],
  "working-time": ["Working time", "Management"],
  "change-password": ["Change password"],
  "export-report": ["Export Report"],
};

function Main() {
  const context = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [keyPath, setKeyPath] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const paths = location.pathname.split("/");
    setOpenKeys([menuMap[paths[2]]?.[1] || "Management"]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const paths = location.pathname.split("/");
    setKeyPath(menuMap[paths[2]] || ["Profile", "Management"]);
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
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" />
          {!collapsed && <span>Attendance Portal</span>}
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["Profile"]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[keyPath[0]]}
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
