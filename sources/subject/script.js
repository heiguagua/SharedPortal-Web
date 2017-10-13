import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
import jquery from "jquery";
const master = Http.url.master;


export default {
  data() {
    return {
      activeName: "",
      activeChild: '',
      devthemes: {},
      data1: [],
      current_item: {},
      istextaDep: true,
      showLinkDom: false,
      jumpRoute: true
    }
  },
  mounted() {
    const vm = this;
    vm.getRemoteDatas();
    if (JSON.stringify(this.$route.query) != "{}") {
      vm.current_item = this.$route.query;
      vm.showLinkDom = true;
      vm.jumpRoute = false;
    }

  },
  methods: {
    handleClick(item, event) {
      const vm = this;
      vm.current_item = item;
      vm.activeChild = item.name;
      vm.showLinkDom = false;
      Http.fetch({
        method: "GET",
        url: master + "/home/getAppsByDept",
        params: {
          pid: event
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.data1 = result.data.rs.aaData;
          } else {
            vm.$message({
              type: "error",
              title: '应用部门',
              message: "内部错误",
            });
          }
        });
    },
    getRemoteDatas: function () {
      const vm = this;
      Http.fetch({
        method: "GET",
        url: master + "/home/getThematicAppData",
      }).then(
        function (result) {
          if (result.status == 200) {
            let themeApplicationsdata = result.data.rs.aaData;
            vm.devthemes = themeApplicationsdata;
            vm.activeName = themeApplicationsdata[0].name;
          } else {
            vm.$message({
              type: "error",
              title: '专题应用',
              message: "内部错误",
            });
          }
        });
    },
    showLink: function (item, val) {
      const vm = this;
      if (val != 'dep') {
        vm.activeChild = "";
      }
      this.$router.push({
        path: `/layout/subject`,
        query: {
          name: item.name,
          appCategoryName: item.appCategoryName,
          visitCount: item.visitCount,
          creatTime: item.creatTime,
          url: item.url
        }
      });
      vm.current_item = item;
      console.log(vm.current_item)
      vm.showLinkDom = true;

    },
    changeTab: function () {
      const vm = this;
      vm.jumpRoute = true;
      vm.showLinkDom = false;
    },
    Boxhide: function () { /*jquery取消隐藏元素*/
      const vm = this;
      jquery(".Box").hide();
    }

  },
};
