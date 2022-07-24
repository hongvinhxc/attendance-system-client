import { getCookie } from "helpers/token";

function getHost() {
  return process.env.REACT_APP_API_URL;
}

function build_request_url(path: string, params: Object) {
  let host = getHost();
  let param_arrays: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    param_arrays.push(`${key}=${value}`);
  }
  return `${host}/${path}?${param_arrays.join("&")}`;
}

async function request(
  requestInfo: RequestInfo,
  method: string,
  payload: Object | null = null,
  type = "json"
) {
  let requestInit: RequestInit = {
    method: method,
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer",
  };
  if (payload) {
    requestInit.body = JSON.stringify(payload);
  }
  let res = await fetch(requestInfo, requestInit);
  if (res.status === 500) {
    return { status: false, message: "Internal Server Error" };
  }
  if (res.status === 401) {
    window.location.href = "/login";
  }
  if (res.status === 422) {
    let data = await res.json();
    return {
      status: false,
      message: data.message.json,
    };
  }

  if (type === "blob") {
    let filename: any = res.headers.get("content-disposition");
    console.log(res);
    
    filename = filename.split("filename=")[1];
    res.blob().then((blob) => {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.setAttribute("download", filename);
      a.click();
    });
    return {
      status: true,
      message: "Downloaded file " + filename,
    };
  }
  return res.json();
}

function get(path: string, params: Object = {}) {
  let requestInfo = build_request_url(path, params);
  return request(requestInfo, "GET");
}

function post(path: string, body: Object) {
  let host = getHost();
  let requestInfo = `${host}/${path}`;
  return request(requestInfo, "POST", body);
}

function put(path: string, body: Object) {
  let host = getHost();
  let requestInfo = `${host}/${path}`;
  return request(requestInfo, "PUT", body);
}

function del(path: string) {
  let host = getHost();
  let requestInfo = `${host}/${path}`;
  return request(requestInfo, "DELETE");
}

function download(path: string, params: Object = {}, method: string = "GET") {
  if (method === "GET") {
    let requestInfo = build_request_url(path, params);
    return request(requestInfo, method, null, "blob");
  }
  let host = getHost();
  let requestInfo = `${host}/${path}`;

  return request(requestInfo, method, params, "blob");
}

export { get, post, put, del, download };
