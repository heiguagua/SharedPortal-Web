import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
// import {formatDate} from "../../common/date.js";
const master = Http.url.master;
export default {
  data() {
      var checkCount = (rule, value, callback) => {
        console.log(value);
        if (value == null || value == '') {
          return callback();
        }
        //setTimeout(() => {
          if (isNaN(value)) {
            callback(new Error('请输入数字值'));
          } else {
            var value = parseInt(value);
            if (!Number.isInteger(value)) {
              callback(new Error('请输入数字值'));
            }
            if (value < 1) {
              callback(new Error('请输入大于0的数字值'));
            } 
            else if(value>2147483647){
              callback(new Error('访问次数超过最大限制'));
            }else {
              callback();
            }
          }
        //}, 1000);
      };
      return {
        userName: null,
        loading: true,
        head_title: '',
        detail_pro: {},
        systemInfo:{},
        activeTab: 'itemlist',
        tableDataItem: [],
        tableInterfaces: [],
        multipleSelection:[],
        timeRange: null,
        operateble: false,
        editable: false,         // 数据申请时间空间是否可编辑
        collectionStatus: false, //是否收藏状态
        dialogFormVisible: false, // 纠错对话框可见性
        dialogRateVisible: false, // 评分对话框可见性
        dialogApplyVisible: false, // 申请数据对话框可见性
        correctionForm: {
          content: ''
        },
        rateForm: {
          stars: 0
        },
        applyForm: {
          count: null,
          timeRange: null,
          description: ''
        },
        formRules: {
          count: [{
            required: true,
            message: '访问次数不能为空',
            trigger: 'blur'
          }],
          timeRange: [{
            type: 'date',
            required: true,
            message: '访问时间段不能为空',
            trigger: 'blur,change'
          }],
          description: [{
            required: true,
            message: '申请理由不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      const vm = this;
      vm.loadData();

      vm.userName = Encrypt.token.get("userName");
      if (vm.userName) {
        vm.operateble = true;
      } else {
        vm.operateble = false;
      }
    },

    methods: {
      checkLogin:function(){
        if(Encrypt.token.get("userName")){
          return true;
        }
        return false;
      },
      getResDetails: function(ddcm_id) { // 获取资源详情
        return Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetDetailsById",
          data: {
            ddcm_id: ddcm_id
          }
        })
      },
      getDataItem: function(dataset_id) { // 获取数据项信息
        return Http.fetch({
          method: "post",
          url: master + "/dataitem/getDatItemByDateSetId",
          data: {
            dataset_id: dataset_id
          }
        })
      },
      getInterfaces: function(ddcm_id) { // 获取接口信息
        return Http.fetch({
          method: "post",
          url: master + "/serviceinfo/getServiceInfoByObjId",
          data: {
            obj_Id: ddcm_id // 资源code
          }
        })
      },
      deleteCollection: function(ddcm_id) { // 取消收藏
        return Http.fetch({
          method: "put",
          url: master + "/dataCollection/deleteCollection",
          data: {
            ddcm_id: ddcm_id // 资源code
          }
        })
      },
      insertCollection: function(ddcm_id) { // 添加收藏
        return Http.fetch({
          method: "put",
          url: master + "/dataCollection/createCollection",
          data: {
            ddcm_id: ddcm_id // 资源code
          }
        })
      },
      insertCorrection: function(ddcm_id, correction_Id, content) { // 提交纠错信息
        return Http.fetch({
          method: "post",
          url: master + "/dataCorrection/createDataCorrection",
          data: {
            ddcm_id: ddcm_id, // 资源code
            correction_Id:correction_Id,
            correct_content: content
          }
        })
      },

      updateStatus: function(ddcm_id, rate_score_Id, stars) {
        return Http.fetch({
          method: "post",
          url: master + "/dataRate/createOrDeleteRate",
          data: {
            ddcm_id: ddcm_id, 
            rate_score_Id: rate_score_Id, 
            score: stars
          }
        })
      },
      insertApplyInfo: function(data_item, dcm_id, count, date_period, description) {
        return Http.fetch({
          method: "put",
          url: master + "/dataItemapply/createDataApply",
          data: {
            dcm_id: dcm_id, // 
            items: data_item, // 数据项id
             limit_visit_cnt: count,
             limit_visit_date_period: date_period,
            apply_info: description
          }
        })
      },
      getDataItemList: function() { // 获取数据项列表
        const vm = this;
        console.log(vm.detail_pro);
        vm.getDataItem(vm.detail_pro.dataset_id).then(function(res) {
          vm.loading = false;
          if (res.status == 200) {
            vm.tableDataItem = res.data;
          } else {
           vm.$notify({
              type: "error",
              title: '系统错误',
              message: res.data.message,
            });
          }
        },function(error){
          console.log("getdataitme error:",error);
        })
      },
      loadData() {
        const vm = this;
        vm.head_title = vm.$route.query.dirName;
        vm.ddcm_id = vm.$route.query.ddcm_id;
        vm.getResDetails(vm.ddcm_id).then(function(res) {
          if (res.status == 200) {
            vm.detail_pro = res.data;
            if(vm.detail_pro.system_info !== null){
                vm.systemInfo =JSON.parse(vm.detail_pro.system_info);
            }
            vm.collectionStatus = vm.detail_pro.isCollection;
            vm.getDataItemList(); // 获取数据项列表
          } else {
            vm.$message({
              type: "error",
              title: '系统错误',
              message: res.data.message,
            });
          }
        })

      },

      handleClick(tab, event) {
        const vm = this;
        console.log(tab, event);
        if (tab.name == "interfaceinfo") {
          vm.getInterfaces(vm.ddcm_id).then(function(res) {
             let tableData = res.data;
             _.forEach(tableData,function(item){
                item.request_info=JSON.parse(item.request_info)
             });
            vm.tableInterfaces = tableData;
          })
        }
      },
      handleSelectionChange(val) {
        const vm = this;
        vm.multipleSelection = val;
        console.log(vm.multipleSelection);
      },
      handleItemDetail(itemName, itemObj) { //点击数据项名称
        this.$router.push({
          path: '/layout/catalog/itemDetails',
          query: {
            itemName: itemName,
            itemObj: itemObj
          }
        });
      },
      handleCollection() { // 收藏/取消收藏
        const vm = this;
        if(vm.checkLogin()){
          if (vm.collectionStatus) { // 已收藏，则取消收藏
          vm.deleteCollection(vm.ddcm_id).then(function(res) {
            if (res.status == 200) {
              if (res.data.status) {
                vm.collectionStatus = false;
                vm.$message({
                  showClose: true,
                  message: '取消收藏成功！',
                  type: 'success'
                });
              }
            } else {
              vm.$notify({
                type: "error",
                title: '查询错误',
                message: res.data.message
              });
            }
          })
        } else { // 未收藏，则收藏
          vm.insertCollection(vm.ddcm_id).then(function(res) {
            if (res.status == 200) {
              if (res.data.status) {
                vm.collectionStatus = true;
                vm.$message({
                  showClose: true,
                  message: '收藏成功！',
                  type: 'success'
                });
              }
              else{
                vm.$message({
                  showClose: true,
                  message: '收藏失败！',
                  type: 'error'
                });
              }
            } else {
              vm.$notify({
                type: "error",
                title: '查询错误',
                message: res.data.message,
              });
            }
          })
        }
        }
        else{
          vm.$message({
            showClose: true,
            message: '登录后才能执行操作，请登录！',
            type: 'warning'
          });
          // 弹出登录框
          setTimeout(function() {
            vm.$parent.$parent.openLoginDialog();
          }, 1000);
        }
        
      },
      getCorrection() { // 获取纠错内容
        const vm = this;
        vm.dialogFormVisible = true;
        vm.correctionForm.content = vm.detail_pro.correct_content;
      },
      handleCorrection() { // 提交纠错内容
        const vm = this;
        vm.insertCorrection(vm.ddcm_id, vm.detail_pro.correction_Id,vm.correctionForm.content).then(function(res) {
          if (res.status == 200) {
            if(res.data.status) {
              vm.dialogFormVisible = false; //关闭对话框
              vm.$message({
                showClose: true,
                message: '纠错成功！',
                type: 'success'
              });
              vm.loadData();
            }
            else{
              vm.$message({
                type: "error",
                title: '纠错失败',
                message: res.data.message,
              });
            }
            
          } else {
            vm.$notify({
              type: "error",
              title: '纠错失败！',
              message: res.data.message
            });
          }

        })
      },
      getStars() { // 获取评分
        const vm = this;
        vm.dialogRateVisible = true;
        vm.rateForm.stars = vm.detail_pro.rate_score;
      },
      handleRating() { // 提交评分
        const vm = this;
        vm.updateStatus(vm.ddcm_id, vm.detail_pro.rate_score_Id, vm.rateForm.stars).then(function(res) {
          if (res.status == 200) {
            if(res.data.status) {
              vm.dialogRateVisible = false;
              vm.$message({
                showClose: true,
                message: '评分成功！',
                type: 'success'
              });
              vm.loadData();
            }
            else{
              vm.$message({
              type: "error",
              title: '评分失败！',
              message: '评分失败!'
            });
            }
            
          } else {
            vm.$notify({
              type: "error",
              title: '评分失败！',
              message: '评分失败'
            });
          }
        })
      },
      applyData() { // 点击申请数据
        const vm = this;
        if (!vm.multipleSelection || vm.multipleSelection.length == 0) {
          vm.$message({
            showClose: true,
            message: '请勾选您要申请的数据项！',
            type: 'warning'
          });
        } else if (!Encrypt.token.get("userName")) { // 未登录
          vm.$message({
            showClose: true,
            message: '登录后才能执行申请操作，请登录！',
            type: 'warning'
          });
          // 弹出登录框
          setTimeout(function() {
            vm.$parent.$parent.openLoginDialog();
          }, 1000);
        } else {
          vm.dialogApplyVisible = true;
        }

      },
      checkboxInit(row, index) {
        console.log(row.share_dict_code);
        if (row.r_status == "需申请")
          return 1; //可勾选
        else
          return 0; //不可勾选
      },
      handleApply(applyForm) { // 提交申请数据
        const vm = this;
        vm.$refs[applyForm].validate((valid) => {
          if (valid) {
            var item_code = _.map(vm.multipleSelection, "id");
            var date_range = null;
            if(vm.applyForm.timeRange) {
              date_range = formatDate(vm.applyForm.timeRange[0],'yyyy-MM-dd hh:mm:ss') + "-" + formatDate(vm.applyForm.timeRange[1],'yyyy-MM-dd hh:mm:ss');
            }
            
            vm.insertApplyInfo(item_code, vm.detail_pro.dcm_id, vm.applyForm.count, date_range, vm.applyForm.description).then(function(res) {
              if (res.status == 200) {
                vm.$message({
                  showClose: true,
                  message: '申请成功！',
                  type: 'success'
                });
                vm.getDataItemList(); // 刷新数据项列表
                vm.applyForm.timeRange = [];
                vm.applyForm.count = '';
                vm.applyForm.description = '';
              } else {
                vm.$message({
                  showClose: true,
                  message: '申请失败！',
                  type: 'error'
                });
              }
              vm.dialogApplyVisible = false;
            })
          } else {
            return false;
          }
        })

      },
       jumpToSystem(val) { // 点击表格行
      const vm = this;
      console.log(val)
      this.currentRow = val;
      this.$router.push({
        path: '/layout/catalog/economy-extend-resourses',
        query: {
          dirName: val.system_name,
          // dirCode: vm.$route.query.dirCode,
          infoSystemId:val.id
        }
      })
    },
      timeChange(time) {
        console.log(time);
      },
      goback() {
        this.$router.go(-1);
      }
    }
};