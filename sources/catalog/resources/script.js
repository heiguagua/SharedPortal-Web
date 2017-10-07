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
        itemCount:0,
        currentPage:1,
        keyword:'',
        showTable:true //表格视图
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
        var dirCode = vm.$route.query.dirCode;
        vm.getResources(dirCode,vm.currentPage,20,vm.keyword).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            var r_data = res.data;
            vm.tableData = r_data.body;
            vm.totalResource = r_data[Pager.totalR];
            vm.itemCount = res.data.itemCount; // 数据项
          }
          else{
             vm.$message({
                  type: "error",
                  title: '系统错误',
                  message: res.message,
                });
          }
        })
      },
      getResources: function(dirCode,currentPage,psize,keyword) {
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetByClassfyTreeCode",
          data: {
            tree_code: dirCode,
            pageNum:currentPage,
            size:psize,
            keywords:keyword
          }
        })
      },
      toggleView(showTable) {
        const vm = this;
        console.log(showTable);
        vm.showTable = showTable;
      },
      handleCurrentChange(val) {// 点击表格行
        this.currentRow = val;
        this.$router.push({ path: '/layout/catalog/details',
          query:{dirName:val.dataset_name,ddcm_id:val.ddcm_id}})
      },
      handlePageChange(val){// 分页处理
        console.log(val)
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
          if(!time) {
            return "";
          }
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
        }
    }
};
