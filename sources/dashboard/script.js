import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
import {
  formatDate
} from "../common/date.js";
const master = Http.url.master;
export default {
  props: ['sysObj'],
  data() {
    return {
      keywords: "", //搜索关键词
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
      current_active: '',
      parentName: '',
      parentId: "",
      carouselPicNews: [],
      porjectPic: [],
      depAllDeptInfoAA: [],
      depAllDeptInfoData: [],
      dirFirstName: [],
      getDevelopApisData:[],
      carouselDetail: {},
      dialogNewVisible: false,
      showMorecatalog: false,
      icon: false
    }
  },
  mounted() {
    const vm = this;
    vm.getDirNodesByParent();
    vm.getCountDataShare(); //资源统计
    vm.Latestpolicies("G"); //最新政策
    vm.latestDirectoryData(); //最新目录
    vm.HottestDirectoryData(); //最热目录
    vm.LatestDbResourceData(); //最新资源
    vm.HottestResourceData(); //最热资源
    vm.getCarouselPicNews(); //最新新闻
    vm.getPorjectPic();
    vm.getDevelopApis(1);
  },
  methods: {
      getDevelopJump: function (tool_url) {//工具
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/developJump",
         data: {
          url:tool_url
        }
      }).then(
        function (result) {
          if (result.status == 200) {
           window.open(result.data);
          }
        });
    },
    getAllDirMenuInfo: function (item) {
      const vm = this;
      var pid = item.id;
      Http.fetch({
        method: "get",
        url: master + "/home/getClassifyChildrenWithSubchildrenById",
        params: {
          id: pid
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

            if (item.type == "2-3") {
              vm.parentName = item.name;
              vm.parentId = item.id;
              _.forEach(depAllDeptInfo, function (_item) {
                if (_item.type == '3') {
                  vm.getAllDirMenuInfo(_item);
                }
              })

            }
            vm.depAllDeptInfoAA = depAllDeptInfo;
            if (item.type != '3') {
              vm.parentName = item.name;
              vm.parentId = item.id;
            }
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '基础目录',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    getDevelopApis: function (show) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/getDevelopApisByFid",
         data: {
          is_show:show
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.getDevelopApisData = result.data;
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '工具',
          //     message: result.data.message,
          //   });
          // }
        });
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
          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '资源统计',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    Latestpolicies: function (policyType) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestpolicies",
        params: {
          policyType: policyType,
          pageSize: 5
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


          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新政策',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    latestDirectoryData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestDirectory",
        params: {
          resourceType: "directory",
          pageSize: 4
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.latestDirectory = data.body;
          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新动态-最新目录',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    HottestDirectoryData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getHottestDirectoryList",
        params: {
          pageSize: 4
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestDirectory = data.body;
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新动态-最热目录',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    LatestDbResourceData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestDbResource",
        params: {
          pageSize: 4
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listLatestDbResource = data.body;
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新动态-最新资源',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    HottestResourceData: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getHottestDirResourceList",
        params: {
          pageSize: 4,
          resourceType: "service"
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestResource = data.body;
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新动态-最热资源',
          //     message: result.data.message,
          //   });
          // }
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
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新新闻',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    getPorjectPic: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getCarouselPictures"
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.porjectPic = data;
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '轮播图',
          //     message: result.data.message,
          //   });
          // }
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
          }
          //  else {
          //   vm.$notify({
          //     type: "error",
          //     title: '新闻详情',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    getDirNodesByParent: function () {
      const vm = this;
      vm.depAllDeptInfoAA = [];
      return Http.fetch({
        method: "get",
        url: master + "/home/getClassifyChildrenWithSubchildrenById",
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.dirFirstName = result.data;
            vm.getAllDirMenuInfo(vm.dirFirstName[1]); //主题目录
            vm.current_active = vm.dirFirstName[1].name
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '系统错误',
          //     message: result.data.message,
          //   });
          // }
        });
    },
    clickMenu: function (item) {
      const vm = this;
      vm.current_active = item.name;
      vm.getAllDirMenuInfo(item);
    },
    searchKeywords() { //search
      const vm = this;
      vm.$router.push({
        path: '/layout/searchPage',
        query: {
          // keywords: $.trim(vm.keywords)
          keywords: _.trim(vm.keywords)
        }
      })
    },
    keydownSearch(ev) {
      const vm = this;
      var event = ev || window.event;
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.searchKeywords();
      }
    },
    /** 最新动态跳转到数据目录详情页面*/
    jumpDetailResource(item) { //资源的跳转---系统实时动态数据资源
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/system-dynamic-details',
        query: {
          enName: item.TABLE_NAME,
          tableId: item.ID
        }
      })
    },
    jumpDetailLatestCatalog(item) { //目录的跳转---政务基础信息资源目录、  政务主题信息资源目录
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/details',
        query: {
          dirName: item.dataset_name,
          ddcm_id: item.resource_map_id
        }
      })
    },
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    }
  }
};
