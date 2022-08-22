
const express = require("express");
const bodyParser = require("body-parser");

const app =express();

var item="";
var items=["Buy Food","Cook Food","Eat Food"];
//con este se puede obtener informacion de archivo html o del template ejs.
//Como por ejemplo traer al informacion que puso el usuario de un input en el archivo html o template ejs
app.use(bodyParser.urlencoded({extended:true}));
//para utilizar el template ejs. En el arhivo html no se puede enviar info entonces se ocupan
//template para enviar valores. el mas popular es ejs
app.set('view engine','ejs');

app.get("/", function(req, res){
  //res.send("Hello");
  var today=new Date();
  var options = {
       weekday: "long",
       year: "numeric",
       month: "long",
       day: "numeric"
   };

  var day=today.toLocaleDateString("es-MX",options)

res.render("list",{kindofDay:day,newListItems:items});
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});

app.post("/",function(req, res){
  //console.log(req.body.texto);
   item =req.body.texto;
   items.push(item);
   //te redirige al inicio, pero en la variable item ya tiene el valor de "req.body.texto"
   res.redirect("/");
  //res.render("list",{newListItem:item});
});
