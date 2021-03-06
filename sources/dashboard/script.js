import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
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
      getDevelopApisData: [],
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
    vm.ResourcesForHomePage();
    vm.getCarouselPicNews(); //最新新闻
    vm.getPorjectPic();
    vm.getDevelopApis(1);
  },
  methods: {
    getDevelopJump: function (tool_url) { //工具
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/developJump",
        data: {
          url: tool_url
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
      console.log(item)
      Http.fetch({
        method: "get",
        url: master + "/home/getClassifyChildrenWithSubchildrenById",
        params: {
          id: pid
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            if (item.type == "2-3") {//政务部门信息资源目录
              vm.parentName = item.name;
              vm.parentId = item.id;
               _.forEach(item.children, function (_item) {
                if (_item.type == '3') {
                  vm.getAllDirMenuInfo(_item);
                }
              })
            }else{
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
               vm.depAllDeptInfoAA = depAllDeptInfo;
            }
            if (item.type != '3') {
              vm.parentName = item.name;
              vm.parentId = item.id;
            }
          }
        });
    },
    getDevelopApis: function (show) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/getDevelopApisByFid",
        data: {
          is_show: show
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.getDevelopApisData = result.data;
          }
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
        });
    },
    Latestpolicies: function (policyType) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestpoliciesForHomePage",
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
        });
    },
      ResourcesForHomePage: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getResourcesForHomePage",
        params: {
          pageSize: 4
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestDirectory=data.hotestCatalogues;
            vm.listHottestResource=data.hotestResources;
            vm.latestDirectory=data.newestCatalogues;
            vm.listLatestDbResource=data.newestResources;
          }
        });
    },

    getCarouselPicNews: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getCarouselPicNews",
        params: {
          pageSize: 3,
          sort:'time_order'
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.carouselPicNews = data.body;
          }
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
      var table_name;
      if(item.cn_name){
        table_name = item.cn_name;
      }else{
        table_name = item.en_name;
      }
      vm.$router.push({
        path: '/layout/catalog/system-dynamic-details',
        query: {
          enName: table_name,
          tableId: item.resource_map_id
        }
      })
    },
    jumpDetailLatestCatalog(item) { //目录的跳转---政务基础信息资源目录、  政务主题信息资源目录
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/details',
        query: {
          dirName: item.resource_name,
          ddcm_id: item.resource_map_id
        }
      })
    },
  }
};
