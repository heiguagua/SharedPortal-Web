import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";
import elLogin from "../../../common/login-dialog/index.vue";
const master = Http.url.master;
export default {
  components: {
    elLogin
  },
  data() {
    return {
      ruleForm: {
        title: '',
        content: '',
        requirementType: 'interface',
        others: '',
        // depId: [],//部门多选时用
        depId: "", //部门单选时用
        resourceId: []
      },
      initForm: {
        unit: '',
        name: ''
      },
      rules2: {
        title: [{
          required: true,
          message: '标题不能为空',
          trigger: 'blur'
        }],
        // depId: [{//部门多选时用
        //   type: 'array',
        //   required: true,
        //   message: '部门不能为空',
        //   trigger: 'blur'
        // }],
        depId: [{ //部门单选时用
          required: true,
          message: '部门不能为空',
          trigger: 'blur'
        }],
        requirementType: [{
          required: true,
          message: '需求类型不能为空',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '需求描述不能为空',
          trigger: 'blur'
        }],

      },
      depData: [],
      options: [],
      // depName: [],//部门多选时用的
      depName: "", //部门单选时用的
      props: {
        label: 'name',
        children: 'children',
        disabled: function (data, node) {
          if (data.has_leaf != 0) {
            return true
          }
        }
      },
      showStyle: {
        display: 'none'
      },
      showDialogComponent: false,
    }

  },
  mounted() {
    const vm = this;
    vm.getLoginUserInfo();
    vm.PdepData();
  },

  methods: {
    /**判断当前用户是否登录并获得当前用户信息 */
    getLoginUserInfo() {
      const vm = this;
      var username = Encrypt.token.get("userName");
      if (username) {
        vm.showStyle = {
          display: 'block'
        }
        vm.initForm.name = username;
        vm.initForm.unit = Encrypt.token.get("orgName");
      } else {
        vm.$message({
          showClose: true,
          message: '登录后才能执行操作，请登录！',
          duration: 2000,
          type: 'warning',
          customClass: "warning-alert"
        });
        setTimeout(function () {
          vm.showDialogComponent = true;
        }, 1000);
      }
    },
    /**部门列表 */
    getDepData: function (id) {
      const vm = this;
      return Http.fetch({
        method: "get",
        url: master + "/home/requirementNewDepTree",
        params: {
          pid: id,
        }
      })
    },
    /**获取资源名称列表 */
    getNewResourceByDep(requireType, orgStr) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/home/getNewResourceByDep",
        data: {
          requireType: requireType,
          orgIds: orgStr
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.options = data;
          } else {
            vm.$notify({
              type: "error",
              title: '获取资源名称列表',
              message: result.data.message,
            });
          }
        });
    },
    visibleChange(val) {
      const vm = this;
      if (val) {
        console.log(vm.ruleForm.requirementType, vm.ruleForm.depId)
        vm.getNewResourceByDep(vm.ruleForm.requirementType, vm.ruleForm.depId);
      }
    },
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        console.log(vm.ruleForm)
        if (valid) {

          if (vm.ruleForm.resourceId.length == 0 && vm.ruleForm.others == '') {
            vm.$message({
              showClose: true,
              message: '资源名称和其他不能同时为空!',
              duration: 2000,
              type: 'warning',
              customClass: "warning-alert"
            });
            return
          }
          Http.fetch({
            method: "post",
            url: master + "/home/insertNewRequirement",
            data: vm.ruleForm
          }).then(
            function (result) {
              if (result.status == 200) {
                let data = result.data;
                if (data.result) {
                  vm.$message({
                    showClose: true,
                    message: '提交成功！',
                    type: 'success'
                  });
                  vm.$refs[formName].resetFields(); //清空表单
                  vm.ruleForm = {};
                  // vm.ruleForm.requirementType = 'interface';
                  // vm.depName = [];//部门多选时用
                  vm.depName = ""; //部门单选时用
                  vm.ruleForm.resourceId = []
                  // vm.$refs.tree.setCheckedKeys([]);//部门多选时用
                  $("#dep_inp").height(33);
                } else {
                  vm.$message({
                    showClose: true,
                    message: '提交失败！',
                    type: 'success'
                  });
                }
              } else if (result.status == 511) {
                alert('登录已失效，请重新登录！');
                return
              } else {
                vm.$notify({
                  type: "error",
                  title: '咨询建议',
                  message: result.data.message,
                });
              }
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    PdepData() {
      let vm = this
      vm.depName = [];
      vm.getDepData('root').then(
        function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.depData = data;
            console.log(data)
          } else {
            vm.$notify({
              type: "error",
              title: '部门列表',
              message: result.data.message,
            });
          }
        });
    },
    loadNode(node, resolve) {
      const vm = this;
      if (node.level === 0) {
        return resolve(vm.depData);
      }

      var hasChild;
      if (node.data.has_leaf == 1) {
        hasChild = true;
      } else {
        hasChild = false;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          this.getDepData(node.data.id).then(function (res) {
            if (res.status == 200) {
              data = res.data;
              resolve(data);
            } else {
              data = [];
              resolve(data);
            }

          });
        } else {
          data = [];
          resolve(data);
        }
      }, 500);
    },
    getCheckedNodes(data) {
      const vm = this;
      const nodeArry = this.$refs.tree.getCheckedNodes();
      vm.depName = [];
      vm.ruleForm.depId = [];
      _.forEach(nodeArry, function (item) {
        vm.depName.push(item.name)
        vm.ruleForm.depId.push(item.id);
      })
      if (vm.depName.length < 1) {
        $("#dep_inp").height(33);
      } else {
        $("#dep_inp").height(33 * vm.depName.length);
      }
    },

    /**部门单选 */
    handleNodeClick(data) {
      const vm = this;
      if (data.has_leaf == 0) {
        vm.depName = data.name;
        vm.ruleForm.depId = data.id;
      }
    },
    renderContent(h, {
      node,
      data,
      store
    }) {
      if (data.has_leaf === 0 || data.has_leaf === "0") {
        node.isLeaf = true;
      }
      return ( <
        span class = "el-tree-node__label"
        title = {
          node.label
        } > {
          node.label
        } < /span>
      );
    }

    // deleNode(node) { //删除
    //   const vm = this;
    //   vm.depName = [];
    //   vm.ruleForm.depId = [];
    //   $.each(vm.$refs.tree.getCheckedNodes(), function (i, v) {
    //     if (v.name != node) {
    //       vm.depName.push(v.name);
    //       vm.ruleForm.depId.push(v.orgCode);
    //     }
    //   })
    // }
  },
};
