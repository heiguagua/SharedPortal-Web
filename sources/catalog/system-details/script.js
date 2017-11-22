import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
import {
  formatDate
} from "../../common/date.js";
import Pager from "../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading: true,
      loading2:true,
      head_title: '',
      totalResource: 0,
      currentPage: 1,
      pageSize: 5,
      detail_pro: {}, //详情
      tableDataItem: [], //信息
      tableInterfaces:[],
      activeTab: 'itemlist',
    }
  },
  mounted() {
    const vm = this;
    vm.loadDataTable();
    vm.tableColumns(false);
  },

  methods: {
    loadDataTable() {
      const vm = this;
      vm.head_title = vm.$route.query.enName;
      vm.getSystemTableById(vm.$route.query.tableId).then(function (res) {
        if (res.status == 200) {
          vm.detail_pro = res.data;
        } else {
          vm.$notify({
            type: "error",
            title: '错误',
            message: res.data.message,
          });
        }
      })
    },
    tableColumns(cache_total) {
      const vm = this;
      //获取系统信息列表
      vm.getSystemTableColumns(vm.$route.query.tableId, vm.currentPage, vm.pageSize).then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
          var r_data = res.data;
          vm.tableDataItem = r_data.body;
          console.log(vm.tableDataItem)
          if(!cache_total) {
            vm.totalResource = r_data[Pager.totalR]; //total
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
    //  查询系统静态数据资源目录 详情
    getSystemTableById: function (table_Id) {
      return Http.fetch({
        method: "post",
        url: master + "/dicttable/getSystemTableById",
        data: {
          table_Id: table_Id
        }
      })
    },
    //查询系统静态数据资源目录 列表信息
    getSystemTableColumns: function (table_Id, currentPage, pageSize) {
      return Http.fetch({
        method: "post",
        url: master + "/dicttable/getSystemTableColumns",
        data: {
          table_Id: table_Id,
          pageNum: currentPage,
          size: pageSize,
        }
      })
    },
    handlePageChange(val) { // 分页处理
      const vm = this;
      vm.currentPage = val;
      vm.tableColumns(true);
    },
    handleClick(tab, event) {
      const vm = this;
      // console.log(tab, event);
      if (tab.name == "interfaceinfo") {
        vm.relatedResources(vm.$route.query.tableId).then(function (res) {
           vm.loading2 = false;
          vm.tableInterfaces = res.data;
        })
      }
    },
     relatedResources: function (table_id) { // 获取关联资源信息列表
      return Http.fetch({
        method: "post",
        url: master + "/dataset/getDataSetByTableId",
        data: {
          table_Id: table_id
        }
      })
    },
    handleCurrentChange(val) {// 点击关联资源表格行
        this.currentRow = val;
          this.$router.push({ path: '/layout/catalog/details',
           query:{dirName:val.dataset_name,ddcm_id:val.ddcm_id}})
          //  query:{dirName:'身份证信息',ddcm_id:'7A6EEE21822B4F9DAEF9ADDA47B1FCA4'}})
      },
    goback() {
      this.$router.go(-1);
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    }
  }
};
