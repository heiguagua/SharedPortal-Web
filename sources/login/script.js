import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
export default {
  data() {
    return {
      username: "",
      password: "",
      errorShow: false
    }
  },
  methods: {
    onSubmit() {
      const vm = this;
      Http.fetch({
          method: "get",
          url: Http.url.master + "/login",
          params: {
            username: vm.username,
            password: Encrypt.md5Encrypt(vm.password)
          }
        })
        .then(function (result) {
          if (result.status == 200) {
            const data = result.data;
            vm.$message({
              showClose: true,
              message: '登录成功！',
              type: 'success'
            });
            Encrypt.token.set("orgName", data.orgName);
            Encrypt.token.set("userName", data.userName);
            vm.$router.push("/layout/dashboard");
          } else {
            vm.errorShow = true;
          }


          // if (Http.protocol(data, 200)) {
          //   alert(data.head.message);
          //   Encrypt.token.set(data.head.token);
          //   vm.$router.push("/layout/dashboard");
          // }
        })
    },
    keydownLogin(ev) {
      const vm = this;
      var event = ev || window.event;
      alert(1)
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.onSubmit();
      }
    }
  }
};
