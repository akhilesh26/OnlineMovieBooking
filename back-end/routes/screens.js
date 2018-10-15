var express = require('express');
var router = express.Router();

var con = require('./../db/connect');

/* Post seats detail of screens. */
router.post('/', function(req, res) {
  
  const seatInfo = req.body.seatInfo;
  const name = req.body.name;
  const isReserved = false;
  
  let values = [];
  let sql = 'insert into tickets (screen_name, seat_name, is_reserved, is_aisle) values ?';

  for(let key of Object.keys(seatInfo)){
    for( let seatNum = 0; seatNum < seatInfo[key].numberOfSeats; seatNum++){  
      const seat = key+seatNum; // creat seat name like A1, A2 extra
      const aisleSeats = seatInfo[key]['aisleSeats'].indexOf(seatNum) != -1; 
      values.push([name, seat, isReserved, aisleSeats]);
    }
  }
  
  //query execution part
  con.query(sql, [values], function (error, result) {
    if(error){
      console.log(error.message);
      res.send({
          code:400,
          status:false,
          message: `${error.message}`
      })
    } else {
        res.send({
            code:200,
            status:true,
            message: ` ${result.affectedRows} seats are added successfully in ${name}`
        })
    }
  
  });

});

/* Reserve seats ----------------------------------------------------*/
router.post('/:screenName/reserve', function(req, res) {
  // console.log(req.params);
  // console.log(req.body);
  const seats = req.body.seats;
  const screenName = "'" + req.params.screenName + "'";
  const requiredSeats = [];

  for(let row of Object.keys(seats)){
    //console.log(row);
    for(let num of seats[row]){
      //console.log(row+num);
      let seat = row+num;
      requiredSeats.push("'" + seat + "'");
    }
  }

  console.log(requiredSeats);
  const required = requiredSeats.length;

  let checkSql = `select count(*) as availability from tickets where seat_name in (${requiredSeats}) and is_reserved = ${false} and screen_name = ${screenName}`;
  let reserveSql = `update tickets set is_reserved = ${true} where seat_name in (${requiredSeats}) and screen_name = ${screenName} `;
  
  //query execution part
  con.query(checkSql, function (error, result) {
    
    if(error){
    
      res.send({
          code:400,
          status:false,
          message: `${error.message}`
      })
    } else {
        const availability =  result[0].availability;
        console.log(required, availability);
        if(required == availability){
          con.query(reserveSql, function(error, result){
            if(error){   
              res.send({
                code:400,
                status:false,
                message: `${error.message}`
              })
            } else{
              res.send({
                code:200,
                status:true,
                message: 'successfully reserved'
              })
            }
          })
        } else{
          res.send({
            code:400,
            status:false,
            message: `Reservation failure due to seats are not available`
          })
        }
    }
  
  });
  
});

/* Get unreserved seats list ---------------------------------------*/
router.get('/:screenName/seats', function(req, res){
  const status = req.query.status;
  const screen_name = "'" + req.params.screenName + "'";
  const numberOfSeats = Number(req.query.numSeats);
  const choice = req.query.choice;
  
  if(status) {
    const query = `select seat_name, is_reserved from tickets where screen_name = ${screen_name}`;
  
    //query execution unreserve seat status
    con.query(query, function (error, result) {
      
      if(error){
        console.log(error.message);
        res.send({
            code:400,
            status:false,
            message: `${error.message}`
        })
      } else {
          let data = {};

          for(let row of result) {
            console.log(row);
            
            const rowName = row.seat_name[0];
            const isReserved = row.is_reserved;
            const rowNumber = Number(row.seat_name.substr(1));
            
            if(isReserved == 0){
              if(rowName in data){
                data[rowName].push(rowNumber);
              } else {
                data[rowName] = [rowNumber];
              }
            } else{
              if(!(rowName in data)){
                data[rowName] = []
              }
            }  
          }
      
          const answer = {"seats": data};
          console.log(answer);
          res.send({
              code:200,
              status:true,
              message: `successful`,
              data: answer
          })
      }
    
    });
  } else if(choice && numberOfSeats != undefined) {
    const query = `select seat_name, is_aisle from tickets where screen_name = ${screen_name} and is_reserved = ${false} and seat_name like ${"'" + choice[0] + '%' + "'"}`;
    
    //query execution for choice seats availability
    con.query(query, function (error, result) {
      
      if(error){
        console.log(error.message);
        res.send({
            code:400,
            status:false,
            message: `${error.message}`
        })
      } else {
          let data = [];
          let ans = [];

          console.log(result);
          console.log(numberOfSeats);
          console.log(result.length - numberOfSeats);
          

          for( let i = 0; i <= result.length - numberOfSeats; i++){
            let isValid = true;
            for (let j = i+1; j < numberOfSeats + i; j++){
              
              if(Number(result[j-1]["seat_name"].substr(1)) == Number(result[j]["seat_name"].substr(1)) - 1) {
                
                if((result[j-1]["is_aisle"] == 1) && (result[j-1]["is_aisle"] == 1)){
                  isValid = false;
                  break;
                }
              } else{
                isValid = false;
                break;
              }
            }
            if(isValid == true){
              let temp = [];
              for(let k = i; k < i+numberOfSeats; k++){
                temp.push(result[k]["seat_name"]);
              }
              ans.push(temp);
            }
          }

          let finalAns;

          for(set of ans){
            for(seat of set){
              if(seat == choice){
                finalAns = set;
              }
            }
            
          }
          
          if(finalAns.length){
            res.send({
              code:200,
              status:true,
              message: `successful`,
              availableSeats: finalAns
            })
          } else{
            res.send({
              code:400,
              status:false,
              message: 'Consicutive seats are not available',
            })
          }
          
      }
    
    });
  } else {
    res.send('Invalid params');
  }

});


module.exports = router;
