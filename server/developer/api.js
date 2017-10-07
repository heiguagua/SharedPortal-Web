const router = require("express").Router(),
  util = require("../common/util.js");

  router.route("/developapis/getDevelopApisByFid")
  .get(function (request, response) {
  var pid = request.query.pid;
  console.log(pid);
  if(pid == "cde3eb957d7c11e782df000c29e0ca25") { // 数据采集
    response.json(util.json("/developer/data/dev_apps_collection.json"));
  }
  else if(pid == "cde4d3be7d7c11e782df000c29e0ca25") {
    response.json(util.json("/developer/data/dev_apps_deal.json"));
  }
  else{
    response.json(util.json("/developer/data/dev_apps.json"));
  }

});


module.exports = router;
