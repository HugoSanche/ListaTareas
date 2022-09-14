
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash"); //trabaja con arreglos tiene varias ultildades

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
  items:[itemsSchema]
};
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
                             newListItems: temas //manda el arreglo (temas)de lo que encontro Item 
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
    //Busca listName en Lista y le agrega un nuevo item http://localhost:3000/work (le agregaria nuevo item a work)
    //work =listName
    Lista.findOne({name:listName},function(err, foundList ){
        foundList.items.push(item);
        foundList.save();
        //res.redirect("/")
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
  var checkedItemId = req.body.checkbox; //trae el valor del checkbox  del archivo list.ejs ("lo que tiene item._id")
  var nameTitle=req.body.listName; //trae el valor de listName de la etiqueta input del archivo list.ejs (lo que tiene encabezado)

 //var mongoObjectId = mongoose.Types.ObjectId(str);
  //console.log(id);
if (nameTitle==="Today")
  {
    //Delete a item from "Today" where _id=checkedItemId
    Item.deleteOne({_id:checkedItemId},function(err){
      if (!err){
        console.log("Sucessfully deleted checked item.");
        res.redirect("/");
      }
      else
        console.log("a error when try to delte item "+err);
    });
  }
else{
     //Delete one item from nameTitle and specific _id
      Lista.findOneAndUpdate({name:nameTitle},{$pull:{items:{_id:checkedItemId}}}, function(err,foundList)
        {
          if(!err)
            res.redirect("/"+nameTitle);
           else
             console.log("An error found "+err);
        })
      }
});

app.get("/:id",function(req,res){
  //app.get('/favicon.ico', (req, res) => res.status(204).end());
  //console.log(req.params.id);

  //npm i lodash
  const id =_.capitalize(req.params.id);
  //search if "id" exists on Lista, return a object in this case its name is "object"
  Lista.findOne({name:id},function(err,foundList){
    if(!err) //no error
      if(!foundList) // check if exists the object
      {
          //create a new list
        const lista = new Lista({
          name:id,
          items:defaulItems
        });
        console.log("Id "+id+" Items "+defaulItems);
        lista.save();
        res.redirect("/"+id)
      }
    else{
      //show an existis list
      //si Item ya tiene registros los muestra
      res.render("list", {
                         encabezado: foundList.name,
                         newListItems: foundList.items
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
