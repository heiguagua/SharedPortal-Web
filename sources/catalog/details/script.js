import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
import {formatDate} from "../../common/date.js";
const master = Http.url.master;
export default {
  data() {
      var checkCount = (rule, value, callback) => {
        console.log(value);
       if (!value) {
          return callback(new Error('访问次数不能为空'));
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
          var checkContent = (rule, value, callback) => {
      if (value.length > 500) {
        return callback('最多只能输入500个字,你已经不能再输入了！');
      }else if (!value) {
          return callback(new Error('理由不能为空'));
        }
       else {
          callback();
        }
    };
      return {
        disable:false,
        userName: null,
        loading: true,
        head_title: '',
        average_score:0,
        detail_pro: {},
        systemInfo:{},
        activeTab: 'itemlist',
        tableDataItem: [],
        tableInterfaces: [],
        multipleSelection:[],
        resourceSelection:[],//关联资源ID
        resourceDataItem:[],
        timeRange: null,
        operateble: false,
        editable: false,         // 数据申请时间空间是否可编辑
        collectionStatus: false, //是否收藏状态
        dialogFormVisible: false, // 纠错对话框可见性
        dialogRateVisible: false, // 评分对话框可见性
        dialogApplyVisible: false, // 申请数据对话框可见性
        dialogResourceVisible:false,//关联资源列表可见性
        dialogRourceApplyVisible:false,//关联资源数据申请对话框可见性
        correctionForm: {
          content: ''
        },
        rateForm: {
          stars: 0
        },
        applyForm: {
          // count: null,
          timeRange: null,
          description: ''
        },
        formRules: {
        //  count: [{
        //   required: true,
        //     validator: checkCount,
        //     trigger: 'blur'
        //   }],
          timeRange: [{
            type: 'array',
            required: true,
            message: '访问时间段不能为空',
            trigger: 'change'
          }],
          description: [{
            required: true,
            validator: checkContent,
            trigger: 'blur,change'
          }]
        },
         formRules1: {
        content: [{
          validator: checkContent,
          trigger: 'blur,change'
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
      getDataItem: function(dataset_id,dcm_id) { // 获取数据项信息
        return Http.fetch({
          method: "post",
          url: master + "/dataitem/getDatItemByDateSetId",
          data: {
            dataset_id:dataset_id,
            dcm_id: dcm_id
          }
        })
      },
       getResourceData: function(ddcm_id) { // 获取是否存在关联资源
        return Http.fetch({
          method: "post",
          url: master + "/dataItemapply/selectIfExistRelatedCatalog",
          data: {
            dcmId: ddcm_id
          }
        })
      },
      getRelatedCatalog: function(ddcm_id) { // 获取关联资源信息
        return Http.fetch({
          method: "post",
          url: master + "/dataItemapply/getRelatedCatalog",
          data: {
            dcmId: ddcm_id
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
      insertApplyInfo: function(data_item, dcm_id, date_period, description) {
        return Http.fetch({
          method: "put",
          url: master + "/dataItemapply/createDataApply",
          data: {
            dcm_id: dcm_id, // 
            items: data_item, // 数据项id
            //  limit_visit_cnt: count,
             limit_visit_date_period: date_period,
            apply_info: description
          }
        })
      },
       insertApplyResourceInfo: function(dcm_ids, date_period, description) {//关联资源的所有数据申请
        return Http.fetch({
          method: "post",
          url: master + "/dataItemapply/createRelatedDataApply",
          data: {
            dcmIds: dcm_ids, // 关联资源id
            //  limit_visit_cnt: count,
             limit_visit_date_period: date_period,
            apply_info: description
          }
        })
      },
      getDataItemList: function() { // 获取数据项列表
        const vm = this;
        console.log(vm.detail_pro);
        vm.getDataItem(vm.detail_pro.dataset_id,vm.detail_pro.dcm_id).then(function(res) {
          vm.loading = false;
          if (res.status == 200) {
            vm.tableDataItem = res.data;
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
            vm.average_score = res.data.rate_score;
            if(vm.detail_pro.system_info !== null && vm.detail_pro.system_info != undefined && vm.detail_pro.system_info != ''){
                vm.systemInfo =JSON.parse(vm.detail_pro.system_info);
            }
            vm.collectionStatus = vm.detail_pro.isCollection;
            vm.getDataItemList(); // 获取数据项列表
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
      handleResourceSeletChange(val) {
        const vm = this;
        vm.resourceSelection = val;
        console.log(vm.resourceSelection);
      },
      handleRelatedCatalog(relatedCatalogName, ddcmId) { //点击关联资源名称
        this.$router.push({
          path: '/layout/catalog/details',
          query: {
            dirName: relatedCatalogName,
            ddcm_id: ddcmId
          }
        });
      },
      handle(itemName, itemObj) { //点击数据项名称
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
        vm.disable=true;
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
            
          }
          vm.disable=false;
        })
      },
      getStars() { // 获取评分
        const vm = this;
        vm.dialogRateVisible = true;
        vm.rateForm.stars = vm.detail_pro.rate_score;
      },
      handleRating() { // 提交评分
        const vm = this;
        vm.disable=true;
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
            
          }
          vm.disable=false;
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
      applyResourceData(){ // 点击申请关联资源数据
        const vm = this;
        if (!vm.resourceSelection || vm.resourceSelection.length == 0) {
          vm.$message({
            showClose: true,
            message: '请勾选您要申请的关联资源！',
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
          vm.dialogRourceApplyVisible = true;
        }

      },
      checkboxInit(row, index) {
        console.log(row.share_dict_code);
        if (row.r_status == "需申请" || row.r_status == "拒绝")
          return 1; //可勾选
        else
          return 0; //不可勾选
      },
      checkboxRelatedCatalogInit(row, index) {
        if (row.usableApplyCount > 0)
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
            vm.disable=true;
            vm.insertApplyInfo(item_code, vm.detail_pro.dcm_id, date_range, vm.applyForm.description).then(function(res) {
              
              if (res.status == 200) {
                vm.$message({
                  showClose: true,
                  message: '申请成功！',
                  type: 'success'
                });
                 setTimeout(function() {
                  vm.getResourceData(vm.detail_pro.dcm_id).then(function(res){
                    if(res.status == 200){
                      if(res.data.relatedCataCount > 0){
                         vm.$confirm('该资源存在关联资源，是否继续申请?', '提示', {
                              confirmButtonText: '确定',
                              cancelButtonText: '取消',
                              type: 'warning'
                            }).then(() => {
                              
                         vm.dialogResourceVisible = true;//关联资源列表弹出框
                          vm.getRelatedCatalog(vm.detail_pro.dcm_id).then(function(res){
                            if(res.status == 200){
                              vm.resourceDataItem = res.data;
                              }
                            })
                            }).catch(() => {
                              vm.$message({
                                type: 'info',
                                message: '已取消'
                              });          
                            });
                      }
                    }
                  })  }, 1000);
           
                vm.getDataItemList(); // 刷新数据项列表
                vm.applyForm.timeRange = [];
                // vm.applyForm.count = '';
                vm.applyForm.description = '';
        
               
              }
              vm.dialogApplyVisible = false;
              vm.disable=false;
            })
          } else {
            return false;
          }
        })

      },
         handleRsourceApply(applyForm) { // 提交关联资源申请数据
        const vm = this;
        vm.$refs[applyForm].validate((valid) => {
          if (valid) {
            var dcm_ids = _.map(vm.resourceSelection, "dcmId");
            var date_range = null;
            if(vm.applyForm.timeRange) {
              date_range = formatDate(vm.applyForm.timeRange[0],'yyyy-MM-dd hh:mm:ss') + "-" + formatDate(vm.applyForm.timeRange[1],'yyyy-MM-dd hh:mm:ss');
            }
            vm.disable=true;
            vm.insertApplyResourceInfo(dcm_ids, date_range, vm.applyForm.description).then(function(res) {
              
              if (res.status == 200) {
                vm.$message({
                  showClose: true,
                  message: '申请成功！',
                  type: 'success'
                });
                vm.applyForm.timeRange = [];
                // vm.applyForm.count = '';
                vm.applyForm.description = '';
                 vm.getRelatedCatalog(vm.detail_pro.dcm_id).then(function(res){
                  if(res.status == 200){
                    vm.resourceDataItem = res.data;
                    }
                  })
              }
              vm.dialogRourceApplyVisible = false;
              vm.disable=false;
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
      if (this.$route.query.t) {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    },
    }
};