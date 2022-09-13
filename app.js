712
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

const listSchema ={
  name:String,
  items:itemsSchema
}

const Lista=mongoose.model("Lista",listSchema);

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
    //search if item have registers  this method get back an Array
    Item.find(function(err, temas){
        //console.log(temas.length);
        //if item doesnot have register, insert defaulItems to Item
        if(temas.length===0){
          Item.insertMany(defaulItems,function(err){
              if(err){
                console.log("ups fail insert "+err);
              }
              else{
                console.log("Insert succesfully");
              }
          });
          res.redirect("/");
        }
        else{
          //si Item ya tiene registros los muestra
          res.render("list", {
                             encabezado: "Today",
                             newListItems: temas
                             });
            }
    });
});

app.post("/", function(req, res) {
  //Es la nueva tarea que se va a agregar
  const newItem=req.body.newItem;
  //te dice el encabezado que presiono el botton submit
  const listName=req.body.list.trim();
  //Forma 1 de insetar registro
  const item= new Item({
    name:newItem
  });
  if (listName==="Today"){
    item.save();
    res.redirect("/");
  }
  else{
    Lista.findOne({name:listName},function(err, foundList ){
        console.log("El valor es "+foundList);
        foundList.items.push(item);
        foundList.save();
        res.redirect("/")
      res.redirect("/"+listName);

    });
  }
  });

  //Forma 2 de insertar Registro
  // Item.collection.insertOne({name:newItem},function(err){
  //   if (err){
  //     console.log("The new item insert fail");
  //   }
  //   else {
  //     res.redirect("/");
  //     console.log("New item its inserted");
  //   }
  // });


app.post("/deleted",function(req, res){
//  const { ObjectId } = require('mongodb');
//  const _id = ObjectId(req.body);
//  id = mongoose.Types.ObjectId(req.body);
//var str = req.body;
 //var mongoObjectId = mongoose.Types.ObjectId(str);
  console.log(req.body);
  //console.log(id);

  Item.deleteOne(req.body,function(err){
    if (err){
      console.log("a error when try to delte item "+err);
    }
    else{
      console.log("Item was deleted");
    }
  });
  res.redirect("/");
});

app.get("/:id",function(req,res){
  //app.get('/favicon.ico', (req, res) => res.status(204).end());
  //console.log(req.params.id);
  const id =req.params.id;

  //search if "id" exists on Lista, return a object in this case its name is "object"
  Lista.findOne({name:id},function(err,object){
    if(!err) //no error
      if(!object) // check if exists the object
      {
          //create a new list
        const lista = new Lista({
          name:id,
          items:defaulItems
        });
        lista.save();
        res.redirect("/"+id)
      }
    else{
      //show an existis list
      console.log("se encontro "+object.name);
      //si Item ya tiene registros los muestra
      res.render("list", {
                         encabezado: id,
                         newListItems: defaulItems
                         });
        }
  });
});

// app.get("/work", function(req, res) {
//   res.render("list", {
//     encabezado: "Tareas del dia",
//     newListItems: workItems
//   })
// });

app.get("/about",function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// app.post("/work",function(req,res){
//   res.redirect("/work");
// });
