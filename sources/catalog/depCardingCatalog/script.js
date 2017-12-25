import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      depData: [],
      depFidData: [],
      current_dep: '全部',
      current_type: this.$route.query.dirName,
      current_depFid: '全部',
      current_pingYingName:'全部',
      current_type_path: '',
      current_pingiying:'',
      typeList: [{
          'name': '业务目录',
          "hasLeaf": "0",
          path: 'department-resources'
        },
        {
          'name': '需求目录',
          "hasLeaf": "0",
          path: 'demand-resources'
        }, {
          'name': '系统目录',
          "hasLeaf": "0",
          path: 'economy-resources'
        }
      ],
      pingYingList: [{
        'name': '全部',
        'value': ''
      }, {
        'name': 'A-G',
        'value': 'ABCDEFG'
      }, {
        'name': 'H-N',
        'value': 'HIJKLMN'
      }, {
        'name': 'O-T',
        'value': 'OPQRST'
      }, {
        'name': 'U-Z',
        'value': 'UVWXYZ'
      }],
      showDepFid: false,
      isActive: true,
      fidActive: true
    }
  },
  mounted() {
    const vm = this;
    vm.head_title = vm.$route.query.dirName;
    vm.getDepartmentDataSecondLevelChild('','').then(function (res) {
      // vm.loading = false;
      if (res.status == 200) {
        let data = res.data;
        data.unshift({
          dept_Id: "",
          hasLeaf: 1,
          name: "全部"
        });
        vm.depData = data;
      }
    })
  },
  methods: {
    getDepartmentDataSecondLevelChild: function (fId,pingying) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/dept/getDeptByFid",
        data: {
          fId: fId,
          firstLetter:pingying
        }
      })
    },
     getDep: function (item) {
      const vm = this;
      vm.current_pingYingName = item.name;
      vm.current_pingiying = item.value;
      if (vm.current_type_path == '') { //当页面刷新时获取路由
        let current_path = vm.$route.path;
        vm.current_type_path = current_path.split('/')[4];
      }
       vm.getDepartmentDataSecondLevelChild('',item.value).then(function (res) {
          if (res.status == 200) {
            let data = res.data;
            data.unshift({
              dept_Id: "",
              hasLeaf: 0,
              name: "全部"
            });
            vm.depData = data;
          }
        });
        let depitem = {'name':'全部','tree_code':''}
        vm.getDepType(depitem);
    },
    getDeptByFid: function (item) {
      const vm = this;
      vm.current_dep = item.name;
      if (vm.current_type_path == '') { //当页面刷新时获取路由
        let current_path = vm.$route.path;
        vm.current_type_path = current_path.split('/')[4];
      }
      if (item.name == '全部') {
        vm.showDepFid = false;
      } else {
        vm.showDepFid = true;
        vm.current_depFid = '全部';
        vm.getDepartmentDataSecondLevelChild(item.dept_Id).then(function (res) {
          if (res.status == 200) {
            let data = res.data;
            data.unshift({
              dept_Id: "",
              hasLeaf: 0,
              name: "全部"
            });
            vm.depFidData = data;
          }
        });
      }
      vm.getDepType(item);
    },
    getDepData: function (item) {
      const vm = this;
      vm.current_depFid = item.name;
      vm.getDepType(item);
    },
    getDepType: function (item) {
      const vm = this;
       vm.current_dep =item.name;
      if (item.name == '系统目录' || item.name == '业务目录' || item.name == '需求目录') {
        vm.current_dep = '全部';
        vm.showDepFid = false
        vm.current_type = item.name;
        vm.current_type_path = item.path;
      }
      if(!!item.tree_code){
      vm.current_pingiying = '';
      }
      vm.$router.push({
        path: `/layout/catalog/depCardingCatalog/${vm.current_type_path}`,
        query: {
          dirName: vm.current_type,
          dirCode: item.tree_code,
          firstLetter:vm.current_pingiying
        }
      })
    },
    openDep: function () {
      this.isActive = !this.isActive;
    },
    openFid: function () {
      this.fidActive = !this.fidActive;
    }
  },
};
