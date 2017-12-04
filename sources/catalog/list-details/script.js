import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
import Pager from "../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading:true,
      head_title:'',
      detail_pro:{},
      tableData:[],  //下方表格数据
      currentPage:1, //当前页
      totalResource:0,
      loading:true,
      activeTab: 'itemlist',
      tableDataItem:[],
      operateble:false,
        correctionForm: {
          content: ''
        },
        rateForm:{
          stars:0
        }
    }
  },
  mounted() {
      const vm = this;
      vm.loadData();
      var username = Encrypt.token.get("userName");
      if(username) {
        vm.operateble = true;
      }
      else{
        vm.operateble = false;
      }
    },

  methods: {
      getResDetails:function(dirCode){// 获取资源详情
        return Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetAllDetailsById",
          data: {
            ddcm_id: dirCode
          }
        })
      },
      getDataTable:function(dirCode) {//获取下方表数据
        return Http.fetch({
          method: "post",
          url: master + "/dataitem/getDatItemByDateSetId",
          data: {
            dataset_id: dirCode
          }
        })
      },
      loadData(){
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        vm.dirCode = vm.$route.query.dirCode;
        vm.ddcm_id = vm.$route.query.ddcm_id
        vm.getResDetails(vm.ddcm_id).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            vm.detail_pro = res.data;
          }
          // else{
          //   vm.$notify({
          //         type: "error",
          //         title: '错误',
          //         message: res.data.message,
          //       });
          // }
        });
        vm.getDataTable(vm.dirCode).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            vm.tableData = res.data;
          }
          // else{
          //   vm.$notify({
          //         type: "error",
          //         title: '错误',
          //         message: res.data.message,
          //       });
          // }
        })
      },
      handleItemDetail(itemName,uuid){//点击数据项名称
        this.$router.push({ path: '/layout/catalog/itemDetails',query:{itemName:itemName,uuid:uuid}});
      },
      handlePageChange(val){// 分页处理
        const vm = this;
        vm.currentPage = val;
        vm.loadData();
      },
      goback(){
        this.$router.go(-1);
      }
  }
};