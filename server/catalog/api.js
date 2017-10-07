const router = require("express").Router(),
  util = require("../common/util.js");

router.route("/list/statistics")
  .get(function (request, response) {
    // response.json(util.json("/catalog/data/statistics.json"));
    if(request.query.dir== '政务主题信息资源目录') {
      response.json(util.json("/catalog/data/statistics.json"));
    }
    else if(request.query.dir == '政务基础信息资源目录') {
      response.json(util.json("/catalog/data/statistics.json"));
    }
    else if(request.query.dir== '部门政务信息资源目录') {
      response.json(util.json("/catalog/data/statistics.json"));
    }
    else if(request.query.dir== '系统静态数据资源目录'){
      response.json(util.json("/catalog/data/system_static_data.json"));
    }
    else if(request.query.dir== '系统实时动态数据资源'){
      response.json(util.json("/catalog/data/system_real-time_dynamic_data.json"));
    }
 });
  router.route("/classify/getStatisticsByName")// 获取第一级菜单统计
  .post(function (request, response) {
    // response.json(util.json("/catalog/data/classify.json"));
    if(request.body.classify_name== '政务主题信息资源目录') {
      response.json(util.json("/catalog/data/classify.json"));
    }
    else if(request.body.classify_name == '政务基础信息资源目录') {
      response.json(util.json("/catalog/data/classify.json"));
    }
    else if(request.body.classify_name== '部门政务信息资源目录') {
      response.json(util.json("/catalog/data/classify.json"));
    }

 });
    router.route("/classify/getClassifyChildrenById")
  .post(function (request, response) {
    response.json(util.json("/catalog/data/classify.json"));

 });
 router.route("/classify/getFirstClassifyChildrenByName")// 获取第一级菜单子节点
  .post(function (request, response) {
    if(request.body.classify_name == '政务主题信息资源目录') {
      response.json(util.json("/catalog/data/classify.json"));
    }
    else if(request.body.classify_name == '政务基础信息资源目录') {
      response.json(util.json("/catalog/data/classify.json"));
    }
    else if(request.body.classify_name == '部门政务信息资源目录') {
      response.json(util.json("/catalog/data/department.json"));
    }
    else{
        response.json(util.json("/catalog/data/sub_nodes.json"));
    }

 });
router.route("/dataset/getDataSetByClassfyTreeCode")
  .post(function (request, response) {
    response.json(util.json("/catalog/data/resources.json"));

 });
  router.route("/dataset/getDataSetDetailsById")
  .post(function (request, response) {
    response.json(util.json("/catalog/data/details.json"));

 });
    router.route("/dataitem/getDatItemByDateSetId")
  .post(function (request, response) {
    response.json(util.json("/catalog/data/dataitem.json"));

 });
      router.route("/serviceinfo/getServiceInfoByDdcmId")
  .post(function (request, response) {
    response.json(util.json("/catalog/data/interfaces.json"));

 });
router.route("/dataCollection/dataCollectionList/checkCollectionData")
  .get(function(request, response) {
    response.json(util.json("/catalog/data/checkCollectionData.json"));

  });
router.route("/dataCollection/deleteCollection")
  .put(function(request, response) {
    response.json(util.json("/catalog/data/deleteCollectionData.json"));

  });
router.route("/dataCollection/createCollection")
  .put(function(request, response) {
    response.json(util.json("/catalog/data/insertCollectionData.json"));

  });
  router.route("/dataCorrection/dataCorrectionList/getCorrectionDataDesc")
  .get(function(request, response) {
    response.json(util.json("/catalog/data/correctionDataDesc.json"));

  });
    router.route("/dataCorrection/createDataCorrection")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/insertCorrectionData.json"));

  });
      router.route("/dataset/rating/getStatus")//获取评分
  .get(function(request, response) {
    response.json(util.json("/catalog/data/getStatus.json"));

  });
        router.route("/dataRate/createOrDeleteRate")//评分
  .post(function(request, response) {
    response.json(util.json("/catalog/data/updateStatus.json"));

  });
          router.route("/dataitem/itemDetail")//数据项详情
  .get(function(request, response) {
    response.json(util.json("/catalog/data/itemDetail.json"));

  });

   router.route("/department/getTableList")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/getTableList.json"));

  });

 router.route("/department/getDetail")
  .post(function(request, response) {
    if(request.query.source_type === "business"){
      response.json(util.json("/catalog/data/getDetail.json"));
    }else{
      response.json(util.json("/catalog/data/list_detail.json"));
    }

  });
  //查询系统静态数据资源目录第一层子节点
   router.route("/dicttable/getSystemSources")
   .post(function(request, response) {
    response.json(util.json("/catalog/data/system_static_data_tree.json"));
   });
    //查询系统静态数据资源目录第二层子节点
    router.route("/dicttable/getSystemDataBases")
    .post(function(request, response) {
    response.json(util.json("/catalog/data/system_static_data_second_tree.json"));
    });
  //查询系统静态数据资源目录--统计
  router.route("/dicttable/getSystemCounts")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/static_system_counts.json"));
  });
  //查询系统静态数据资源目录--数据表
  router.route("/dicttable/getSystemTables")
  .post(function (request, response) {
      response.json(util.json("/catalog/data/staticsource_system_tables.json"));
 });
  // 查询系统静态数据资源目录 详情
  router.route("/dicttable/getSystemTableById")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/system_table_by_id.json"));

  });
  //查询系统静态数据资源目录 列表信息
  router.route("/dicttable/getSystemTableColumns")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/data_dict_column.json"));

  });

  //查询系统实时动态数据资源第一层子节点
  router.route("/dbtable/getSystemSources")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/system_real-time_dynamic_data_tree.json"));
  });
    //查询系统实时动态数据资源第二层子节点
    router.route("/dbtable/getSystemDataBases")
    .post(function(request, response) {
    response.json(util.json("/catalog/data/system_real-time_dynamic_data_second_tree.json"));
    });
    //系统实时动态数据资源--统计
  router.route("/dbtable/getSystemCounts")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/dynamic_system_counts.json"));
  });
  //获取系统动态数据资源--数据表
  router.route("/dbtable/getSystemTables")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/dynamic_system_tables.json"));

  });
  //获取系统动态数据资源信息
  router.route("/dbtable/getSystemTableById")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/dbtable_table_id.json"));

  });
  //获取系统动态数据资源列表信息
  router.route("/dbtable/getSystemTableColumns")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/dbtable_column_list.json"));

  });
  //获取系统动态数据资源接口说明
  router.route("/dbtable/getInterfaces")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/info_systemdb_interfaces.json"));

  });
    router.route("/dataItemapply/createDataApply")// 申请数据项
  .post(function(request, response) {
    response.json(util.json("/catalog/data/batchInsertApplyInfo.json"));

  });

   // 系统目录表各行点击获取列表
    router.route("/department/getDetailBySystemId/resources")
  .post(function(request, response) {
    response.json(util.json("/catalog/data/getDetailBySystemId.json"));

  });

module.exports = router;
