const router = require("express").Router(),
  util = require("../common/util.js");

router.route("/home/submitCustomerQuestion")
  .get(function (request, response) {
    response.json(util.json("/interaction/data/home_submitCustomerQuestion.json"));
  });
router.route("/home/getNewResourceByDep")
  .post(function (request, response) {
    response.json(util.json("/interaction/data/home_getNewResourceByDep.json"));
  });
router.route("/home/getPolicyDetailById")
  .get(function (request, response) {
     let datas = {};
    var policyId = request.query.policyId;
    if (policyId == 'a339edb1097d43408ab095c72b3c3dbe') {
      datas = util.json("/interaction/data/home_getPolicyDetailById1.json");
    } else {
      datas = util.json("/interaction/data/home_getPolicyDetailById.json");
    }
    response.json(datas);
  });
router.route("/home/requirementNewDepTree")
  .get(function (request, response) {

    let datas = {};
    var pid = request.query.pid;
    if (pid == 'root') {
      datas = util.json("/interaction/data/linkage.json");
    }else{
       datas = util.json("/interaction/data/linkage1.json");
    }
    response.json(datas);

  });


module.exports = router;
