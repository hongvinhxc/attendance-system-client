import { Button, Card, Form, Input, message } from "antd";
import { validatePassword } from "helpers/validate";
import React, { useState } from "react";
import * as authService from "services/auth";
import "./style.scss";

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const [validateStatus, setValidateStatus] = useState(false);

  const onSave = (values: any) => {
    const password = values["password"];
    const new_password = values["new_password"];
    changePassword(password, new_password);
  };

  const changePassword = async (password: string, newPassword: string) => {
    let res = await authService.changePassword(password, newPassword);
    if (res.status) {
      message.success(res.message);
      form.resetFields();
    } else {
      message.error(res.message);
    }
  };

  const onFieldsChange = (values: any) => {
    setValidateStatus(
      form.isFieldsTouched(true) &&
        !form.getFieldsError().filter(({ errors }) => errors.length).length
    );
  };

  return (
    <div className="change-password">
      <Card title="Change password" bordered={false}>
        <Form
          form={form}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 14 },
          }}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 },
          }}
          layout="horizontal"
          name="form_in_modal"
          onFinish={onSave}
          onFieldsChange={onFieldsChange}
        >
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="New password"
            rules={[
              {
                required: true,
                message: "Please input new password!",
              },
              {
                validator: async (rule: any, value: string) => {
                  if (!validatePassword(value || "")) {
                    return Promise.reject(
                      new Error(
                        "Password must be at least 8 characters include uppercase and lowercase letters, numbers and symbols!"
                      )
                    );
                  }
                },
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="new_password_verify"
            label="New password confirmation"
            rules={[
              {
                required: true,
                message: "Please input new password confirmation!",
              },
              {
                validator: async (rule: any, value: string) => {
                  if (form.getFieldValue("new_password") !== value) {
                    return Promise.reject(
                      new Error("The password confirmation does not match!")
                    );
                  }
                },
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 14, offset: 6 },
            }}
          >
            <Button type="primary" htmlType="submit" disabled={!validateStatus}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
