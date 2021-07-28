var express = require('express');
var router = express.Router();
const {db} = require('../db/db');
const jwt = require('jsonwebtoken');



router.get('/:year',(req, res) => {
  const queries = req.query;
  
  year = req.params.year;
  country = req.query.country;
  limit = req.query.limit;
  
 
  
  if(!req.headers['authorization']){
        res.status(401),res.send({
          error: true,
          message: "Authorization header ('Bearer token') not found"
        });
      }else{
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
        const prefix = req.headers['authorization'] && req.headers['authorization'].split(' ')[0]
        if(prefix != "Bearer"){
          return res.status(401),res.send({
            error:true,
            message:"Authorization header is malformed"
          })
        }
        jwt.verify(token, process.env.TOKEN_SECRET , (err) => {
          if (err) {return res.status(401),res.send({
            error:true,
            message:"Invalid JWT token"
          })}});
        }
  
  if(!year){
    res.status(400),res.send({
      error:true,
      message:"year not provided"
    })
  }else if(year && !Object.entries(queries)[0]){
    
    let isnum = /^\d+$/.test(year);
    if(!isnum){
      res.status(400),res.send({
        error:true,
        message:"invalid year"
      })
    }
    
    db.select('rank','country','score','economy','family','health','freedom','generosity','trust').where('year',year).from('rankings').then((data)=>{
      // if(!data[0]){res.status(400),res.send({
      //   "error": true,
      //   "message": "Invalid year format. Format must be yyyy."
      // })}
      if(!data[0]){res.status(200),res.send([])}
      else{
        res.status(200),res.send(data)
      }
      
    });
  }else if(year && country && !Object.entries(queries)[1] ){
 
const regex = /\d/;

if(regex.test(country)){
  res.status(400),res.send({
    "error": true,
    "message": "Invalid year format. Format must be yyyy."
  })
}

    db.select('rank','country','score','economy','family','health','freedom','generosity','trust').where('year',year).andWhere('country',country).from('rankings').then((data)=>{
          if(!data[0]){res.status(200),res.send([])}
          if(!data[0]){res.status(200),res.send([])}
          else{
            res.status(200),res.send(data)
          }
        });
  }else if(year && limit && !Object.entries(queries)[1]){
    if(limit<1 || limit%1 != 0){
      res.status(400),res.send({
        error:true,
        message:"invalid limit"
      })
    }
    db.select('rank','country','score','economy','family','health','freedom','generosity','trust').where('year',year).from('rankings').limit(limit).then((data)=>{
      if(!data[0]){res.status(400),res.send({
        "error": true,
        "message": "Invalid year format. Format must be yyyy."
      })}
      else{
        res.status(200),res.send(data)
      }
    });
  }else{
    res.status(400),res.send({
      error:true,
      message:"invalid query parameter"
    })
  }



});

module.exports = router;
