import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading:true,
      head_title:'',
      detail_pro:[],
      activeTab: 'itemlist',
      tableDataItem:[],
      loading:true,
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
          url: master + "/businessrequirement/getBusinessreQuirementDetailsById",
          data: {
            require_source_id: dirCode,
          }
        })
      },
      
      loadData(){
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        vm.dirCode = vm.$route.query.dirCode;
        vm.getResDetails(vm.dirCode).then(function(res){
          vm.loading=false;
          if(res.status == 200) {
            vm.detail_pro = res.data;
          }
          else{
            vm.$notify({
                  type: "error",
                  title: '查询错误',
                  message: res.data.message,
                });
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