
const express = require("express");
const bodyParser = require("body-parser");

const mongoose=require("mongoose");
const app = express();


mongoose.connect("mongodb://localhost:27017/doListDB",{useNewUrlParser: true});

// const itemsSchema= new mongoose.Schema({
//   name: String
// });

const itemsSchema= {
  name: String
};

const Item=mongoose.model("Item",itemsSchema);

const Actividad4= new Item({
  name:"Dia 4"
});

const Actividad5= new Item({
  name:"Dia 5"
});

const Actividad6= new Item({
  name:"Dia 6"
});

const defaulItems =[Actividad4, Actividad5,Actividad6];


Item.insertMany(defaulItems,function(err){
    if(err){
      console.log("ups fail insert "+err);
    }
    else{
      console.log("Insert succesfully");
    }
});

//con este se puede obtener informacion de archivo html o del template ejs.
//Como por ejemplo traer al informacion que puso el usuario de un input en el archivo html o template ejs
app.use(bodyParser.urlencoded({
  extended: true
}));

//aqui defines que la carpeta public es una ruta predeterminada de lectura
app.use(express.static("public"));

//para utilizar el template ejs. En el arhivo html no se puede enviar info entonces se ocupan
//template para enviar valores. el mas popular es ejs
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  //res.send("Hello");

const day=date.getDate();
  res.render("list", {
    encabezado: "Today",
    newListItems: items
  });
});

app.post("/", function(req, res) {
  console.log(req.body);
  //console.log(req.body.texto);

  //Checa si el elemento button en value "variable encabezado" del archivo list.ejs es "Tareas del dia o la fecha del dia"
  if (req.body.button === "Tareas") {
    workItems.push(req.body.newItem);
    res.redirect("/work");
  } else {
    item = req.body.newItem;
    items.push(item);
    //te redirige al inicio, pero en la variable item ya tiene el valor de "req.body.texto"
    res.redirect("/");
  }
  //res.render("list",{newListItem:item});
});


app.get("/work", function(req, res) {
  res.render("list", {
    encabezado: "Tareas del dia",
    newListItems: workItems
  })
});

app.get("/about",function(req, res){
  res.render("about");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// app.post("/work",function(req,res){
//   res.redirect("/work");
// });
