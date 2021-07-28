var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const {db} = require('../db/db')
const mysql = require('mysql2')

require('dotenv').config();
/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.select().from('user').then(data=>{
    if(!data[0]){res.status(400),res.send({
      error: true,
      message: "No Users in database"
    })}
    else{
      res.status(200),res.send(data)
    }
  });
});

router.route('/register').post(
  (req,res)=>{
      if(req.body.email && req.body.password){
        db.distinct().from('user').pluck('email').then(data=>{
          data.forEach(emails => {
            if(emails == req.body.email){
              res.status(409),res.send({
                error: true,
                message: "User already exists"
              })
              return
            }
          });
        });
        db('user').insert({email: req.body.email,password:req.body.password}).then();
        db('profile').insert({email: req.body.email,firstName:"",lastName:"",dob:'2021-1-1',address:""}).then(data=>{
          if(data){res.status(201),res.send({
            message: "User created"
          })}
        })
      }else{
        res.status(400),res.send({
          error: true,
          message: "Request body incomplete, both email and password are required"
        })
      }
      }
  );

  router.route('/login').post(
    (req,res)=>{
        if(req.body.email && req.body.password){
          const signedUser = {
            email : req.body.email,
            password : req.body.password
          } 
          db.select().from('user').then(data=>{
            data.forEach(userInfo => {
              if(userInfo.email == req.body.email && userInfo.password == req.body.password){
                
                
                const token = jwt.sign(signedUser,process.env.TOKEN_SECRET,{expiresIn:"1h"})
                res.cookie("token",token);
                res.status(200),res.send({
                  "token": token,
                  "token_type": "Bearer",
                  "expires_in": 86400
                })
              }
            });
            res.status(401),res.send({
              error: true,
              message: "Incorrect email or password"
            })
          })
        }else{
          res.status(400),res.send({
            error: true,
            message: "Request body incomplete, both email and password are required"
          })
        }
        }
    );

router.get('/:email/profile', function(req, res, next) {
  const email = req.params.email;
  if(!req.headers['authorization']){
    //if email exists
    db.select('email').from('profile').where('email',email).then(data=>{
      
        if(data[0]){
          res.status(200),res.send({
            email: email,
            firstName:null,
            lastName:null
          })
           }else{
            res.status(404),res.send({
              error:true,
              message:"user no found"
          })
           }
    });

  }else{
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    let userEmail;
    if(!token){res.status(200),res.send({
      error:true,
      message:"Token not found"
    })}
     jwt.verify(token, process.env.TOKEN_SECRET , (err,decoded) => {
      if (err) {return res.sendStatus(404),res.send({
        error:true,
        message:"should be an object result"
      })};userEmail=decoded.email});
     
  
  if(email==userEmail){
    db.select().from('profile').where('email',email).then(data=>{
      if(!data[0]){res.status(404),res.send({
        error: true,
        message: "User not found"
      })}
      else{
        //res.status(200),res.send(data[0])
        res.status(200),res.send({
          email:data[0].email,
          firstName:null,
          lastName:null,
          dob:null,
          address:null
        })
      }
    });
  }else{
    db.select('email','firstName','lastName').from('profile').where('email',email).then(data=>{
      if(!data[0]){
      //   res.status(200),res.send({
      //   email: email,
      //   firstName:null,
      //   lastName:null
      // })
      res.status(404),res.send({
        error:true,
        message:"user not found"
      })
    }
    else{
        res.status(200),res.send({
          email:data[0].email,
          firstName:null,
          lastName:null
        })
    }
    });
  }
  
  }
});


var connection = mysql.createConnection({
  host: 'localhost',
  database: process.env.database,
  user:     process.env.user,
  password: process.env.password
});


router.put('/:email/profile', function(req, res, next) {
  if(!req.headers['authorization']){
    res.status(401),res.send({
      error: true,
      message: "Authorization header ('Bearer token') not found"
    })
  }else{
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    let userEmail;

    jwt.verify(token, process.env.TOKEN_SECRET , (err,decoded) => {
     if (err) {return res.sendStatus(403),res.send({
       error:true,
       message:"error"
     })};userEmail=decoded.email});

  const email = req.params.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = Date.parse(req.body.dob);
  var dateDate = new Date(dob);
  const address = req.body.address;
console.log(firstName , lastName ,dateDate , address);
if(firstName && lastName  &&  req.body.dob && address){
  var dateAray = req.body.dob.split("-");
  if(email != userEmail){
    res.status(403),res.send({
      error:true,
      message:"non-matching user"
    })
  }
  
 
const regex = /\d/;

    const doesItHaveNumber = regex.test(firstName);
    console.log("first name : ",doesItHaveNumber);
    if(doesItHaveNumber){// stops the program execution needs to be fixed
      res.status(400),res.send({
        error:true,
        message:"Request body invalid, firstName, lastName and address must be strings only."
      })
    }
    const doesItHaveNumber2 = regex.test(lastName);
    console.log("first name : ",doesItHaveNumber2);
    if(doesItHaveNumber2){// stops the program execution needs to be fixed
      res.status(400),res.send({
        error:true,
        message:"Request body invalid, firstName, lastName and address must be strings only."
      })
    }
    if(typeof(address) == "boolean"){// stops the program execution needs to be fixed
      res.status(400),res.send({
        error:true,
        message:"Request body invalid, firstName, lastName and address must be strings only."
      })
    }
   
    if(dateDate == "Invalid Date"){
      res.status(400),res.send({
        error:true,
        message:"Invalid input: dob must be a real date in format YYYY-MM-DD."
      })
    }
    
    if(req.body.dob.length !== 10){
      res.status(400),res.send({
        error:true,
        message:"Invalid input: dob must be a real date in format YYYY-MM-DD."
      })
    }
    var splitDate = req.body.dob.split("-");
    console.log(splitData);
    console.log(splitDate[0]);

  db.select('email').from('profile').where('email',email).then(data=>{
  console.log(data);
      if(data[0]){
        // res.status(200),res.send({
        //   email: email,
        //   firstName:null,
        //   lastName:null
        // })
         }else{
          res.status(403),res.send({
            error:true,
            message:"user no found"
        })
         }
  });


  if(email != userEmail){
    res.sendStatus(403).send({
      error:true,
      message:"forbidden"
    })
  }
  
    // if date in past{}
  if(dateAray[0]<2021){
    res.sendStatus(200).send({
      
      message:"past"
    })
  }else if(dateAray[0]>2021){
    res.sendStatus(400).send({
      error:true,
      message:"future"
    })
  }else if(dateAray[1]>12 || dateAray[2]>31){
      res.sendStatus(400).send({
        error:true,
        message:"out of bonds date"
      })
  }  
    
    
    ///
    try {
      connection.connect(function(err) {
        if (err) throw err;
        var sql = 'update profile set firstName = ? , lastName = ? ,dob = ? ,address = ?  where email= ?';
        connection.query(sql,[firstName,lastName,dateDate,address,email], function (err, result) {
          if (err) throw err;
          res.send({
            "email": email,
            "firstName": firstName,
            "lastName": lastName,
            "dob": dateDate,
            "address": address
          });
        });
      });
    } catch (error) {
      console.log("error",error);
    }
   
////
// knes update  querry 
// db('profile').where('email',email)
  //   .update({
  //     address:"a new address"
  //   })
  //   .then((data)=>{res.send(data)})}    
/// 
  }else{
    res.status(400),res.send({
      error:true,
      message:"Request body incomplete: firstName, lastName, dob and address are required."
    })
  }
  
}});



module.exports = router;
  

