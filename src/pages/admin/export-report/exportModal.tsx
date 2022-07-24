import { DownloadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, message, Modal } from "antd";
import { useState } from "react";
import moment, { Moment } from "moment";
import * as exportReportService from "services/export-report";
import { RangePickerProps } from "antd/lib/date-picker";

type Props = {
  onReload?: Function;
};
const ExportModal = ({ onReload }: Props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [invalidForm, setInValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoading(true);
        onExportReport(values);
        setIsLoading(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onExportReport = async (data: any) => {
    let body = {
      month: (data.month as Moment).startOf("month").format("YYYY-MM"),
    };
    let res = await exportReportService.exportReport(body);
    if (res.status) {
      message.success(res.message);
      onCancel();
      onReload && onReload(1);
    } else {
      message.error(res.message);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
    setInValidForm(false);
  };

  const onFieldsChange = (values: any) => {
    setInValidForm(
        !!form.getFieldsError().filter(({ errors }) => errors.length).length
    );
  };

  const openModal = () => {
    setVisible(true);
    form.setFields([
      {
        name: "month",
        value: moment(),
      },
    ]);
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // Can not select days after current month
    return current && current > moment().endOf('month');
  };

  return (
    <>
      <Button type="primary" icon={<DownloadOutlined />} onClick={openModal}>
        Export
      </Button>
      <Modal
        title="Export Report"
        centered
        visible={visible}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        okText="Download"
        okButtonProps={{ disabled: invalidForm || isLoading }}
      >
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
          onFieldsChange={onFieldsChange}
        >
          <Form.Item
            name="month"
            label="Month"
            rules={[
              {
                required: true,
                message: "Please select month to export report!",
              },
            ]}
          >
            <DatePicker
              dropdownClassName="working-time-date-picker"
              placeholder="Select Month"
              disabledDate={disabledDate}
              picker="month"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExportModal;
