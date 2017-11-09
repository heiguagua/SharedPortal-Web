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
        keyword:''
      }
    },
    mounted() {
      const vm = this;
      vm.loadData(true);
    },

    methods: {
      loadData(cache_total){
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        var dirCode = vm.$route.query.dirCode;
        vm.getTableList(dirCode,vm.currentPage,20,vm.keyword).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            console.log(res)
            var r_data = res.data;
            vm.tableData = r_data.body;
             if(!cache_total){
            vm.totalResource = r_data[Pager.totalR];
            vm.itemCount = res.data.itemCount; // 数据项
             }
          }
          else{
           vm.$notify({
                  type: "error",
                  title: '系统错误',
                  message: res.data.message,
                });
          }
        })
      },
      getTableList: function(dirCode,currentPage,psize,keyword) {
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/infosystem/getInfoSystemByDeptId",
          data: {
            info_system_Id: dirCode,
            dept_Id:"",
            size:psize,
            pageNum:currentPage,
            keywords:keyword
          }
        })
      },
      handleCurrentChange(val) {// 点击表格行
        const vm = this;
        console.log(val)
        this.currentRow = val;
        this.$router.push({ path: '/layout/catalog/economy-extend-resourses',
          query:{dirName:val.system_name,dirCode:vm.$route.query.dirCode,infoSystemId:val.info_system_Id}})
      },
      handlePageChange(val){// 分页处理
        const vm = this;
        vm.currentPage = val;
        vm.loadData(true);
      },
      handleSearch(){
        const vm = this;
        vm.currentPage = 1;
        vm.loadData(false);
      }
    },
    filters:{
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
        }
    }
};