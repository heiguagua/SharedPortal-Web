const router = require("express").Router(),
  util = require("../common/util.js");

router.route("/home/subjects")
  .get(function (request, response) {
    response.json(util.json("/sbuject/data/home_getThematicAppData.json"));
});

router.route("/home/subjectsDep")
  .get(function (request, response) {
    var pid = request.query.pid;
    if(pid && pid == "9556054c38794e0d968d9e5482894b3a"){
      console.log(1);
      response.json(util.json("/sbuject/data/home_getAppsByDept.json"));
    }else if(pid && pid == "421b9cea8ce74d9ab392f51b2ef3eb65"){
      response.json(util.json("/sbuject/data/home_getAppsByDept1.json"));
    }else if(pid && pid == "74f9540b115c4d0d96dfffd4ffebd112"){
      response.json(util.json("/sbuject/data/home_getAppsByDept2.json"));
    }
  });


module.exports = router;
