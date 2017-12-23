import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading:true,
      head_title:'',
      detail_pro:{},
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
          url: master + "/businessactivity/getBusinessActivityDetailsById",
          data: {
            business_activity_Id: dirCode
          }
        })
      },
      
      loadData(){
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        vm.dirCode = vm.$route.query.setId;
        vm.getResDetails(vm.dirCode).then(function(res){
          if(res.status == 200) {
            vm.detail_pro = res.data;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      goback(){
        this.$router.go(-1);
      }
  }
};