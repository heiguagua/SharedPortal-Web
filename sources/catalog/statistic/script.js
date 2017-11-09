import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      loading:true,
      head_title: this.$route.query.dirName,
      tableData: []
    }
  },
  mounted() {
      const vm = this;
      vm.head_title = vm.$route.query.dirName;
      vm.getListStatistics(vm.$route.query.id).then(function(res){
        vm.loading = false;
        if(res.status == 200) {
          vm.tableData = res.data;
        }
        else{
          vm.$notify({
                type: "error",
                title: '系统列表',
                message: res.data.message,
              });
        }
      })
    },

  methods: {
  	getListStatistics:function(id){
        const vm = this;
        return Http.fetch({
        method: "post",
        url: master + "/classify/getStatisticsById",
        data: {
          id: id
        }
      })
    },
    handleCurrentChange(val) {
        this.currentRow = val;
    }
  }
};