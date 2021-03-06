import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";
// import {
//   formatDate
// } from "../../../common/date.js";
import Pager from "../../../common/pager.js";
import elLogin from "../../../common/login-dialog/index.vue";
const master = Http.url.master;
export default {
  components: {
    elLogin
  },
  data() {
    return {
      head_title: this.$route.query.dirName,
      tableData: [],
      loading: true,
      totalResource: 0,
      itemCount: 0,
      currentPage: 1,
      keyword: '',
      service_target:null,
      service_target_options:null,
      showStyle: {
        display: 'none'
      },
      showDialogComponent: false,
    }
  },
  mounted() {
    const vm = this;
    // var username = Encrypt.token.get("userName");
    // if (username) {
    //   vm.showStyle = {
    //     display: 'block'
    //   }
    //   // vm.$refs.business.style.display = "block";
    //   // vm.$refs.search.style.display = "block";
    // } else {
    //   vm.$message({
    //     showClose: true,
    //     message: '请登录！',
    //     duration: 2000,
    //     type: 'warning',
    //     customClass: "warning-alert"
    //   });
    //   setTimeout(function () {
    //     vm.showDialogComponent = true;
    //   }, 1000);
      // 弹出登录框
      // setTimeout(function() {
      //   // vm.$parent.$parent.openLoginDialog();

      // }, 1000);
    // }
    vm.getSysDict('serviceTarget');
    vm.loadData(false);
  },
  methods: {
    loadData(cache_total) {
      const vm = this;
      vm.head_title = vm.$route.query.dirName;
      let code = vm.$route.query.dirCode;
      let pinying = vm.$route.query.firstLetter;
      vm.getBusinessTableList(vm.currentPage, 20, code, vm.keyword,pinying,vm.service_target).then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
          var r_data = res.data;
          vm.tableData = r_data.body;
          if (!cache_total) {
            vm.totalResource = r_data[Pager.totalR]; //总共多少页
          }
        }
      })
    },
    getSysDict: function (target) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/sysdict/getSysDictByCategory",
        data:{
          category:target
        }
      }).then(function(result){
        vm.service_target_options = result.data;
      })
    },
     getBusinessTableList: function (currentPage, psize, treeCode, keyword,pingying,dict_code) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/businessactivity/getBusinessActivityByDeptTreeCode",
        data: {
          pageNum: currentPage,
          size: psize,
          tree_code: treeCode,
          keywords: keyword,
          firstLetter:pingying,
          serviceTarget:dict_code
        }
      })
    },
    handleCurrentChange(val) { // 点击表格行
      this.currentRow = val;
      this.$router.push({
        path: '/layout/catalog/business-details',
        query: {
          dirName: val.activity_name,
          setId: val.business_activity_Id
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
      toggleServiceTarget(){
        const vm = this;
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
