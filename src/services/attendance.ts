import { del, get, post, put } from "./base";

type GetAttendanceParams = {
  month?: String;
  size?: Number;
  page?: Number;
  name?: String;
  code?: String;
  position?: String;
};

const getAttendance = (params: GetAttendanceParams = {}) => {
  let path = "attendance";
  let res = get(path, params);
  return res;
};

const getAttendanceById = (id: string, month: string) => {
  let path = "attendance/" + id;
  let res = get(path, { month });
  return res;
};

export { getAttendance, getAttendanceById };
