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
        infoSystem:{},
        loading:true,
        totalResource:0,
        itemCount:0,
        currentPage:1,
        keyword:''
      }
    },
    mounted() {
      const vm = this;
      vm.getInfoSystem(vm.$route.query.infoSystemId).then(function(res){
        if(res.status == 200) {
          vm.infoSystem = res.data;
        }
      });
      vm.loadData(false);
    },

    methods: {
      loadData(cache_total){
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        var dirCode = vm.$route.query.dirCode;
        var infoSystemId = vm.$route.query.infoSystemId
        vm.getTableList(dirCode,infoSystemId,vm.currentPage,20,vm.keyword).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            var r_data = res.data;
              if (!cache_total) {
            vm.tableData = r_data.body;
            vm.totalResource = r_data[Pager.totalR];
          }
            vm.tableData = r_data.body;
            vm.totalResource = r_data[Pager.totalR];
          }
        })
      },
      getTableList: function(dirCode,infoSystemId,currentPage,psize,keyword) {
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetByInfoSystemId",
          data: {
            info_system_Id: infoSystemId,
            dept_Id: dirCode,
            pageNum:currentPage,
            size:psize,
            keywords:keyword
          }
        })
      },
          getInfoSystem: function (system_Id) { // 获取系统详情
      return Http.fetch({
        method: "post",
        url: master + "/infosystem/getInfoSystemById",
        data: {
          info_system_Id: system_Id
        }
      })
          },
      handleCurrentChange(val) {// 点击表格行
        console.log(val)
        this.currentRow = val;
        this.$router.push({ path: '/layout/catalog/list-details',
          query:{dirName:val.dataset_name,dirCode:val.dataset_id,ddcm_id:val.ddcm_id}})
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
      },
      goback() {
        this.$router.go(-1);
      }
    },
    filters:{
        formatDate(time){
          if(time) {
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
          }
            return '无';
        }
    }
};