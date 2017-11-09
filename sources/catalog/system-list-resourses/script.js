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
        total:0
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
        vm.getTableList(dirCode,vm.currentPage,20,vm.keyword).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            console.log(888,res)
            var r_data = res.data;
            vm.tableData = r_data.body;
            vm.totalResource = r_data[Pager.totalR];
            vm.itemCount = res.data.itemCount; // 处室
            vm.total = res.data.total //资源
          }
          else{
            vm.$notify({
                  type: "error",
                  title: '错误',
                  message: res.data.message,
                });
          }
        })
      },
      getTableList: function(deptId,currentPage,psize,keyword) {
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetByInfoSystemId",
          data: {
            dept_Id: deptId,
            pageNum:currentPage,
            size:psize,
            keywords:keyword
          }
        })
      },
      handleCurrentChange(val) {// 点击表格行
        this.currentRow = val;
        this.$router.push({ path: '/layout/catalog/list-details',
          query:{dirName:val.dataset_name,dirCode:val.dataset_id}})
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