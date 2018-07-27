export const baseUrl = "https://cnodejs.org/api/v1";

// 拼接get参数
export const getParamsUrl = (url, params) => {
  let paramsArray = [];
  Object.keys(params).forEach(key => paramsArray.push(key + "=" + params[key]));
  if (url.search(/\?/) === -1) {
    url += "?" + paramsArray.join("&");
  } else {
    url += "&" + paramsArray.join("&");
  }
  return url;
};

// 获取列表
export const getTopics = async ({ page, tab, limit, mdrender }) => {
  let url = getParamsUrl(baseUrl + "/topics", { page, tab, limit, mdrender });
  let res = await fetch(url, { method: "GET" });
  let json = await res.json();
  return json;
};

// 获取详情
export const getTopic = async id => {
  let url = baseUrl + "/topic/" + id;
  let res = await fetch(url, { method: "GET" });
  let json = await res.json();
  return json;
};

// 通过用户名获取用户数据
export const getUserByLoginname = async loginname => {
  let url = baseUrl + "/user/" + loginname;
  let res = await fetch(url, { method: "GET" });
  let json = await res.json();
  return json;
};

// 通过accesstoken获取用户数据
export const getUserByToken = async ({ accesstoken }) => {
  let url = baseUrl + "/accesstoken";

  let res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accesstoken })
  });
  let json = await res.json();
  return json;
};

// 发布帖子
export const publishTopic = async ({ accesstoken, title, content, tab }) => {
  let url = baseUrl + "/topics";
  let res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accesstoken, title, content, tab })
  });
  let json = await res.json();
  return json;
};

// 获取用户信息
export const getInfo = async loginname => {
  let url = baseUrl + "/user/" + loginname;
  let res = await fetch(url, { method: "GET" });
  let json = await res.json();
  return json;
};

// 获取消息
export const getMsg = async ({ accesstoken }) => {
  let url = getParamsUrl(baseUrl + "/messages", { accesstoken });
  let res = await fetch(url, { method: "GET" });
  let json = await res.json();
  return json;
};

// 点赞
export const ups = async ({ replyID, accesstoken }) => {
  let url = baseUrl + "/reply/" + replyID + "/ups";
  let res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accesstoken })
  });
  let json = await res.json();
  return json;
};

// 评论
export const reply = async ({ topic_id, accesstoken, content, reply_id }) => {
  let url = baseUrl + "/topic/" + topic_id + "/replies";
  let res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accesstoken, content, reply_id })
  });
  let json = await res.json();
  return json;
};
