import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
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
          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '应用部门',
          //     message: "内部错误",
          //   });
          // }
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
            var param_item = vm.$route.query.current_item;
            vm.activeName = themeApplicationsdata[0].name;
            if (param_item) {
              vm.current_item = param_item;
              vm.showLinkDom = true;
              vm.jumpRoute = false;
            } else {
              vm.current_item = themeApplicationsdata[0].children[0].children[0];
              vm.showLinkDom = true;
            }
          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '专题应用',
          //     message: "内部错误",
          //   });
          // }
        });
    },
    count(id) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/home/increaseThematicAppVisitCount",
        data: {
          app_id: id
        }
      }).then(function (result) {
        if (result.status == 200) {
          if (result.data.result) {
            console.log('计数成功')
          }

        }
      })
    },
    showLink: function (item, val) {
      const vm = this;
      if (val != 'dep') {
        vm.activeChild = "";
      }
      vm.current_item = item;
      console.log(vm.current_item)
      vm.showLinkDom = true;

    },
    changeTab: function () {
      const vm = this;
      vm.activeChild = '';
      _.forEach(vm.devthemes, function (_item, index) {
        if (vm.activeName == _item.name) {
          vm.current_item = _item.children[0].children[0];
        }
      })
      vm.showLinkDom = true;
      vm.jumpRoute = true;
    },

  },
};
