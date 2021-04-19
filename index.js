var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

var app = express();
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

mongoose.connect("mongodb://localhost/db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
  const Schema = mongoose.Schema;
  let userSchema = new Schema({
    name: String,
    surname: String,
    cinsiyet: String,
    telefon: Number,
    adres: String,
    city: String,
    eposta: String,
    meslek: String,
    password: Number,
    date_of_birth: String
  });
  let user = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  // res.send("Anasayfa");
});
/** LOGİN */
app.post("/Auth", function (req, res) {
  // console.log(req.body);
  if ( ["", null, undefined].includes(req.body.username) || ["", null, undefined].includes(req.body.userpassword) ) 
  {
    return res.status(200).send({
      responseCode: "CRM5",
      message: "Username and password can not be empty!",
    });
  } else {
    const username = req.body.username;
    const userpassword = req.body.userpassword;
    globalThis.random_key = Math.random().toString(36).replace(/[^a-z]+/g,'');
    user.findOne({ name: username, password: userpassword }, (err, docs) => {
      if (err) {
        console.log(err);
        // console.log("errorrr");
        res.status(200).send({
          responseCode: "CRM6",
          message: "user not found!"
        });
      }
      if (docs) {
        var payload = {
          _id: docs._doc._id,
        };
        jwt_options = {
          expiresIn: "1h",
        };
        const token = jwt.sign(payload, globalThis.random_key, jwt_options);
        return res
          .status(200)
          .send({ responseCode: "CRM0", message: "success", token: token });
      }else{
        res.status(200).send({
          responseCode: "CRM6",
          message: "User not found!"
        });
      }
    });
  }
});

app.get("/search", function (req, res) {
  let jwt_ = req.header("Authorization");
  let user_name = req.header("Name");
  jwt.verify(jwt_, globalThis.random_key, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      user
        .findOne({ name: user_name }, (err,docs) => {
          if (err) {
            console.log("errrooorrr");
            console.log(err);
            res.send(err);
          } else if(docs){
            res.send(docs);
            // console.log("docs");
          }else if(["",null,undefined].includes(user_name)){
            res.status(200).send({
              responseCode: "CRM7",
              message: "Search name can not be empty!"
            })
          }
          else{
            res.status(200).send({
              responseCode: "CRM6",
              message: "Name is not found!"
            });
          }
        });
    }
  });
});
app.post("/add", function (req, res) {
  let jwt_ = req.header("Authorization");
  jwt.verify(jwt_, globalThis.random_key, (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      var data =req.body.Data;
      user.insertMany(data,function(err,response){
        if(err) throw err;
        var b = JSON.stringify(response);
        res.send(b);
      })
    }
  });
});

app.delete("/delete/:name", function (req, res) {
  let jwt_ = req.header("Authorization");
  jwt.verify(jwt_, globalThis.random_key, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      var user_name = req.params.name;
      user.findOne({name:user_name},function(err,docs){
        if(err){
          console.log(err);
          res.send(err);
        }
        else if(docs){
          // console.log(docs);
          user
            .deleteOne({ _id: docs._doc._id })
            .then(function () {
              res.send(docs._doc.name+" "+docs._doc.surname+" deleted"); // Successful
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        else{
          res.status(200).send({
            responseCode: "CRM6",
            message: "User not found!"
          })
        }
      });
      
    }
  });
});
app.put("/update/:id", function (req, res) {
  let jwt_ = req.header("Authorization");
  jwt.verify(jwt_, globalThis.random_key, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      var data_id = req.params.id;
      var data = JSON.parse(req.body.Data);
      var query = { _id: data_id };
      var newvalues = { $set: data };
      // console.log(newvalues);
      // console.log(data);
      user
        .updateOne(query, newvalues, (err, response) => {
          if (err) {
            console.log(err);
          }
          res.send(response);
        });
    }
  });
});

app.post("/test", function (req, res) {
  let jwt_ = req.header("Authorization");
  jwt.verify(jwt_, globalThis.random_key, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      res.send(decoded);
    }
  });
});
app.listen(8080, () => {
  console.log("8080 portu dinleniyor.");
});
