import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      islogin: false,
      username: "",
      password: "",
      sysObj: {},
      satelliteInfo: [],
      dialogLoginVisible: false,
      errorShow: false,
      errorMessage:null
    }
  },
  mounted() {
    const vm = this;
    vm.isloginStatus();
    vm.getSysName();
    vm.getSatelliteInfo('footer');
  },

  methods: {
    /**登录状态 */
    isloginStatus() {
      const vm = this;
      let name = Encrypt.token.get("userName");
      vm.username = name;
      if (name) {
        vm.islogin = true;
      }
    },
    /**退出登录 */
    loginOut: function () {
      const vm = this;
      vm.$confirm('是否退出系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Http.fetch({
          method: "get",
          url: master + "/loginOut",
        }).then(
          function (result) {
            if (result.status == 200) {
              Encrypt.token.empty("userName");
              Encrypt.token.empty("orgName");
              vm.islogin = false;
              vm.$router.push("/login");
  
            }
          });
      })
      
    },
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
            vm.islogin = true;
            Encrypt.token.set("orgName", data.orgName);
            Encrypt.token.set("userName", data.userName);
             vm.$router.push({
              path: vm.$route.fullPath,
              query: {
                t: +new Date()
              }
            })
          } else {
            vm.errorMessage=result.data.message;
            vm.errorShow = true;
          }
        })
    },
    openLoginDialog: function () {
      this.dialogLoginVisible = true;
    },
    getSatelliteInfo: function (type) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getSatelliteInfo",
        params: {
          category: type
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.satelliteInfo = data[0];
          }
        });
    },
  }
};
