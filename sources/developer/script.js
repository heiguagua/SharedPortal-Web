import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      activeName: "",
      devApps: {},
      subAppList: [],
      current_item: {},
      showLinkDom: false
    }
  },
  mounted() {
    const vm = this;

    vm.getDevApps('root'); //获取系统列表
  },
  methods: {
    handleClick(tab, event) {
      this.subAppList=[];
      this.showLinkDom=false;
      var pid = tab.$attrs.id;
      this.getSubApps(pid,true);
    },
    getDevAppsHttp: function (id) {
      return Http.fetch({
        method: "post",
        url: master + "/developapis/getDevelopApisByFid",
        data: {
          devlp_Id: id,
          is_use:1
        }
      })
    },
    getDevApps: function (devlp_Id,jump) {
      const vm = this;
      vm.getDevAppsHttp(devlp_Id).then(
        function (result) {
          if (result.status == 200) {
            var data = result.data;
            vm.devApps = data;
            var param_item = vm.$route.query.current_item;
            if (param_item) {
              vm.current_item = param_item;
              vm.activeName = param_item.parent_id;
              vm.showLinkDom = true;
              vm.getSubApps(param_item.parent_id,false);
            } else {
              vm.showLinkDom = false;
              vm.activeName = data[0].devlp_Id;
              vm.getSubApps(data[0].devlp_Id,true);
            }
          } 
        });
    },
    getSubApps: function (devlp_Id,jump) {
      const vm = this;
      vm.getDevAppsHttp(devlp_Id).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            if(data){
              vm.showLinkDom=false;
            }
            vm.subAppList = data;
            if(jump){
               vm.current_item = result.data[0];
            }
            vm.showLinkDom = true;
          } else {
            vm.$message({
              type: "error",
              title: '查询出错！',
              message: result.data.message,
            });
          }
        });
    },
    showLink: function (item) {
      const vm = this;
      vm.current_item = item;
      vm.showLinkDom = true;
    },
    count(id) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/increaseDevelopApiVisitCount",
        data: {
          api_id: id
        }
      }).then(function (result) {
        if (result.status == 200) {
          console.log('计数成功')
        }
      })
    },
  }
};
