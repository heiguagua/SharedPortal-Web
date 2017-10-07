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
            dataset_id: dirCode
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
        vm.getResDetails(vm.dirCode).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            vm.detail_pro = res.data;
          }
          else{
            Notification({
                  type: "error",
                  title: '系统错误',
                  message: res.message,
                });
          }
        });
        vm.getDataTable(vm.dirCode).then(function(res){
          vm.loading = false;
          if(res.status == 200) {
            vm.tableData = res.data;
          }
          else{
            Notification({
                  type: "error",
                  title: '系统错误',
                  message: res.message,
                });
          }
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