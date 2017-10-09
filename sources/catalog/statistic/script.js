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
      vm.getListStatistics(vm.head_title).then(function(res){
        vm.loading = false;
        if(res.status == 200) {
          vm.tableData = res.data;
        }
        else{
          Notification({
                type: "error",
                title: '系统列表',
                message: res.data.head.message,
              });
        }
      })
    },

  methods: {
  	getListStatistics:function(dirName){
        const vm = this;
        return Http.fetch({
        method: "post",
        url: master + "/classify/getStatisticsByName",
        data: {
          classify_name: dirName
        }
      })
    },
    handleCurrentChange(val) {
        this.currentRow = val;
    }
  }
};