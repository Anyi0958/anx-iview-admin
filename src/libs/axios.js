import axios from "axios";
import { getStore, setStore } from "./storage";
import { router } from "../router/index";
import { Message } from "view-design";
import Cookies from "js-cookie";
// 统一请求路径前缀
let base = "/xboot";
// 超时设定
axios.defaults.timeout = 15000;

// request 拦截器
axios.interceptors.request.use(
  config => {
    // 这里可以自定义一些config 配置
    return config;
  },
  err => {
    Message.error("请求超时");
    return Promise.resolve(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    const data = response.data;

    // 根据返回的code值来做不同的处理(和后端约定)
    switch (data.code) {
      case 401:
        // 未登录 清除已登录状态 清除锁屏状态
        Cookies.set("userInfo", "");
        Cookies.set("locking", "0");
        setStore("accessToken", "");
        if (router.history.current.name != "login") {
          if (data.message !== null) {
            Message.error(data.message);
          } else {
            Message.error("未知错误，请重新登录");
          }
          router.push("/login");
        }
        break;
      case 403:
        // 没有权限
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.error("未知错误");
        }
        break;
      case 500:
        // 错误
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.error("未知错误");
        }
        break;
      default:
        return data;
    }

    return data;
  },
  err => {
    // 返回状态码不为200时候的错误处理
    Message.error(err.toString());
    return Promise.resolve(err);
  }
);

export const request = (method, url, params, type, auth) => {
  // method   请求方法，必填
  // url      请求地址，必填
  // params   请求参数
  // type     请求数据类型，默认form
  // auth     是否携带凭证，默认携带

  let accessToken = getStore("accessToken");
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (type) {
    headers["Content-Type"] =
      type == "form"
        ? "application/x-www-form-urlencoded"
        : type == "json"
        ? "application/json;charset=UTF-8"
        : "";
  }
  if (auth === undefined || auth) {
    headers["accessToken"] = accessToken;
  }

  return axios({
    method: method,
    url: `${base}${url}`,

    // `params` 是即将与请求一起发送的 URL 参数
    // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
    params: method == "get" ? params : "",

    // `data` 是作为请求主体被发送的数据
    data: method != "get" ? {} : params,

    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: type == "blob" ? "blob" : "json",

    // `transformRequest` 允许在向服务器发送前，修改请求数据
    // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    transformRequest: [
      function (data) {
        // 对 data 进行任意转换处理
        if (type == "json") return JSON.stringify(data);
        let ret = "";
        for (let it in data) {
          ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      },
    ],

    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [
      function (data) {
        // 对 data 进行任意转换处理
        return data;
      },
    ],

    // `headers` 是即将被发送的自定义请求头
    headers: headers,
  });
};

// 并发多个请求
// axios.all([getUserAccount(), getUserPermissions()])
//   .then(axios.spread(function (acct, perms) {
//     两个请求现在都执行完成
//   }));
export const allRequest = async params => {
  let res = [];
  await axios.all(params).then(
    axios.spread(function () {
      res = [...arguments];
      return res;
    })
  );
  return res;
};

export const getRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "get",
    url: `${base}${url}`,
    params: params,
    headers: {
      accessToken: accessToken,
    },
  });
};

export const postRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function (data) {
        let ret = "";
        for (let it in data) {
          ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      },
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accessToken: accessToken,
    },
  });
};

export const putRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function (data) {
        let ret = "";
        for (let it in data) {
          ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      },
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accessToken: accessToken,
    },
  });
};

export const postBodyRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      accessToken: accessToken,
    },
  });
};

/**
 * 无需token验证的GET请求 避免旧token过期导致请求失败
 * @param {*} url
 * @param {*} params
 */
export const getNoAuthRequest = (url, params) => {
  return axios({
    method: "get",
    url: `${base}${url}`,
    params: params,
  });
};

export const postNoAuthRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function (data) {
        let ret = "";
        for (let it in data) {
          ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      },
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
