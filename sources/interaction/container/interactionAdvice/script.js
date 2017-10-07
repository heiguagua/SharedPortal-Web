import Http from "../../../common/http.js";
import Encrypt from "../../../common/encrypt.js";

const master = Http.url.master;
export default {
  data() {
    return {
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
              } else {
                Notification({
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

  }
};
