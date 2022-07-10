import { del, get, post, put } from "./base";

type GetProfilesParams = {
  size?: Number;
  page?: Number;
  name?: String;
  code?: String;
  position?: String;
};
const getProfiles = (params: GetProfilesParams = {}) => {
  let path = "profiles/";
  let res = get(path, params);
  return res;
};

const addProfile = (params: GetProfilesParams = {}) => {
  let path = "profiles/";
  let res = post(path, params);
  return res;
};

const updateProfile = (id: string, params: GetProfilesParams = {}) => {
  let path = "profiles/" + id;
  let res = put(path, params);
  return res;
};

const deleteProfile = (_id: string) => {
  let path = "profiles/" + _id;
  let res = del(path);
  return res;
};

const getProfileImages = (_id: string) => {
  let path = "profiles/get-images/" + _id;
  let res = get(path);
  return res;
};

export { getProfiles, addProfile, updateProfile, deleteProfile, getProfileImages };
