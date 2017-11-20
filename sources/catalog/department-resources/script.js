import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
// import {
//   formatDate
// } from "../../common/date.js";
import Pager from "../../common/pager.js";
import elLogin from "../../common/login-dialog/index.vue";
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
        showStyle:{
          display:'none'
        },
        showDialogComponent:false,
      }
    },
    mounted() {
      const vm = this;
      var username = Encrypt.token.get("userName");
      if (username) {
        vm.showStyle ={
          display:'block'
        }
        // vm.$refs.business.style.display = "block";
        // vm.$refs.search.style.display = "block";
      } else {
        vm.$message({
          showClose: true,
          message: '请登录！',
          duration: 2000,
          type: 'warning',
          customClass: "warning-alert"
        });
        setTimeout(function() {
        vm.showDialogComponent =true;
        },1000);
        // 弹出登录框
        // setTimeout(function() {
        //   // vm.$parent.$parent.openLoginDialog();

        // }, 1000);
      }
      vm.loadData(false);
    },
    methods: {
      loadData(cache_total) {
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        var deptId = vm.$route.query.dirCode;
        vm.getBusinessTableList( vm.currentPage, 20, deptId, vm.keyword).then(function(res) {
          vm.loading = false;
          if (res.status == 200) {
            var r_data = res.data;
            vm.tableData = r_data.body;
              if(!cache_total) {
            vm.totalResource = r_data[Pager.totalR];//总共多少页
              }
          } else {
            vm.$notify({
              type: "error",
              title: '错误',
              message: res.data.message,
            });
          }
        })
      },
      getBusinessTableList: function(currentPage, psize, deptId, keyword) {
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/businessactivity/getBusinessActivityByDeptId",
          data: {
            pageNum: currentPage,
            size: psize,
            dept_Id: deptId,
            keywords: keyword
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
      }
    },
    // filters: {
    //   formatDate(time) {
    //     let date = new Date(time);
    //     return formatDate(date, 'yyyy-MM-dd');
    //   }
    // }
};
