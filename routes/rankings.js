var express = require('express');
var router = express.Router();

const {db} = require('../db/db')
/* GET home page. */
router.get('/', function(req, res, next) {
   country = req.query.country;
   year = req.query.year;
   const queries = req.query;
   console.log(queries);
  

const regex = /\d/;

// Check if string contians numbers
const doesItHaveNumber = regex.test(country);
if(doesItHaveNumber){
  res.status(400),res.send({
    error:true,
    message:"invalid country name"
  })
}
   
  if(!Object.entries(queries)[0]){
    db.select('rank','country','score','year').from('rankings').orderBy('year', 'desc').then(data=>{
      if(!data[0]){res.status(400),res.send({
        "error": true,
        "message": "Invalid country format. Country query parameter cannot contain numbers."
      })}
      else{
        res.status(200),res.send(data)
      }
    });
  }else if(Object.entries(queries).length>2){
    console.log("more than 2");
    res.status(400),res.send({
      error:true,
      message:"invalid query parameter"
    });
  }else if(country && !year){
    db.select('rank','country','score','year').from('rankings').where('country',country).orderBy('year', 'desc').then(data=>{
                  // if(!data[0]){res.status(400),res.send({
                  //   "error": true,
                  //   "message": "Invalid country format. Country query parameter cannot contain numbers."
                  // })}
                  if(!data[0]){res.status(200),res.send(data)}
                  else{
                    res.status(200),res.send(data)
                  }
                });
  }else if(!country && year){
    db.select('rank','country','score','year').from('rankings').where('year',year).then(data=>{
     
      let isnum = /^\d+$/.test(year);
    if(!isnum){
      res.status(400),res.send({
        error:true,
        message:"invalid year"
      })
    }
                  // if(!data[0]){res.status(400),res.send({
                  //   "error": true,
                  //   "message": "Invalid country format. Country query parameter cannot contain numbers."
                  // })}
                   if(!data[0]){res.status(200),res.send([])}
                  else{
                    res.status(200),res.send(data)
                  }
                });
  }else if(country && year){
    db.select('rank','country','score','year').from('rankings').where('year',year).andWhere('country',country).then(data=>{
          if(!data[0]){res.status(400),res.send({
            "error": true,
            "message": "Invalid country format. Country query parameter cannot contain numbers."
          })}
          else{
            res.status(200),res.send(data)
          }
        });
  }else{
    res.status(400);
  }
   
});
  





//     
module.exports = router;
