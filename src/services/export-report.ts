import { del, download, get } from "./base";

type GetExportReport = {
  size?: Number;
  page?: Number;
};

type ExportReport = {
  month?: string;
};
const getReports = (params: GetExportReport = {}) => {
  let path = "export-report";
  let res = get(path, params);
  return res;
};

const exportReport = (body: ExportReport = {}) => {
  let path = "export-report";
  let res = download(path, body, "POST");
  return res;
};

const deleteReport = (_id: string) => {
  let path = "export-report/" + _id;
  let res = del(path);
  return res;
};

const downloadReport = (_id: string) => {
  let path = "export-report/" + _id;
  let res = download(path);
  return res;
};

export { getReports, exportReport, deleteReport, downloadReport };
