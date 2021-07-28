var express = require('express');
var router = express.Router();
const {db} = require('../db/db')
/* GET home page. */
router.get('/', function(req, res, next) {
  db.distinct().from('rankings').pluck('country').orderBy('country', 'asc').then(data=>{
    if(!data[0]){res.status(400),res.send({
      "error": true,
      "message": "Invalid query parameters. Query parameters are not permitted."
    })}
    else{
      res.status(200),res.send(data)
    }
  });
});

router.get('/:year', function(req, res, next) {
  res.status(400),res.send({
      "error": true,
      "message": "Invalid query parameters. Query parameters are not permitted."
});
});

module.exports = router;
