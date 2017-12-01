import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";

const master = Http.url.master;
export default {
  data() {
    return {
      aboutUsInfo:{}
    }
  },
  mounted() {
    const vm = this;
    vm.getSatelliteInfo('aboutUs');
  },
  methods: {
    getSatelliteInfo: function (type) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getSatelliteInfo",
        params: {
          category: type
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.aboutUsInfo = data[0];
          } 
          // else {
          //   vm.$notify({
          //     type: "error",
          //     title: '版权信息',
          //     message:result.data.message,
          //   });
          // }
        });
    },
  }
};
