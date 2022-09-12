
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

    Item.find(function(err, temas){
        //console.log(temas.length);
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
          res.render("list", {
                             encabezado: "Today",
                             newListItems: temas
                             });
            }
    });
});


app.post("/", function(req, res) {
  const newItem=req.body.newItem;

  //Forma 1 de insetar registro
  const item= new Item({
    name:newItem
  })
  item.save();
  res.redirect("/");

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

});

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
  console.log(req.params.id);
  const id =req.params.id;


  Lista.findOne({name:id},function(err,array){
    if(err)
      {
        console.log("Error "+err);
        const lista = new Lista({
          name:id,
          items:defaulItems
        });
          Lista.save();
      }
    else{
      console.log("Hola "+array.name);
      array.forEach((item, i, x) => {
        console.log(item.name);
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
