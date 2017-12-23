import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";

const master = Http.url.master;
export default {
  data() {
    return {
      disable:false,
      ruleForm: {
        title: '',
        content: '',
        email: '',
        phoneNo: ''
      }
    }
  },
  mounted() {
    const vm = this;

  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const vm = this;
          vm.disable=true;
          Http.fetch({
            method: "post",
            url: master + "/home/submitCustomerQuestion",
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
                   vm.$refs[formName].resetFields();//清空表单
                } else {
                  vm.$message({
                    showClose: true,
                    message: '提交失败！',
                    type: 'success'
                  });
                }
              }
              vm.disable=false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

  }
};
