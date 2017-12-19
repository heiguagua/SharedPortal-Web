import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
export default {
  data() {
    return {
      disable:false,
      username: "",
      password: "",
      sysObj: "",
      errorShow: false,
      errorMessage:null
    }
  },
  mounted() {
    const vm = this;
    vm.getSysName();
  },
  methods: {
    getSysName: function () { //系统名称
      const vm = this;
      Http.fetch({
        method: "get",
        url: Http.url.master + "/home/getPorjectPotalNames"
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.sysObj = result.data;
            document.title = result.data.projectPortalName;
          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '系统错误',
          //     message: result.data.message,
          //   });
          // }
        });
    },
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
       vm.disable=true;
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
          if(vm.$route.query.redirect){
              vm.$router.push(vm.$route.query.redirect);
            }else{
              vm.$router.push('/layout/dashboard');
            }
        } else {
          vm.loginAjax_11();
        }
         vm.disable=false;
      })
    },
    loginAjax_11() { //截取密码前11位
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
         if(vm.$route.query.redirect){
              vm.$router.push(vm.$route.query.redirect);
            }else{
              vm.$router.push('/layout/dashboard');
            }
        } else {
          vm.errorMessage= data.message;
          vm.errorShow = true;
        }
      })
    },
    keydownLogin(ev) {
      const vm = this;
      var event = ev || window.event;
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.onSubmit();
      }
    }
  }
};
