import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      regions: [{
        'id':1,
        'name': '部门政务信息资源目录',
        'path': 'department'
      }, {
        'id':2,
        'name': '政务基础信息资源目录',
        'path': 'statistic'
      }, {
         'id':3,
        'name': '政务主题信息资源目录',
        'path': 'statistic'
      }, {
        'id':4,
        'name': '系统静态数据资源目录',
        'path': 'system'
      }],
      regions1: [{
        'name': '业务目录',
        "hasLeaf": "1",
        path: 'department-resources'
      }, {
        'name': '资源目录',
        "hasLeaf": "1",
        path: 'list-resources'
      }, {
        'name': '共享目录',
        "hasLeaf": "1",
        path: 'shared-resources'
      }, {
        'name': '开放目录',
        "hasLeaf": "1",
        path: 'open-resources'
      }, {
        'name': '需求目录',
        "hasLeaf": "1",
        path: 'demand-resources'
      }, {
        'name': '系统目录',
        "hasLeaf": "1",
        path: 'economy-resources'
      }, {
        'name': '系统资源目录',
        "hasLeaf": "1",
        path: 'system-list-resourses'
      }],
      props: {
        label: 'name',
        children: 'children'
      },
      count: 1,
      rootNode: {} ,//顶层节点data,
      expandedKeys:[1],//默认进来展开部门政务信息资源目录
    }
  },
  mounted() {
    const vm = this;
    var username = Encrypt.token.get("userName");
    // console.log(username);
    if (username) {
      vm.regions.push({
        'name': '系统实时动态数据资源',
        'path': 'system'
      })
    }
    //vm.getListStatistics();
  },
  methods: {
    handleNodeClick(data, node) {
      var vm = this;
      vm.expandedKeys =[];
      var root =vm.findParent(node);
      let rootPath = root.path;
      let rootName = root.name;
      if (node.level === 1) {
        this.$router.push({
          path: `/layout/catalog/${data.path}`,
          query: {
            dirName: data.name
          }
        });
      } else {
        if (rootPath == vm.regions[1].path) {
          this.$router.push({
            path: '/layout/catalog/resources',
            query: {
              dirName: data.name,
              dirCode: data.tree_code
            }
          })
        } else if (rootPath == vm.regions[0].path) {
          if (node.level === 2) {
            this.$router.push({
              path: `/layout/catalog/${data.path}`,
              query: {
                dirName: data.name,
                dirCode: data.dept_Id
              }
            })
          } /*else if (data.path) {
            this.$router.push({
              path: `/layout/catalog/${data.path}`,
              query: {
                dirName: data.name,
                dirCode: data.code
              }
            })
          }*/ else {
            let loadPath = vm.findNode(node);
            this.$router.push({
              path: `/layout/catalog/${loadPath}`,
              query: {
                dirName: data.name,
                dirCode: data.dept_Id
              }
            })
          }
        } else if (rootPath == vm.regions[3].path) {
          if(vm.regions.length>4 &&rootName ==vm.regions[4].name){
            this.$router.push({
              path: '/layout/catalog/system-dynamic-resources',
              query: {
                dirName: data.name,
                info_system_id: data.info_system_id,
                db_id:(data.hasOwnProperty('db_id'))?data.db_id:''
              }
            })
          }else{
            this.$router.push({
              path: '/layout/catalog/system-resources',
              query: {
                dirName: data.name,
                info_system_id: data.info_system_id,
                db_id:(data.hasOwnProperty('db_id'))?data.db_id:''
              }
            })
          }
        }
      }
    },
    loadNode(node, resolve) { // 加载子节点
      const vm = this;
      if (node.level === 0) {
        return resolve(vm.regions);
      }
      // if (node.parent.data.path === vm.regions[0].path) {
      //   return resolve(vm.regions1);
      // }
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
              vm.getFirstClassifyChildrenByName(node.data.name).then(function (res) {
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
            }else if(rootName =="部门政务信息资源目录"){
              vm.getDepartmentDataSecondLevelChild(node.data.dept_Id).then(function(res) {
                if (res.status == 200) {
                  console.log("yiji",res)
                  data = res.data;
                  resolve(data);
                } else {
                  data = [];
                  resolve(data);
                }
              })
            } else{
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
    // 查询部门政务信息资源目录第二层子节点
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
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
    }
  },
};
