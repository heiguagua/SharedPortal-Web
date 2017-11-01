import Http from "../common/http.js";
import Encrypt from "../common/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      ruleForm: {
        realName: '',
        loginName: '',
        regionCode:'',
        orgCode: '',
        email: '',
        phoneNumber: ''
      },
      rules: {
        realName: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        loginName: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
         regionCode: [{
          required: true,
          message: '区域不能为空',
          trigger: 'blur'
        }],
        orgCode: [{
          required: true,
          message: '部门不能为空',
          trigger: 'blur'
        }],
        email: [{
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮件地址如：123@qq.com',
            trigger: 'blur,change'
          }
        ],
        phoneNumber: [{
          required: true,
          message: '手机号码不能为空',
          trigger: 'blur'
        }, {
          message: '请输入正确的手机号码',
          pattern: /^(\d{3,4}-)?\d{7,8}$|(^1[3|4|5|7|8]\d{9}$)/,
          trigger: 'blur,change'
        }],
      },
      props: {
        label: 'name',
        children: 'children'
      },
      regionProps: {
        label: 'regionName',
        children: 'children'
      },
      depData: [],
      depName: '',
      regionData:[],
      regionName:''
    }
  },
  mounted() {
    const vm = this;
    // vm.PdepData();
    // vm.PregionData();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const vm = this;
          Http.fetch({
            method: "post",
            url: master + "/home/submitRegisterUerInfo",
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
                  vm.depName = '';
                  vm.regionName='';
                } else {
                 vm.$message({
                  showClose: true,
                  message: '提交失败',
                  type: 'success'
                });
                }
              } else {
                vm.$notify({
                  type: "error",
                  title: '咨询建议',
                  message: result.message,
                });
              }
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**部门列表 */
    getDepData: function (id,code) {
      const vm = this;
      return Http.fetch({
        method: "get",
        url: master + "/home/requirementNewDepTree",
        params: {
          pid: id,
          regionCode:code
        }
      })
    },
    handleNodeClick(data) {
      if (data.has_leaf == 0) {
        this.ruleForm.orgCode = data.id;
        this.depName = data.name;
      }
    },
    loadNode(node, resolve) {//部门树
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
          this.getDepData(node.data.id,vm.ruleForm.regionCode).then(function (res) {
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
    PdepData() {
      const vm = this;
       vm.depName = '';
      vm.getDepData("root",vm.ruleForm.regionCode).then(function (result) {
        if (result.status == 200) {
          let data = result.data;
          vm.depData = data;
        } else {
          vm.$notify({
            type: "error",
            title: '部门列表',
            message: result.message,
          });
        }
      })
    },
    /**区域列表 */
    getRegionData: function (id) {
      const vm = this;
      return Http.fetch({
        method: "get",
        url: master + "/dept/getRegionSelectDataList",
        params: {
          regionCode: id,
        }
      })
    },
     regionHandleNodeClick(data) {
        this.ruleForm.regionCode = data.regionCode;
        this.regionName = data.regionName;
    },
      regionLoadNode(node, resolve) {//区域树
      const vm = this;
      if (node.level === 0) {
        return resolve(vm.depData);
      }

      var hasChild;
      if (node.data.hasLeaf == 1) {
        hasChild = true;
      } else {
        hasChild = false;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          this.getRegionData(node.data.regionCode).then(function (res) {
            if (res.status == 200) {
              data = res.data.content.selectData;
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
    PregionData() {
      const vm = this;
       vm.regionName='';
      vm.getRegionData().then(function (result) {
        if (result.status == 200) {
          let data = result.data;
          vm.regionData = data.content.selectData;
        } else {
          vm.$notify({
            type: "error",
            title: '部门',
            message: '系统错误',
          });
        }
      })
    },
  }
};
