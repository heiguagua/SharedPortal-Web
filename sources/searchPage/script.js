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
      totalR: 0,
      totalR2: 0,
      totalR3: 0,
      catalogData: [],
      latestDirectory: [],
      listHottestDirectory: [],
      hotAppsByDept: [],
      developerData: [],
      subjectData: [],
      loading1: true,
      loading2: true,
      loading3: true
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
          vm.loading1=false;
          if (result.status == 200) {
            let data = result.data;
            vm.catalogData = data.body;
            if (!data.previous) {
              vm.totalR = data[Pager.totalR];
            }

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
           vm.loading3=false;
          if (result.status == 200) {
            let data = result.data;
            vm.developerData = data.body;
            if (!data.previous) {
              vm.totalR3 = data[Pager.totalR];
            }
          }
        });
    },

    getAppsByDeptData: function (curr_page, search_inp) {
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
           vm.loading2=false;
          if (result.status == 200) {
            let data = result.data;
            vm.subjectData = data.body;
            if (!data.previous) {
              vm.totalR2 = data[Pager.totalR];
            }
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
    keydownLogin(ev) {
      const vm = this;
      var event = ev || window.event;
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.searchKeywords();
      }
    },
    jumpDetailHotestCatalog(item) { //最热目录的跳转---政务基础信息资源目录、  政务主题信息资源目录列表页面
      const vm = this;
      console.log('dirCode',item.resource_map_id);
      vm.$router.push({
        path: '/layout/catalog/resources',
        query: {
          dirName: item.classify_name,
          dirCode: item.resource_map_id,
          hotestTag: true // 跳转后因后台调用接口不同，加上此标志，标志是从最热目录跳转过来
        }
      })
    }
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
