var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  const home = {
    contest: 'Udaan Hiring Challenge',
    project: 'Online movie ticket booking system',
    name: 'Akhilesh Kumar',
    branch: 'Computer Science and Engineering',
    college: 'National Institute of Technology, Hamirpur (H.P.)'
  };

  res.send(JSON.stringify(home));
});

module.exports = router;
