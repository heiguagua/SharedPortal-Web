import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";
import Pager from "../../../common/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      tableData: [],
      objCount: {},
      search_inp: "",
      loading: true
    }
  },
  mounted() {
    const vm = this;
    vm.mybugData(1);
  },

  methods: {
    mybugData: function (curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/dataCorrection/getDataCorrections",
        data: {
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading = false;
          if (result.status == 200) {
            let data = result.data;
            vm.tableData = data.body;
            if (!data.previous) {
              vm.objCount.totalR = data[Pager.totalR];
            }
          }
        });
    },
    /** 分页*/
    handleCurrentChange(val) {
      const vm = this;
      vm.mybugData(val, vm.search_inp, vm.initSelectVal);
    },
    /**搜索 */
    searchClick() {
      const vm = this;
      vm.mybugData(1, vm.search_inp, vm.initSelectVal);
    }
  }
};
