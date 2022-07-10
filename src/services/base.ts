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
  payload: Object | null = null
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

export { get, post, put, del };
