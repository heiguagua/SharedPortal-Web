import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";
// import {
//   formatDate
// } from "../../../common/date.js";
import Pager from "../../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      head_title: this.$route.query.dirName,
      tableData: [],
      loading: true,
      totalResource: 0,
      itemCount: 0,
      currentPage: 1,
      keyword: '',
      phisical_location_options: null,
      system_level_options: null,
      self_build_flag_options: null,
      phisical_location: null,
      system_level: null,
      self_build_flag: null
    }
  },
  mounted() {
    const vm = this;
    vm.getSysDictByCategory("systemDeploymentLocation").then(function (res) {
      if (res.status == 200) {
        vm.phisical_location_options = res.data;
      }
    });
    vm.getSysDictByCategory("systemLevel").then(function (res) {
      if (res.status == 200) {
        vm.system_level_options = res.data;
      }
    });
    vm.getSysDictByCategory("isLoacl").then(function (res) {
      if (res.status == 200) {
        vm.self_build_flag_options = res.data;
      }
    });
    vm.loadData(false);
  },

  methods: {
    loadData(cache_total) {
      const vm = this;
      vm.head_title = vm.$route.query.dirName;
      let dirCode = vm.$route.query.dirCode;
      let pinying = vm.$route.query.firstLetter;
      vm.getTableList(dirCode, vm.currentPage, 20, vm.keyword, pinying,vm.phisical_location,vm.system_level,vm.self_build_flag).then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
          console.log(res)
          var r_data = res.data;
          vm.tableData = r_data.body;
          if (!cache_total) {
            vm.totalResource = r_data[Pager.totalR];
            vm.itemCount = res.data.itemCount; // 数据项
          }
        }
      })
    },
    getTableList: function (dirCode, currentPage, psize, keyword, pingying,location,syslevel,selfbuild) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/infosystem/getInfoSystemByDeptTreeCode",
        data: {
          // info_system_Id: dirCode,
          tree_code: dirCode,
          size: psize,
          pageNum: currentPage,
          keywords: keyword,
          firstLetter: pingying,
          phisicalLocation:location,
          systemLevel:syslevel,
          selfBuildFlag:selfbuild
        }
      })
    },
    getSysDictByCategory: function (target) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/sysdict/getSysDictByCategory",
        data: {
          category:target
        }
      })
    },
    handleCurrentChange(val) { // 点击表格行
      const vm = this;
      console.log(val)
      this.currentRow = val;
      this.$router.push({
        path: '/layout/catalog/economy-extend-resourses',
        query: {
          dirName: val.system_name,
          dirCode: vm.$route.query.dirCode,
          infoSystemId: val.info_system_Id
        }
      })
    },
    handlePageChange(val) { // 分页处理
      const vm = this;
      vm.currentPage = val;
      vm.loadData(true);
    },
    handleSearch() {
      const vm = this;
      vm.currentPage = 1;
      vm.loadData(false);
    },
     togglePhisicalLocation(){
        const vm = this;
        console.log(vm.open_status);
        vm.loadData(false);
      },
      toggleSystemLevel(){
        const vm = this;

        vm.loadData(false);
      },
       toggleSelfBuildFlag(){
        const vm = this;
        console.log(vm.open_status);
        vm.loadData(false);
      }
  },
  // filters: {
  //   formatDate(time) {
  //     let date = new Date(time);
  //     return formatDate(date, 'yyyy-MM-dd');
  //   }
  // },
  watch: {
    $route() {
      this.loadData(false);
    }
  }
};
