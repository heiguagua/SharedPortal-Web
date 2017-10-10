import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      countDataShare: {},
      keywords:this.$route.query.keywords
    }
  },
  mounted() {
    const vm = this;
    vm.getCountDataShare(); //资源统计
    
  },

  methods: {
    getCountDataShare: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/countDataShareSituation"
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.countDataShare = result.data;
          } else {
            Notification({
              type: "error",
              title: '资源统计',
              message: result.message,
            });
          }
        });
    },
      searchKeywords(){
        
      }
  }
};
