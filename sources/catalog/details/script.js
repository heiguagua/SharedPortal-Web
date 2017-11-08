import Http from "../../common/http.js";
import Encrypt from "../../common/encrypt.js";
import {formatDate} from "../../common/date.js";
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
        activeTab: 'itemlist',
        tableDataItem: [],
        tableInterfaces: [],
        multipleSelection:[],
        // tableInterfaces:[{
        //   id: '12987122',
        //   service_url: 'http://192.168.13.141:8180/webService/interface/ec5f4d1b-7a4e-47ff-gsd3-3fs3-78avd706BEA43063D45849F2769586DFB4692',
        //   request_info: '[{"end_date":"2017-09-22 23:59:59","operation_date":"2017-08-26 18:34:29","type":"HTTP","uuid":"7ea4bc11f15547ea9dcc63b788dbec8c","url":"http://178.16.32.40:8093/webServiceApi/interface/06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7/84a6ff5538f62f3ce73f6afafc43b4845285d3043d27fe1ee68622c3e26c2e8236e44afc59291931b111d15cf71bcb72","dir_type":"dir","form":"json","service_id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","name":"常住人口信息","demande_way":"get","set_id":"UaLmwWB1EeeGP8z9ublHbw1127","id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","status":"published","start_date":"2017-08-26 00:00:00","info":"[{\"itemName\":\"住址行政区划\",\"description\":\"\",\"itemNameCn\":\"住址行政区划\",\"itemAlias\":\"住址行政区划\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"住址详细地址\",\"description\":\"\",\"itemNameCn\":\"住址详细地址\",\"itemAlias\":\"住址详细地址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市详址\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市详址\",\"itemAlias\":\"何地迁来本市详址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何因迁来本市\",\"description\":\"\",\"itemNameCn\":\"何因迁来本市\",\"itemAlias\":\"何因迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户号\",\"description\":\"\",\"itemNameCn\":\"户号\",\"itemAlias\":\"户号\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何时迁来本市\",\"description\":\"\",\"itemNameCn\":\"何时迁来本市\",\"itemAlias\":\"何时迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"曾用名\",\"description\":\"\",\"itemNameCn\":\"曾用名\",\"itemAlias\":\"曾用名\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市国家地区\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市国家地区\",\"itemAlias\":\"何地迁来本市国家地区\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"与户主关系\",\"description\":\"\",\"itemNameCn\":\"与户主关系\",\"itemAlias\":\"与户主关系\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"公民身份证号码\",\"description\":\"公民身份号码\",\"itemNameCn\":\"公民身份证号码\",\"itemAlias\":\"公民身份证号码\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"公民身份号码\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户类型\",\"description\":\"\",\"itemNameCn\":\"户类型\",\"itemAlias\":\"户类型\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"常住人口ID\",\"description\":\"\",\"itemNameCn\":\"常住人口ID\",\"itemAlias\":\"常住人口ID\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"}]"}]',
        //   operation_desc: '1.如不传任何参数访问接口，则接口会返回1-999条数据(get/post均可)/n2.如需传送参数来访问接口，则应使用post请求访问接口(参数格式如：startIndex:1)'
        // }, {
        //   id: '12987122',
        //   service_url: 'http://192.168.13.141:8180/webService/interface/ec5f4d1b-7a4e-47ff-gsd3-3fs3-78avd706BEA43063D45849F2769586DFB4692',
        //   request_info: '[{"end_date":"2017-09-22 23:59:59","operation_date":"2017-08-26 18:34:29","type":"HTTP","uuid":"7ea4bc11f15547ea9dcc63b788dbec8c","url":"http://178.16.32.40:8093/webServiceApi/interface/06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7/84a6ff5538f62f3ce73f6afafc43b4845285d3043d27fe1ee68622c3e26c2e8236e44afc59291931b111d15cf71bcb72","dir_type":"dir","form":"json","service_id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","name":"常住人口信息","demande_way":"get","set_id":"UaLmwWB1EeeGP8z9ublHbw1127","id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","status":"published","start_date":"2017-08-26 00:00:00","info":"[{\"itemName\":\"住址行政区划\",\"description\":\"\",\"itemNameCn\":\"住址行政区划\",\"itemAlias\":\"住址行政区划\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"住址详细地址\",\"description\":\"\",\"itemNameCn\":\"住址详细地址\",\"itemAlias\":\"住址详细地址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市详址\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市详址\",\"itemAlias\":\"何地迁来本市详址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何因迁来本市\",\"description\":\"\",\"itemNameCn\":\"何因迁来本市\",\"itemAlias\":\"何因迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户号\",\"description\":\"\",\"itemNameCn\":\"户号\",\"itemAlias\":\"户号\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何时迁来本市\",\"description\":\"\",\"itemNameCn\":\"何时迁来本市\",\"itemAlias\":\"何时迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"曾用名\",\"description\":\"\",\"itemNameCn\":\"曾用名\",\"itemAlias\":\"曾用名\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市国家地区\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市国家地区\",\"itemAlias\":\"何地迁来本市国家地区\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"与户主关系\",\"description\":\"\",\"itemNameCn\":\"与户主关系\",\"itemAlias\":\"与户主关系\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"公民身份证号码\",\"description\":\"公民身份号码\",\"itemNameCn\":\"公民身份证号码\",\"itemAlias\":\"公民身份证号码\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"公民身份号码\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户类型\",\"description\":\"\",\"itemNameCn\":\"户类型\",\"itemAlias\":\"户类型\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"常住人口ID\",\"description\":\"\",\"itemNameCn\":\"常住人口ID\",\"itemAlias\":\"常住人口ID\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"}]"}]',
        //   operation_desc: '1.如不传任何参数访问接口，则接口会返回1-999条数据(get/post均可)/n2.如需传送参数来访问接口，则应使用post请求访问接口(参数格式如：startIndex:1)'
        // }, {
        //   id: '12987122',
        //   service_url: 'http://192.168.13.141:8180/webService/interface/ec5f4d1b-7a4e-47ff-gsd3-3fs3-78avd706BEA43063D45849F2769586DFB4692',
        //   request_info: '[{"end_date":"2017-09-22 23:59:59","operation_date":"2017-08-26 18:34:29","type":"HTTP","uuid":"7ea4bc11f15547ea9dcc63b788dbec8c","url":"http://178.16.32.40:8093/webServiceApi/interface/06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7/84a6ff5538f62f3ce73f6afafc43b4845285d3043d27fe1ee68622c3e26c2e8236e44afc59291931b111d15cf71bcb72","dir_type":"dir","form":"json","service_id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","name":"常住人口信息","demande_way":"get","set_id":"UaLmwWB1EeeGP8z9ublHbw1127","id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","status":"published","start_date":"2017-08-26 00:00:00","info":"[{\"itemName\":\"住址行政区划\",\"description\":\"\",\"itemNameCn\":\"住址行政区划\",\"itemAlias\":\"住址行政区划\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"住址详细地址\",\"description\":\"\",\"itemNameCn\":\"住址详细地址\",\"itemAlias\":\"住址详细地址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市详址\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市详址\",\"itemAlias\":\"何地迁来本市详址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何因迁来本市\",\"description\":\"\",\"itemNameCn\":\"何因迁来本市\",\"itemAlias\":\"何因迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户号\",\"description\":\"\",\"itemNameCn\":\"户号\",\"itemAlias\":\"户号\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何时迁来本市\",\"description\":\"\",\"itemNameCn\":\"何时迁来本市\",\"itemAlias\":\"何时迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"曾用名\",\"description\":\"\",\"itemNameCn\":\"曾用名\",\"itemAlias\":\"曾用名\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市国家地区\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市国家地区\",\"itemAlias\":\"何地迁来本市国家地区\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"与户主关系\",\"description\":\"\",\"itemNameCn\":\"与户主关系\",\"itemAlias\":\"与户主关系\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"公民身份证号码\",\"description\":\"公民身份号码\",\"itemNameCn\":\"公民身份证号码\",\"itemAlias\":\"公民身份证号码\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"公民身份号码\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户类型\",\"description\":\"\",\"itemNameCn\":\"户类型\",\"itemAlias\":\"户类型\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"常住人口ID\",\"description\":\"\",\"itemNameCn\":\"常住人口ID\",\"itemAlias\":\"常住人口ID\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"}]"}]',
        //   operation_desc: '1.如不传任何参数访问接口，则接口会返回1-999条数据(get/post均可)/n2.如需传送参数来访问接口，则应使用post请求访问接口(参数格式如：startIndex:1)'
        // }, {
        //   id: '12987122',
        //   service_url: 'http://192.168.13.141:8180/webService/interface/ec5f4d1b-7a4e-47ff-gsd3-3fs3-78avd706BEA43063D45849F2769586DFB4692',
        //   request_info: '[{"end_date":"2017-09-22 23:59:59","operation_date":"2017-08-26 18:34:29","type":"HTTP","uuid":"7ea4bc11f15547ea9dcc63b788dbec8c","url":"http://178.16.32.40:8093/webServiceApi/interface/06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7/84a6ff5538f62f3ce73f6afafc43b4845285d3043d27fe1ee68622c3e26c2e8236e44afc59291931b111d15cf71bcb72","dir_type":"dir","form":"json","service_id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","name":"常住人口信息","demande_way":"get","set_id":"UaLmwWB1EeeGP8z9ublHbw1127","id":"06a59782-d7a6-4ce8-8ae0-e0d3fa4482a7","status":"published","start_date":"2017-08-26 00:00:00","info":"[{\"itemName\":\"住址行政区划\",\"description\":\"\",\"itemNameCn\":\"住址行政区划\",\"itemAlias\":\"住址行政区划\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"住址详细地址\",\"description\":\"\",\"itemNameCn\":\"住址详细地址\",\"itemAlias\":\"住址详细地址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市详址\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市详址\",\"itemAlias\":\"何地迁来本市详址\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何因迁来本市\",\"description\":\"\",\"itemNameCn\":\"何因迁来本市\",\"itemAlias\":\"何因迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户号\",\"description\":\"\",\"itemNameCn\":\"户号\",\"itemAlias\":\"户号\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何时迁来本市\",\"description\":\"\",\"itemNameCn\":\"何时迁来本市\",\"itemAlias\":\"何时迁来本市\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"曾用名\",\"description\":\"\",\"itemNameCn\":\"曾用名\",\"itemAlias\":\"曾用名\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"何地迁来本市国家地区\",\"description\":\"\",\"itemNameCn\":\"何地迁来本市国家地区\",\"itemAlias\":\"何地迁来本市国家地区\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"与户主关系\",\"description\":\"\",\"itemNameCn\":\"与户主关系\",\"itemAlias\":\"与户主关系\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"公民身份证号码\",\"description\":\"公民身份号码\",\"itemNameCn\":\"公民身份证号码\",\"itemAlias\":\"公民身份证号码\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"公民身份号码\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"户类型\",\"description\":\"\",\"itemNameCn\":\"户类型\",\"itemAlias\":\"户类型\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"},{\"itemName\":\"常住人口ID\",\"description\":\"\",\"itemNameCn\":\"常住人口ID\",\"itemAlias\":\"常住人口ID\",\"dataBaseName\":\"成都市公民信息管理系统\",\"itemDesc\":\"\",\"tableName\":\"常住人口信息\"}]"}]',
        //   operation_desc: '1.如不传任何参数访问接口，则接口会返回1-999条数据(get/post均可)/n2.如需传送参数来访问接口，则应使用post请求访问接口(参数格式如：startIndex:1)'
        // }],
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
            validator: checkCount,
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
            vm.$message({
              type: "error",
              title: '系统错误',
              message: res.message,
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
            vm.collectionStatus = vm.detail_pro.isCollection;
            vm.getDataItemList(); // 获取数据项列表
          } else {
            vm.$message({
              type: "error",
              title: '系统错误',
              message: res.message,
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
              vm.$message({
                type: "error",
                title: '查询错误',
                message: res.message
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
              vm.$message({
                type: "error",
                title: '查询错误',
                message: res.message,
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
                message: res.message,
              });
            }
            
          } else {
            vm.$message({
              type: "error",
              title: '纠错失败！',
              message: res.message
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
            alert(1)
            vm.$message({
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
      timeChange(time) {
        console.log(time);
      },
      goback() {
        this.$router.go(-1);
      }
    }
};