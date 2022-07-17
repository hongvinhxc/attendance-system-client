import { get, post } from "./base";

const getWorkingTime = () => {
  let path = "working-time";
  let res = get(path);
  return res;
};

const saveWorkingTime = (config: string) => {
  let path = "working-time";
  let res = post(path, config);
  return res;
};

export { getWorkingTime, saveWorkingTime };
