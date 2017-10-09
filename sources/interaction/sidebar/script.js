import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
export default {
  mounted() {
    const vm = this;
    if (vm.$route.path == '/layout/interaction') {
      vm.$router.push("/layout/interaction/aboutUs");
    }
  }
};
