// localStorage 拓展了 cookie 的 4K 限制
// localStorage 会可以将第一次请求的数据直接存储到本地，这个相当于一个 5M 大小的针对于前端页面的数据库，
// 相比于 cookie 可以节约带宽，但是这个却是只有在高版本的浏览器中才支持的。
// localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  let v = window.localStorage.getItem(name);
  if (v == null) {
    return "";
  }
  return v;
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
