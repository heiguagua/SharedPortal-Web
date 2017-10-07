import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";

const master = Http.url.master;
export default {
  data() {
    return {
     guideUrl:''
    }
  },
  mounted() {
    const vm = this;
   vm.guideUrl=master + "/home/downloadUserGuide";
  },
};
