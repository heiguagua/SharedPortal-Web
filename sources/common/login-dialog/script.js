import Http from "../http.js";
import Encrypt from "../encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      username: "",
      password: "",
      dialogLoginVisible: true,
      errorShow: false,
      errorMessage:null
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
            vm.dialogLoginVisible = false;
            Encrypt.token.set("orgName", data.orgName);
            Encrypt.token.set("userName", data.userName);
            vm.$router.go(0);
          } else {
            vm.errorMessage=result.data.message;
            vm.errorShow = true;
          }
        })
    }
  }
};
