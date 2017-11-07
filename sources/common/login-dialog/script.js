import Http from "../http.js";
import Encrypt from "../encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      username: "",
      password: "",
      dialogLoginVisible:true,
      errorShow:false
    }
  },
  methods: {
loginAjax(name, m5_password) { //登录
      return Http.fetch({
        method: "get",
        url: Http.url.master + "/login",
        params: {
          username: name,
          password: m5_password
        }
      })
    },
    onSubmit() {
      const vm = this;
      let m5_password = Encrypt.md5Encrypt(vm.password);
      vm.loginAjax(vm.username, m5_password).then(function (result) {
        if (result.status == 200) {
          const data = result.data;
          vm.$message({
            showClose: true,
            message: '登录成功！',
            type: 'success'
          });
          Encrypt.token.set("orgName", data.orgName);
          Encrypt.token.set("userName", data.userName);
          vm.$router.go(0);
        } else {
          vm.loginAjax_11();
        }
      })
    },
    loginAjax_11() {//截取密码前11位
      const vm = this;
      let m5_password_11 = Encrypt.md5Encrypt(vm.password).substr(0, 11);
      vm.loginAjax(vm.username, m5_password_11).then(function (result) {
        if (result.status == 200) {
          const data = result.data;
          vm.$message({
            showClose: true,
            message: '登录成功！',
            type: 'success'
          });
          Encrypt.token.set("orgName", data.orgName);
          Encrypt.token.set("userName", data.userName);
          vm.$router.go(0);
        } else {
          vm.errorShow = true;
        }
      })
    },

  }
};
