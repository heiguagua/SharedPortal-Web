import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
      return {
        head_title: '',
        itemDetail:{}
      }
    },
    mounted() {
      const vm = this;
      vm.loadData();
    },

    methods: {
      // getItemDetail:function(uuid){// 查询数据项详情
      //   return Http.fetch({
      //     method: "get",
      //     url: master + "/dataitem/itemDetail",
      //     params: {
      //       uuid: uuid// 数据项code
      //     }
      //   })
      // },
      loadData(){
        const vm = this;
        vm.head_title = vm.$route.query.itemName;
        vm.itemDetail = vm.$route.query.itemObj;
        // vm.getItemDetail(uuid).then(function(res){
        //   if(res.status == 200) {
        //       vm.itemDetail = res.data;
        //     }
        //     else{
        //       vm.$message({
        //             type: "error",
        //             title: '查询详情失败！',
        //             message: res.message
        //       });
        //     }
        // })
      },
      goback(){
        this.$router.go(-1);
      }
    }
};