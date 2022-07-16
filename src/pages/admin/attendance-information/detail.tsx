import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Badge,
  BadgeProps,
  Button,
  Calendar,
  Card,
  Col,
  message,
  Popover,
  Row,
} from "antd";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as attendanceService from "services/attendance";

const AttendanceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const id: any = location.pathname.split("/").pop();
    let month = moment();
    const query: any = location.state;
    if (query) month = moment(query.month);
    getData(id, month.format("YYYY-MM"));
  }, [location]);

  const getData = async (id: string, month: string) => {
    let res = await attendanceService.getAttendanceById(id, month);
    if (res.status) {
      setProfile(res.data);
    } else {
      message.error(res.message);
    }
  };

  const goBack = () => {
    navigate("..", {
      state: location.state,
    });
  };

  const onPanelChange = (value: Moment) => {
    getData(profile._id, value.format("YYYY-MM"));
  };

  const onSelect = (newValue: Moment) => {
    console.log(newValue.format("YYYY-MM-DD"), "onSelect");
  };

  const dateFullCellRender = (value: Moment) => {
    if (!profile) return;
    const currentDate = value.format("YYYY-MM-DD");
    const item: any = profile.calendar[currentDate];
    if (!item) return;
    let arriveTime = "Missing";
    let leaveTime = "Missing";

    if (!!Object.keys(item).length && !item.is_absence) {
      console.log(item);

      arriveTime = item.is_not_checkin
        ? arriveTime
        : moment(item.attendance_times[0]).format("HH:mm:ss");
      leaveTime = item.is_not_checkin
        ? arriveTime
        : moment(
            item.attendance_times[item.attendance_times.length - 1]
          ).format("HH:mm:ss");
    }
    return (
      <Popover
        content={
          !Object.keys(item).length ? (
            "Day off"
          ) : (
            <div>
              <p style={{ marginBottom: 5 }}>
                <span style={{ marginRight: 5 }}>Arrive time: </span>
                {arriveTime}
              </p>
              <p>
                <span style={{ marginRight: 5 }}>Leave time:</span> {leaveTime}
              </p>
            </div>
          )
        }
        title={currentDate}
      >
        <div className="ant-picker-cell-inner ant-picker-calendar-date">
          <div className="ant-picker-calendar-date-value">
            {value.format("DD")}
          </div>
          <div className="ant-picker-calendar-date-content">
            <ul className="events">
              {item?.is_absence && (
                <li className="absence" key="is_absence">
                  Absence
                </li>
              )}
              {item?.is_late && (
                <li className="late" key="is_late">
                  Arrive late
                </li>
              )}
              {item?.is_early && (
                <li className="early" key="is_early">
                  Leave early
                </li>
              )}
              {item?.is_not_checkin && (
                <li className="checkin" key="is_not_checkin">
                  Miss checkin
                </li>
              )}
              {item?.is_not_checkout && (
                <li className="checkout" key="is_not_checkout">
                  Miss checkout
                </li>
              )}
            </ul>
          </div>
        </div>
      </Popover>
    );
  };

  return (
    <Card
      className="attendance-detail"
      title="Attendance Detail"
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
          Back
        </Button>
      }
      bordered={false}
    >
      <Calendar
        headerRender={({ value, onChange }) => {
          const currentMonth = value.format("YYYY - MM");
          const onChangeMonth = (month: number) => {
            const now = value.clone().add(month, "months");
            onChange(now);
          };
          return (
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Col>{profile?.name}</Col>
              <Col>
                <Row>
                  <Button
                    onClick={() => onChangeMonth(-1)}
                    className="btn-previous"
                  >
                    <LeftOutlined />
                    Previous
                  </Button>
                  <div className="current-month">{currentMonth}</div>
                  <Button onClick={() => onChangeMonth(1)} className="btn-next">
                    Next
                    <RightOutlined />
                  </Button>
                </Row>
              </Col>
            </Row>
          );
        }}
        onPanelChange={onPanelChange}
        onSelect={onSelect}
        dateFullCellRender={dateFullCellRender}
      />
    </Card>
  );
};

export default AttendanceDetail;
