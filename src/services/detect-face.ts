import { post } from "./base";

const detectFace = (image: string) => {
  let path = "detect-face";
  let res = post(path, {image});
  return res;
};

export { detectFace };
