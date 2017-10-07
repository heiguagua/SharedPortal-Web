import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
import jquery from "jquery";
const master = Http.url.master;


export default {
  data() {
    return {
      activeName: "",
      devthemes: {},
      data1:[],
      current_item:{},
      istextaDep:true,
      isadd:false,
      showLinkDom:false,
    }
  },
  mounted() {
    const vm = this;
    vm.getRemoteDatas();
  },
  methods: {
    handleClick(event) {
      const vm = this;
      vm.isadd = true;
      Http.fetch({
        method: "get",
        url: `${master}/home/subjectsDep`,
        params: {
          pid:event
        }
      }).then(
        function (result) {
          if(result.status == 200){
            vm.data1 = result.data.rs.aaData;
          }else {
            Notification({
              type: "error",
              title: '应用部门',
              message: "内部错误",
            });
          }
        });
    }
    ,
    getRemoteDatas: function () {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/subjects"
      }).then(
        function (result) {
          if(result.status == 200){
            let themeApplicationsdata = result.data.rs.aaData;
            vm.devthemes = themeApplicationsdata;
            vm.activeName = themeApplicationsdata[0].name;
          }else {
            Notification({
              type: "error",
              title: '专题应用',
              message: "内部错误",
            });
          }
        });
    },
    showLink:function(item,$event){
      const vm = this;
      vm.current_item = item;
      vm.showLinkDom = true;
    }
    ,
    changeTab:function(){
      const vm = this;
      vm.showLinkDom = false;
    }
  },
};
