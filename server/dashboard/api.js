const router = require("express").Router(),
  util = require("../common/util.js");

  router.route("/home/countDataShareSituation")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_countDataShareSituation.json"));
  });
  router.route("/home/listLatestpolicies")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_listLatestpolicies.json"));
  });
    router.route("/home/listLatestDirectory")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_listLatestDirectory.json"));
  });
    router.route("/home/listHottestDirectory")
  .get(function (request, response) {
    let datas = {};
    var pageNum = request.query.pageNum;
    var pageSize = request.query.pageSize;
    if (pageNum == 2) {
      datas = util.json("/dashboard/data/home_listHottestDirectory1.json");
    } if(pageSize == 3){
       datas = util.json("/dashboard/data/home_listHottestDirectory2.json");
    }
     else {
      datas = util.json("/dashboard/data/home_listHottestDirectory.json");
    }
    response.json(datas);
  });
    router.route("/home/listLatestDbResource")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_listLatestDbResource.json"));
  });
  router.route("/home/listHottestResource")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_listHottestResource.json"));
  });
    router.route("/home/getCarouselPicNews")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_getCarouselPicNews.json"));
  });
   router.route("/home/getCarouselDetail")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_getCarouselDetail.json"));
  });
     router.route("/home/getAllDeptInfoForFrontPage")
  .get(function (request, response) {
    response.json(util.json("/dashboard/data/home_getAllDeptInfoForFrontPage.json"));
  });
  
  

module.exports = router;