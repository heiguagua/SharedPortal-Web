import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
import Pager from "../common/pager.js";
import {
  formatDate
} from "../common/date.js";
const master = Http.url.master;
export default {
  data() {
    return {
      countDataShare: {},
      keywords: this.$route.query.keywords,
      activeName: "catalog",
      totalR:0,
      catalogData: [],
      latestDirectory: [],
      listHottestDirectory: [],
      hotAppsByDept: [],
      developerData: [],
      subjectData:[],
    }
  },
  mounted() {
    const vm = this;
    vm.latestDirectoryData();
    vm.HottestDirectoryData();
    vm.getAppsByDeptList();
    vm.getCatalogData(1, vm.keywords);

  },
  methods: {
    searchKeywords() {
      const vm = this;
      let activeName = vm.activeName;
      if (activeName == 'catalog') {
        vm.getCatalogData(1, vm.keywords);
      } else if (activeName == 'subject') {
        vm.getAppsByDeptData(1, vm.keywords);
      } else if (activeName == 'developer') {
        vm.getDeveloperData(1, vm.keywords);
      }
    },
    handleClick(tab, event) {
      const vm = this;
      let activeName = vm.activeName;
      if (activeName == 'catalog') {
        vm.getCatalogData(1, vm.keywords);
      } else if (activeName == 'subject') {
         vm.getAppsByDeptData(1, vm.keywords);
      } else if (activeName == 'developer') {
        vm.getDeveloperData(1, vm.keywords);
      }
    },
    /**分页 */
    handlePageChangeCatalog(val) {
      const vm = this;
      vm.getCatalogData(val, vm.keywords);
    },
    handlePageChangeSubject(val) {
       const vm = this;
 vm.getAppsByDeptData(val, vm.keywords);
    },
    handlePageChangeDeveloper(val) {
      const vm = this;
      vm.getDeveloperData(val, vm.keywords);
    },
    getCatalogData: function (curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getDirResourceBriefInfoList",
        params: {
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading = false;
          if (result.status == 200) {
            let data = result.data;
            vm.catalogData = data.body;
            vm.totalR = data[Pager.totalR];
          } else {
            Notification({
              type: "error",
              title: '数据目录',
              message: result.message,
            });
          }
        });
    },

    getDeveloperData: function (curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getDevelopApiInfoList",
        params: {
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading = false;
          if (result.status == 200) {
            let data = result.data;
            vm.developerData = data.body;
            vm.totalR = data[Pager.totalR];
          } else {
            Notification({
              type: "error",
              title: '开发者工具',
              message: result.message,
            });
          }
        });
    },

        getAppsByDeptData: function (curr_page,search_inp) {
      const vm = this;
      Http.fetch({
        method: "GET",
        url: master + "/home/getAppInfoList",
        params: {
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.subjectData = data.body;
             vm.totalR = data[Pager.totalR];
          } else {
            vm.$message({
              type: "error",
              title: '专题应用',
              message: "内部错误",
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
          pageSize: 5
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
          pageSize: 5
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
    getAppsByDeptList: function () {
      const vm = this;
      Http.fetch({
        method: "GET",
        url: master + "/home/getAppInfoList",
        params: {
          orderBy: "visitCount",
           pageSize: 5,
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.hotAppsByDept = result.data.body;
          } else {
            vm.$message({
              type: "error",
              title: '热门应用',
              message: "内部错误",
            });
          }
        });
    },
    titlehtml(val) {
      var title = val;
      var keywords = this.keywords;
      return title.replace(keywords, '<span style="color: #4197F4;">' + keywords + '</span>');
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
    },
    //  jumpDetailSubject(item) { //专题应用
    //   const vm = this;
    //   vm.$router.push({
    //     path: '/layout/subject',
    //     query: {
    //       id: item.id
    //     }
    //   })
    // },
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    }
  }
};
