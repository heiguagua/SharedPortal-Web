import Http from "./http.js";
import Encrypt from "./encrypt.js";
import {
  Message,
  Notification
} from 'element-ui';
export default {
  /**
   * Is access allowed
   */
  accessibility(to, from, next) {
    if (to.matched.some(record => record.meta.auth)) {
      if (!Encrypt.token.get()) {
        next({
          path: "/login",
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  /**
   * Json Web Token handler
   */
  interceptor() {
    const vm = this;
    Http.fetch.interceptors.request.use(function (config) {
      const token = Encrypt.token.get();
      if (token)
        config.headers.Authorization = "Wiserv " + token;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    Http.fetch.interceptors.response.use(function (response) {
      if (response.status === 511) {
        Message.error({
          message: '登录已失效或用户未登录过，请登录！'
        })
        setTimeout(() => {
          window.location.href = "#/login";
        }, 3000);
      } else if (response.status !== 200 && response.status !== 511) {
        Notification.error({
          title:"系统错误"+response.status,
          message:'Http：'+response.status+"\n"+response.data.message
        })
      }
      // const head = response.data.head;
      // if (head && typeof head === "object" && head.hasOwnProperty("status")) {
      //   if (head.status === 202) {
      //     window.location.href = "#/login";
      //   }
      // }
      return response;
    }, function (error) {

      // Encrypt.token.empty("userName");
      // Encrypt.token.empty("orgName");

      return Promise.reject(error);
    });
  }
}
