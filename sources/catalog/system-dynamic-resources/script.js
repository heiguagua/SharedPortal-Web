import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
import {formatDate} from "../../common/date.js";
import Pager from "../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
      return {
        head_title: this.$route.query.dirName,
        tableData: [],
        loading:true,
        totalResource:0,
        columnCount:0,// 字段项
        currentPage:1,
        keyword:''
      }
    },
    mounted() {
      const vm = this;
      vm.loadData();
    },

    methods: {
      loadData(){
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        var info_system_id = vm.$route.query.info_system_id;
        var db_id = vm.$route.query.db_id;
        console.log(db_id)
        vm.getSystemTables(info_system_id,db_id,vm.currentPage,20,vm.keyword).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            var r_data = res.data;
            vm.tableData = r_data.body;
            vm.totalResource = r_data[Pager.totalR]; //总条数，多少张表或视图
            vm.columnCount = res.data.columnCount; // 字段项

          }
          else{
            Notification({
                  type: "error",
                  title: '系统错误',
                  message: res.data.head.message,
                });
          }
        })
      },
      getSystemTables:function(info_system_id,db_id,currentPage,psize,keyword){
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/dbtable/getSystemTables",
          data: {
            info_system_id: info_system_id,
            db_id:(db_id)?db_id:'',
            pageNum:currentPage,
            size:psize,
            keyword:keyword
          }
        })
      },
      handleCurrentChange(val) {// 点击表格行
        // console.log(val)
        const vm = this;
        this.$router.push({ path: '/layout/catalog/system-dynamic-details',
          query:{enName:val.enName,tableId:val.tableId}})
      },
      handlePageChange(val){// 分页处理
        const vm = this;
        vm.currentPage = val;
        vm.loadData();
      },
      handleSearch(){
        const vm = this;
        vm.currentPage = 1;
        vm.loadData();
      }
    },
    filters:{
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
        }
    }
};
