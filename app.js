
const express = require("express");
const bodyParser = require("body-parser");

const app =express();

app.set('view engine','ejs');

app.get("/", function(req, res){
  //res.send("Hello");
  var today=new Date();
  var day=['Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday','Saturday','Sunday'];
  var currentDay = today.getDay();
switch (currentDay)
{
case 0:
    res.render("list",{kindofDay:day[0]});
    break;
case 1:
    res.render("list",{kindofDay:day[1]});
    break;
case 2:
    res.render("list",{kindofDay:day[2]});
    break;
case 3:
    res.render("list",{kindofDay:day[3]});
    break;
case 4:
    res.render("list",{kindofDay:day[4]});
    break;
case 5:
    res.render("list",{kindofDay:day[5]});
    break;
case 6:
    res.render("list",{kindofDay:day[6]});
    break;
    default:
    console.log("El dia Octavo aun no existe");
}


  // if (today.getDay()===6 || today.getDay()===0){
  //   //res.write("<p>Que bien es dia de descanso</p>");
  //   day="Weekend";
  // }
  // else{
  //   day="Weekday";
  //   // res.write("<p>el dia de hoy es</p>"+today.getDay());
  //   // res.write("<h1>oh oh es dia de trabajo</h1>");
  //   // res.send();
  // }
  // res.render("list",{kindofDay:day});
});

app.listen(3000,function(){
  console.log("Servwer started on port 3000");
});
