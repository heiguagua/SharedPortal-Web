import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
   props:['sysObj'],
  data() {
    return {
      regions: [],
      regions_load_cl:0,//登录后regions的长度
      regions1: [{
        'name': '业务目录',
        "hasLeaf": "0",
        path: 'department-resources'
      }, 
      // {
      //   'name': '资源目录',
      //   "hasLeaf": "1",
      //   path: 'list-resources'
      // }, {
      //   'name': '共享目录',
      //   "hasLeaf": "1",
      //   path: 'shared-resources'
      // }, {
      //   'name': '开放目录',
      //   "hasLeaf": "1",
      //   path: 'open-resources'
      // },
       {
        'name': '需求目录',
        "hasLeaf": "0",
        path: 'demand-resources'
      }, {
        'name': '系统目录',
        "hasLeaf": "0",
        path: 'economy-resources'
      }
      // , {
      //   'name': '系统资源目录',
      //   "hasLeaf": "1",
      //   path: 'system-list-resourses'
      // }
    ],
      props: {
        label: 'name',
        children: 'children'
      },
      count: 1,
      rootNode: {} ,//顶层节点data,
      expandedKeys:[],//默认进来展开政务部门信息资源目录
    }
  },
  mounted() {
    const vm = this;
    var username = Encrypt.token.get("userName");
    
    vm.getDirNodesByParent().then(function(res){
      console.log(res);
      vm.regions = res.data;
      _.forEach(vm.regions,function(item){
        item.path = "statistic";
      });
      vm.regions.push({
        'id':4,
        'name': '系统静态数据资源目录',
        'path': 'system'
      });
      if (username) {
        vm.regions.push({
         'id':1,
        'name': '部门政务信息梳理目录',
       'path': 'department'
      },{
          'name': '系统实时动态数据资源',
          'path': 'system'
        })
        vm.regions_load_cl = vm.regions.length
      }
       if(vm.$route.path == '/layout/catalog'){
         vm.expandedKeys = [vm.regions[0].id];
         vm.$router.push({
            path: '/layout/catalog/statistic',
            query: {
              dirName: vm.regions[0].name,
              id: vm.regions[0].id
            }
          })
       }
    })

  },
  methods: {
    handleNodeClick(data, node) {
      var vm = this;
      if(vm.regions.length == vm.regions_load_cl){//无论是否登录regions_length的值都是登录状态下的regions的数组个数
         var regions_length = vm.regions.length;//第一级的数组个数
      }else{
        var regions_length = vm.regions.length + 2;
      }
      vm.expandedKeys =[];
      var root =vm.findParent(node);
      let rootPath = root.path;
      let rootName = root.name;
      if (node.level === 1) {
        this.$router.push({
          path: `/layout/catalog/${data.path}`,
          query: {
            dirName: data.name,
            id:data.id
          }
        });
      }else{
          if (rootPath == vm.regions[0].path) {
              this.$router.push({
            path: '/layout/catalog/resources',
            query: {
              dirName: data.name,
              dirCode: data.tree_code
            }
          })
        }else if(rootPath == vm.regions[regions_length-3].path){//部门政务信息梳理目录下的一级目录设置路由

           this.$router.push({
              path: '/layout/catalog/system-resources',
              query: {
                dirName: data.name,
                info_system_id: data.info_system_id,
                db_id:(data.hasOwnProperty('db_id'))?data.db_id:''
              }
            })


        }
        else{
            if(vm.regions.length == vm.regions_load_cl && rootName ==vm.regions[regions_length-1].name){
            this.$router.push({
              path: '/layout/catalog/system-dynamic-resources',
              query: {
                dirName: data.name,
                info_system_id: data.info_system_id,
                db_id:(data.hasOwnProperty('db_id'))?data.db_id:''
              }
            })
          }else{
                 if (node.level === 2) {
            this.$router.push({
              path: `/layout/catalog/depCardingCatalog/${data.path}`,
              query: {
                dirName: data.name,
                dirCode: data.dept_Id
              }
            })
          }else {
            let loadPath = vm.findNode(node);
            this.$router.push({
              path: `/layout/catalog/depCardingCatalog/${loadPath}`,
              query: {
                dirName: data.name,
                dirCode: data.dept_Id
              }
            })
          }
          }
        }
      }
    },
    loadNode(node, resolve) { // 加载子节点
      const vm = this;
    
      if (node.level === 0) {
        return resolve(vm.regions);
      }

        if(node.level === 1 && node.data.path == "department") {
          return resolve(vm.regions1);
      }
  
      var hasChild;
      console.log(node.data);
      if (node.level === 1 || node.data.hasLeaf === 1 ||node.data.hasLeaf === "1") {
        hasChild = true;
      } else {
        hasChild = false;
      }

      setTimeout(() => {
        var data;
        var dir_code = node.data.code ? node.data.code : null;
        var root =vm.findParent(node);
        let rootPath = root.path;
        let rootName = root.name;
        if (hasChild) {
          if(node.level === 1) {// 第一级根节点
            //如果系统静态数据资源目录加载第一层子目录接口
            if(rootName =="系统静态数据资源目录"){
              vm.getSystemStaticDataFirstLevelChild().then(function (res) {
                if (res.status == 200) {
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }

              });
            }else if(rootName =="系统实时动态数据资源"){
              vm.getSystemDynamicDataFirstLevelChild().then(function (res) {
                if (res.status == 200) {
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }

              });
            }else{
              vm.getDirNodesByParent(node.data.id).then(function (res) {
                if (res.status == 200) {
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }

              });
            }


          }
          else{
            //如果系统静态数据资源目录加载第二层子目录接口
            if(rootName =="系统静态数据资源目录"){
              vm.getSystemStaticDataSecondLevelChild(node.data.info_system_id).then(function (res) {
                if (res.status == 200) {
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }

              });
            }else if(rootName =="系统实时动态数据资源"){
              vm.getSystemDynamicDataSecondLevelChild(node.data.info_system_id).then(function (res) {
                if (res.status == 200) {
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }

              });
                 }
            else if(rootName =="部门政务信息梳理目录"){
              // vm.getDepartmentDataSecondLevelChild(node.data.dept_Id).then(function(res) {
              //   if (res.status == 200) {
              //     console.log("yiji",res)
              //     data = res.data;
              //     resolve(data);
              //   } else {
              //     data = [];
              //     resolve(data);
              //   }
              // })
              data = [];
                  resolve(data);
            }
            else{
              vm.getDirNodesByParent(node.data.id).then(function (res) {
                if (res.status == 200) {
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }

              });
            }

          }

        } else {
          data = [];
          resolve(data);
        }
      }, 500);


    },
    findParent(node) {
      const vm = this;
      if (node.level !== 1 && node.parent) {
        return vm.findParent(node.parent);
      } else {
        return node.data;
      }
    },
    findNode(node) {
      const vm = this;
      if (!node.data.path) {
        if (node.parent) {
          return vm.findNode(node.parent);
        }
      } else {
        return node.data.path;
      }
    },
    getFirstClassifyChildrenByName:function (dirName) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/classify/getFirstClassifyChildrenByName",
        data: {
          classify_name: dirName
        }
      })
    },
    getDirNodesByParent: function (id) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/classify/getClassifyChildrenById",
        data: {
          id:id
        }
      })
    },
    //查询系统静态数据资源目录第一层子节点
    getSystemStaticDataFirstLevelChild:function () {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/dicttable/getSystemSources"
      })
    },
    //查询系统静态数据资源目录第二层子节点
    getSystemStaticDataSecondLevelChild: function (info_system_id) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/dicttable/getSystemDataBases",
        data: {
          info_system_id:info_system_id,

        }
      })
    },
     //查询系统实时动态数据资源第一层子节点
     getSystemDynamicDataFirstLevelChild:function () {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/dbtable/getSystemSources"
      })
    },
     //查询系统实时动态数据资源第二层子节点
     getSystemDynamicDataSecondLevelChild: function (info_system_id) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/dbtable/getSystemDataBases",
        data: {
          info_system_id:info_system_id
        }
      })
    },
    // 查询政务部门信息资源目录第二层子节点
    getDepartmentDataSecondLevelChild: function (fId) {
      const vm = this;
      return Http.fetch({
        method: "post",
        url: master + "/dept/getDeptByFid",
        data: {
        fId:fId
        }
      })
    },
    renderContent(h, { node, data, store }) {
      if(node.level === 1){
        return (
          <span class="el-tree-node__label"  title={node.label}>&nbsp;&nbsp;<i class="fa fa-list-alt"></i>&nbsp;&nbsp;{node.label}</span>
        );
      }else{
        if(data.hasLeaf === 0 ||data.hasLeaf === "0") {
            node.isLeaf = true;
          }
        return (
          <span class="el-tree-node__label" title={node.label}>{node.label}</span>
         );
      }

   }
  },
  computed: {
    key() {
      if(this.$route.name == 'economy-resources' || this.$route.name == 'demand-resources' ||this.$route.name == 'department-resources'){
        return this.$route.name
      }else{

      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
      }
    }
  },
   watch: {
    $route() {
      const vm =this;
       if (vm.$route.path == '/layout/catalog') {
      vm.expandedKeys = [vm.regions[0].id];
         vm.$router.push({
            path: '/layout/catalog/statistic',
            query: {
              dirName: vm.regions[0].name,
              id: vm.regions[0].id
            }
          })
       }
    }
  }
};
