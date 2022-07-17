import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  message,
  Row,
  TimePicker,
} from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import * as workingTimeService from "services/working-time";
import "./style.scss";

const { RangePicker } = TimePicker;

const options = [
  { label: "Monday", value: 0 },
  { label: "Tuesday", value: 1 },
  { label: "Wednesday", value: 2 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 4 },
  { label: "Saturday", value: 5 },
  { label: "Sunday", value: 6 },
];

const WorkingTime: React.FC = () => {
  const [form] = Form.useForm();
  const [validateStatus, setValidateStatus] = useState(false);

  useEffect(() => {
    getWorkingTime();
    // eslint-disable-next-line
  }, []);

  const onSave = (values: any) => {
    const working_day = values.working_day;
    const holidays = values.holidays.map((date: Moment) =>
      date.format("DD-MM")
    );
    const working_time = {
      morning: values.working_time.morning.map((time: Moment) =>
        time.format("HH:mm")
      ),
      afternoon: values.working_time.afternoon.map((time: Moment) =>
        time.format("HH:mm")
      ),
    };
    onSaveWorkingTime({ working_day, working_time, holidays });
  };

  const onSaveWorkingTime = async (config: any) => {
    let res = await workingTimeService.saveWorkingTime(config);
    if (res.status) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

  const getWorkingTime = async () => {
    let res = await workingTimeService.getWorkingTime();
    if (res.status) {
      let data = res.data;
      data.holidays = data.holidays.map((date: string) =>
        moment(date, "DD-MM")
      );
      data.working_time.morning = data.working_time.morning.map(
        (time: string) => moment(time, "HH:mm")
      );
      data.working_time.afternoon = data.working_time.afternoon.map(
        (time: string) => moment(time, "HH:mm")
      );
      form.setFieldsValue(data);
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

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current.year() !== moment().year();
  };

  return (
    <div className="working-time">
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        onFinish={onSave}
        onFieldsChange={onFieldsChange}
      >
        <Card
          title="Working time"
          bordered={false}
          extra={
            <Button type="primary" htmlType="submit" disabled={!validateStatus}>
              Save
            </Button>
          }
        >
          <Row>
            <Col span={14}>
              <Form.Item
                name="working_day"
                label="Working day"
                rules={[
                  {
                    required: true,
                    message: "Please select working day!",
                  },
                ]}
              >
                <Checkbox.Group options={options} />
              </Form.Item>
              <Form.Item label="Working time">
                <Form.Item
                  name={["working_time", "morning"]}
                  label="Morning"
                  rules={[
                    {
                      required: true,
                      message: "Please select morning working time!",
                    },
                  ]}
                >
                  <RangePicker bordered={false} format="HH:mm" />
                </Form.Item>
                <Form.Item
                  name={["working_time", "afternoon"]}
                  label="Afternoon"
                  rules={[
                    {
                      required: true,
                      message: "Please select afternoon working time!",
                    },
                  ]}
                >
                  <RangePicker bordered={false} format="HH:mm" />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.List name="holidays">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        label={index === 0 ? "Holidays" : ""}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input holiday or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <DatePicker
                            dropdownClassName="working-time-date-picker"
                            placeholder="holiday date"
                            disabledDate={disabledDate}
                            superNextIcon=""
                            superPrevIcon=""
                            format="DD-MM"
                            style={{ width: "60%" }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: "60%" }}
                        icon={<PlusOutlined />}
                      >
                        Add hoilday
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

export default WorkingTime;
