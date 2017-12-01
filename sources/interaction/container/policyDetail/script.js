import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";

const master = Http.url.master;
export default {
  data() {
    return {
      latestPolicyItem: {}
    }
  },
  mounted() {
    const vm = this;
    vm.hotPolicyDataItem(vm.$route.params.id)
  },

  methods: {
    hotPolicyDataItem: function (uuid) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getPolicyDetailById",
        params: {
          policyId: uuid
        }
      }).then(
        function (result) {
          if (result.status == 200) {
           vm.latestPolicyItem = result.data;
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '最新政策详情',
          //     message: result.message,
          //   });
          // }
        });
    },
  }
};
