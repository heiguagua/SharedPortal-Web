import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";
import Pager from "../../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      activeName: 'latestResources',
      listLatestDbResource: [],
      listHottestResource: [],
      listLatestDirectory: [],
      listHottestDirectory: [],
      listLatestpolicies: [],
      pageTotal: 1,
      inp_seach: '',
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loading5: true,
      dataEmpty: false
    }
  },
  mounted() {
    const vm = this;
    vm.whichClick(vm.$route.query.id)
    vm.handleClick();
  },
  methods: {
    /** 根据url中的参数id 的值判断当前跳转页面显示的是那块内容 */
    whichClick(id) {
      const vm = this;
      switch (id) {
        case "policy":
          vm.activeName = "latestPolicy";
          break;
        case "latestResources":
          vm.activeName = "latestResources";
          break;
        case "hottestPolicy":
          vm.activeName = "hottestPolicy";
          break;
        case "latestCatalog":
          vm.activeName = "latestCatalog";
          break;
        case "hottestCatalog":
          vm.activeName = "hottestCatalog";
          break;
      }
    },
    handleClick(tab, event) {
      const vm = this;
      vm.inp_seach = '';
      let activeName = vm.activeName;
      if (activeName == 'latestResources') {
        vm.LatestDbResourceData(1, vm.inp_seach);
      } else if (activeName == 'hottestPolicy') {
        vm.listHottestResourceData(1, vm.inp_seach);
      } else if (activeName == 'latestCatalog') {
        vm.listLatestDirectoryData(1, vm.inp_seach);
      } else if (activeName == 'hottestCatalog') {
        vm.hottestCatalogData(1, vm.inp_seach)
      } else if (activeName == 'latestPolicy') {
        vm.hotPolicyData(1, vm.inp_seach)
      }
      // vm.pageTotal = 0;
      // console.log(event);
    },
    LatestDbResourceData: function (d_curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestDbResource",
        params: {
          pageSize: 20,
          pageNum: d_curr_page,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading1 = false;
          if (result.status == 200) {
            let data = result.data;
            vm.listLatestDbResource = data.body;
             if(!data.previous){
            vm.pageTotal = data[Pager.totalR];
            }
            
          } else {
            vm.$notify({
              type: "error",
              title: '最新资源',
              message: result.data.message,
            });
          }
        });
    },
    listHottestResourceData: function (d_curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getHottestDirResourceList",
        params: {
          pageSize: 20,
          pageNum: d_curr_page,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading2 = false;
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestResource = data.body;
            if(!data.previous){
            vm.pageTotal = data[Pager.totalR];
            }
          } else {
            vm.$notify({
              type: "error",
              title: '最热资源',
              message: result.data.message,
            });
          }
        });
    },
    listLatestDirectoryData: function (d_curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestDirectory",
        params: {
          pageSize: 20,
          pageNum: d_curr_page,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading3 = false;
          if (result.status == 200) {
            let data = result.data;
            vm.listLatestDirectory = data.body;
           if(!data.previous){
            vm.pageTotal = data[Pager.totalR];
            }
          } else {
            vm.$notify({
              type: "error",
              title: '最新目录',
              message: result.data.message,
            });
          }
        });
    },
    hottestCatalogData: function (d_curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getHottestDirectoryList",
        params: {
          pageSize: 20,
          pageNum: d_curr_page,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading4 = false;
          if (result.status == 200) {
            let data = result.data;
            vm.listHottestDirectory = data.body;
         if(!data.previous){
            vm.pageTotal = data[Pager.totalR];
            }
          } else {
            vm.$notify({
              type: "error",
              title: '最热目录',
              message: result.data.message,
            });
          }
        });
    },
    hotPolicyData: function (d_curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/listLatestpolicies",
        params: {
          pageSize: 10,
          pageNum: d_curr_page,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading5=false;
          if (result.status == 200) {
            var data = result.data;
            if (data.body.length == 0) {
              vm.dataEmpty = true;
            } else {
              vm.dataEmpty = false;
            }
            vm.listLatestpolicies = data.body;
           if(!data.previous){
            vm.pageTotal = data[Pager.totalR];
            }

          } else {
            vm.$notify({
              type: "error",
              title: '最新政策',
              message: result.data.message,
            });
          }
        });
    },
    /**分页 */
    latestResourcesChange(val) {
      const vm = this;
      vm.LatestDbResourceData(val, vm.inp_seach);
    },
    hottestResourcChange(val) {
      const vm = this;
      vm.listHottestResourceData(val, vm.inp_seach);
    },
    latestDirectoryChange(val) {
      const vm = this;
      vm.listLatestDirectoryData(val, vm.inp_seach);
    },
    hottestCatalogChange(val) {
      const vm = this;
      vm.hottestCatalogData(val, vm.inp_seach)
    },
    hotPolicyChange(val) {
      const vm = this;
      vm.hotPolicyData(val, vm.inp_seach);
    },
    /**搜索 */
    searchClick() {
      const vm = this;
      let activeName = vm.activeName;
      if (activeName == 'latestResources') {
        vm.LatestDbResourceData(1, vm.inp_seach);
      } else if (activeName == 'hottestPolicy') {
        vm.listHottestResourceData(1, vm.inp_seach);
      } else if (activeName == 'latestCatalog') {
        vm.listLatestDirectoryData(1, vm.inp_seach);
      } else if (activeName == 'hottestCatalog') {
        vm.hottestCatalogData(1, vm.inp_seach)
      } else if (activeName == 'latestPolicy') {
        vm.hotPolicyData(1, vm.inp_seach);
      }
    },
    /**跳转到数据目录的相应的详情页面 */
    jumpDetailResource(row, event, column) { //资源的跳转---系统实时动态数据资源详情页面
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/system-dynamic-details',
        query: {
          enName: row.TABLE_NAME,
          tableId: row.ID
        }
      })
    },
    jumpDetailLatestCatalog(row, event, column) { //目录的跳转---政务基础信息资源目录、  政务主题信息资源目录
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/details',
        query: {
          dirName: row.dataset_name,
          ddcm_id: row.resource_map_id
        }
      })
    },

  }
};
