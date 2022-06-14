var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  // res.render('index', { title: 'Express' });
  //console.log(req.query)
  //console.log(req.cookies)
  //res.cookie("test", "test")
  //req.session.test = "test"
  console.log(req.session)
  res.json(req.query)

});

module.exports = router;