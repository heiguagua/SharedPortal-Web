import Http from "./http.js";
import Encrypt from "./encrypt.js";
import {Message} from 'element-ui';
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
    Http.fetch.interceptors.request.use(function (config) {
      const token = Encrypt.token.get();
      if (token)
        config.headers.Authorization = "Wiserv " + token;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    Http.fetch.interceptors.response.use(function (response) {
      console.log(response);
      if(response.status  === 511) {
        window.location.href = "#/login";
      }
      // const head = response.data.head;
      // if (head && typeof head === "object" && head.hasOwnProperty("status")) {
      //   if (head.status === 202) {
      //     window.location.href = "#/login";
      //   }
      // }
      return response;
    }, function (error) {
     
      Encrypt.token.empty("userName");
      Encrypt.token.empty("orgName");

      return Promise.reject(error);
    });
  }
}
