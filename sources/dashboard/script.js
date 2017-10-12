import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      keywords:"",//搜索关键词
      countDataShare: "",
      latestpolicies_G: "",
      latestpolicies_S: "",
      latestpolicies_C: "",
      activeName: "G",
      activeCatalog: "topic",
      latestDirectory: "",
      listHottestDirectory: "",
      listLatestDbResource: "",
      listHottestResource: "",
      carouselPicNews: [],
      depAllDeptInfoAA: [],
      depAllDeptInfoAB: [],
      depAllDeptInfoData: [],
      carouselDetail: {},
      dialogNewVisible: false,
      showMorecatalog: false,
      icon: false
    }
  },
  mounted() {
    const vm = this;
    vm.getCountDataShare(); //资源统计
    vm.Latestpolicies("G"); //最新政策
    vm.latestDirectoryData(); //最新目录
    vm.HottestDirectoryData(); //最热目录
    vm.LatestDbResourceData(); //最新资源
    vm.HottestResourceData(); //最热资源
    vm.getCarouselPicNews(); //最新新闻
    vm.getAllDirMenuInfo(2); //主题目录
  },
  methods: {
    getAllDirMenuInfo: function (Pid) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getDirMenuInfoForFrontPage",
        params: {
          pid: Pid
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            var depAllDeptInfo = [];
            if (result.data.length < 15) {
              vm.showMorecatalog = false;
              var depAllDeptInfo = result.data;
            } else {
              vm.showMorecatalog = true;
              for (var i = 0; i < 13; i++) {
                depAllDeptInfo.push(result.data[i]);
              }
            }
            if (Pid == 1) {
              vm.depAllDeptInfoAA = depAllDeptInfo;
            } else {
              vm.depAllDeptInfoAB = depAllDeptInfo;
              console.log(vm.depAllDeptInfoAB)
            }
          } else {
            Notification({
              type: "error",
              title: '基础目录',
              message: result.message,
            });
          }
        });
    },
    getAllDeptInfo: function (Pid) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getAllDeptInfoForFrontPage",
        params: {
          pid: Pid
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            if (result.data.length < 15) {
              vm.showMorecatalog = false;
              var depAllDeptInfo = result.data;
            } else {
              vm.showMorecatalog = true;
              var depAllDeptInfo = [];
              for (let i = 0; i < 13; i++) {
                depAllDeptInfo.push(result.data[i]);
              }
            }
            vm.depAllDeptInfoData = depAllDeptInfo;

          } else {
            Notification({
              type: "error",
              title: '部门目录',
              message: result.message,
            });
          }
        });
    },
    getCatalogList: function (type) {
      const vm = this;
      vm.showMorecatalog = false;
      vm.depAllDeptInfoAA = [];
      vm.depAllDeptInfoAB = [];
      vm.depAllDeptInfoData = [];
      if (type == 'base') {
        vm.getAllDirMenuInfo(1);
      } else if (type == 'topic') {
        vm.getAllDirMenuInfo(2);
      } else {
        vm.getAllDeptInfo();
      }
    },
    getCountDataShare: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/countDataShareSituation"
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.countDataShare = result.data;
          } else {
            Notification({
              type: "error",
              title: '资源统计',
              message: result.message,
            });
          }
        });
    },
    Latestpolicies: function (policyType) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestpolicies",
        params: {
          policyType: policyType,
          pageSize: 6
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            if (policyType == "G") {
              let data = result.data;
              vm.latestpolicies_G = data.body;
            } else if (policyType == "S") {
              let data = result.data;
              vm.latestpolicies_S = data.body;
            } else {
              let data = result.data;
              vm.latestpolicies_C = data.body;
            }


          } else {
            Notification({
              type: "error",
              title: '最新政策',
              message: result.message,
            });
          }
        });
    },
    latestDirectoryData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestDirectory",
        params: {
          resourceType: "directory",
          pageSize: 3
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.latestDirectory = data.body;
          } else {
            Notification({
              type: "error",
              title: '最新动态-最新目录',
              message: result.message,
            });
          }
        });
    },
    HottestDirectoryData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getHottestDirectoryList",
        params: {
          pageSize: 3
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestDirectory = data.body;
          } else {
            Notification({
              type: "error",
              title: '最新动态-最热目录',
              message: result.message,
            });
          }
        });
    },
    LatestDbResourceData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestDbResource",
        params: {
          pageSize: 3
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listLatestDbResource = data.body;
          } else {
            Notification({
              type: "error",
              title: '最新动态-最新资源',
              message: result.message,
            });
          }
        });
    },
    HottestResourceData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getHottestDirResourceList",
        params: {
          pageSize: 3,
          resourceType: "service"
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestResource = data.body;
          } else {
            Notification({
              type: "error",
              title: '最新动态-最热资源',
              message: result.message,
            });
          }
        });
    },
    getCarouselPicNews: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getCarouselPicNews",
        params: {
          pageSize: 3
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.carouselPicNews = data.body;
          } else {
            Notification({
              type: "error",
              title: '最新新闻',
              message: result.message,
            });
          }
        });
    },
    getCarouselDetail: function (item) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getCarouselDetail",
        params: {
          newsId: item.id
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.carouselDetail = result.data;
            vm.dialogNewVisible = true;
          } else {
            Notification({
              type: "error",
              title: '新闻详情',
              message: result.message,
            });
          }
        });
    },
    searchKeywords() { //search
      const vm = this;
       vm.$router.push({
        path: '/layout/searchPage',
        query: {
          keywords:$.trim(vm.keywords)
        }
      })
    },
     keydownLogin(ev) {
      const vm = this;
      var event = ev || window.event;
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.searchKeywords();
      }
    },
    /** 最新动态跳转到数据目录详情页面*/
    jumpDetailResource(item) { //最新资源的跳转---系统实时动态数据资源
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/system-dynamic-details',
        query: {
          enName: item.TABLE_NAME,
          tableId: item.ID
        }
      })
    },
    jumpDetailHotResource(item) { //最热资源的跳转---政务基础信息资源目录、  政务主题信息资源目录详情页面
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/details',
        query: {
          enName: item.dataset_name,
          tableId: item.resource_map_id
        }
      })
    },
    jumpDetailLatestCatalog(item) { //最新目录的跳转---政务基础信息资源目录、  政务主题信息资源目录
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/details',
        query: {
          dirName: item.dataset_name,
          ddcm_id: item.resource_map_id
        }
      })
    },
    jumpDetailHotestCatalog(item) { //最热目录的跳转---政务基础信息资源目录、  政务主题信息资源目录列表页面
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/resources',
        query: {
          dirName: item.classify_name,
          dirCode: item.tree_code
        }
      })
    }
  }
};
