import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
export default {
 computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
      }
  },
};
