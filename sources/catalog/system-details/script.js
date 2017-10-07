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
      head_title: '',
      totalResource: 0,
      currentPage: 1,
      pageSize: 5,
      detail_pro: {}, //详情
      tableDataItem: [], //信息
    }
  },
  mounted() {
    const vm = this;
    vm.loadDataTable();
    vm.tableColumns();
  },

  methods: {
    loadDataTable() {
      const vm = this;
      vm.head_title = vm.$route.query.enName;
      vm.getSystemTableById(vm.$route.query.tableId).then(function (res) {
        if (res.status == 200) {
          vm.detail_pro = res.data;
        } else {
          Notification({
            type: "error",
            title: '系统错误',
            message: res.message,
          });
        }
      })
    },
    tableColumns() {
      const vm = this;
      //获取系统信息列表
      vm.getSystemTableColumns(vm.$route.query.tableId, vm.currentPage, vm.pageSize).then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
          var r_data = res.data;
          vm.tableDataItem = r_data.body;
          vm.totalResource = r_data[Pager.totalR]; //total
        } else {
          Notification({
            type: "error",
            title: '系统错误',
            message: res.message,
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
      vm.tableColumns();
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
