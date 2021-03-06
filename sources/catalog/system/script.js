import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading: true,
      head_title: this.$route.query.dirName,
      tableData: []
    }
  },
  mounted() {
    const vm = this;
    vm.head_title = vm.$route.query.dirName;
    if(vm.head_title=='系统静态数据资源目录'){
      vm.getStaticSystemCounts().then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
          vm.tableData = res.data;
        }
      })
    }else if(vm.head_title=='系统实时动态数据资源'){
      vm.getDynamicSystemCounts().then(function (res) {
        // console.log(res)
        vm.loading = false;
        if (res.status == 200) {
          vm.tableData = res.data;
        }
      })
    }

  },

  methods: {
    //系统静态数据资源目录 --统计
    getStaticSystemCounts:function(){
      const vm = this;
      return Http.fetch({
      method: "post",
      url: master + "/dicttable/getSystemCounts",
       data:{
            id:1//该参数无意义但必须存在
          }
    })
   },
   //系统实时动态数据资源 --统计
   getDynamicSystemCounts:function(){
    const vm = this;
    return Http.fetch({
    method: "post",
    url: master + "/dbtable/getSystemCounts"
  })
 },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
