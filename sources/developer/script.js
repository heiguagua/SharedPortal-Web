import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      activeName: "",
      devApps: {},
      subAppList:[],
      current_item:{},
      showLinkDom:false
    }
  },
  mounted() {
    const vm = this;
    
    vm.getDevApps(); //获取系统列表
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.$attrs);
      var pid = tab.$attrs.id;
      this.getSubApps(pid);
    },
    getDevApps: function() {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/getDevelopApisByFid"
      }).then(
        function(result) {
          if (result.status == 200) {
            var data = result.data;
            vm.devApps = data;
            var param_item = vm.$route.query.current_item;
            if(param_item) {
              vm.current_item = param_item;
              vm.activeName = param_item.parent_name;
              vm.showLinkDom = true;
              vm.getSubApps(param_item.parent_id);
            }
            else{
              vm.showLinkDom = false;
              vm.activeName = data[0].api_name;
              vm.getSubApps(data[0].devlp_Id);
            }
          } else {
            vm.$message({
              type: "error",
              title: '查询出错！',
              message: result.message,
            });
          }
        });
    },
    getSubApps: function(devlp_Id) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/developapis/getDevelopApisByFid",
        data:{
          devlp_Id:devlp_Id
        }
      }).then(
        function(result) {
          if (result.status == 200) {
            vm.subAppList = result.data;
          } else {
            vm.$message({
              type: "error",
              title: '查询出错！',
              message: result.message,
            });
          }
        });
    },
    showLink:function(item,$event){
      const vm = this;
      vm.current_item = item;
      vm.showLinkDom = true;
    }
  }
};
