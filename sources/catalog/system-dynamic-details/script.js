import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
import {formatDate} from "../../common/date.js";
import Pager from "../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading: true,
      head_title: '',
      detail_pro: {}, //详情
      tableDataItem: [], //信息
      activeTab: 'itemlist',
      tableInterfaces: [],
      // totalResource:0,
      currentPage: 1,
      pageSize: 5,
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
      vm.tableId = vm.$route.query.tableId;
      vm.getSystemTableById(vm.tableId).then(function (res) {
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
      vm.tableId = vm.$route.query.tableId;
      vm.getSystemTableColumns(vm.tableId, vm.currentPage, vm.pageSize).then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
          var r_data = res.data;
          vm.tableDataItem = r_data.body;
          // vm.totalResource= r_data[Pager.totalR];//total
        } else {
          Notification({
            type: "error",
            title: '系统错误',
            message: res.message,
          });
        }
      })
    },
    //获取系统动态数据资源信息
    getSystemTableById: function (table_Id) {
      return Http.fetch({
        method: "post",
        url: master + "/dbtable/getSystemTableById",
        data: {
          table_Id: table_Id
        }
      })
    },
    //获取系统动态数据资源列表信息
    getSystemTableColumns: function (table_Id, currentPage, pageSize) {
      return Http.fetch({
        method: "post",
        url: master + "/dbtable/getSystemTableColumns",
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
      vm.TableColumns();
    },
    handleClick(tab, event) {
      const vm = this;
      // console.log(tab, event);
      if (tab.name == "interfaceinfo") {
        vm.getInterfaces(vm.$route.query.tableId).then(function (res) {
          vm.tableInterfaces = res.data;
        })
      }
    },
    getInterfaces: function (table_Id) { // 获取接口信息
      return Http.fetch({
        method: "post",
        url: master + "/serviceinfo/getServiceInfoByObjId",
        data: {
          obj_Id: table_Id
        }
      })
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
  },
};
