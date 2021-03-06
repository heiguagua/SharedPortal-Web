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
              vm.showLinkDom = false;
              for (var index in themeApplicationsdata[0].children) {
                if (!!themeApplicationsdata[0].children[index].children) {
                  vm.current_item = themeApplicationsdata[0].children[index].children[0];
                  vm.showLinkDom = true;
                  break;
                }
              }
            }
          }
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
          vm.showLinkDom = false;
          for (var index in _item.children) {
            if (!!_item.children[index].children) {
              vm.current_item = _item.children[index].children[0];
              vm.showLinkDom = true;
              break;
            }
          }
        }
      })
      vm.jumpRoute = true;
    },

  },
};
