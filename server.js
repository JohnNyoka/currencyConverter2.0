const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();

const dataSchema = new mongoose.Schema({
  name: String,
  password: String,
  country: String,
});
const DataModel = mongoose.model("User", dataSchema);

app.use(cors());
app.use(express.json());

//to create a new user
app.post("/users", (req, res) => {
  console.log(req.body);
  const newData = new DataModel(req.body);
  newData
    .save()
    .then(() => console.log("saved to mongo"))
    .catch((err) => console.log(err))
    .then(() => {
      res.status(200).json("user is signed in");
    });
});

//to check if user exists
app.post("/auth", (req, res) => {
  console.log(req.body);
  DataModel.findOne({ name: req.body.name, password: req.body.password })
    .then((user) => {
        console.log({user})
      res.status(200).json(user);
    })
    .catch((err) => {
        console.log({err})
      res.status(404).json("user not found");
    });
});
console.log("connecting to mongo...");
mongoose
  .connect(
    "mongodb+srv://johnchainzny:luke1994@cluster0.wvuxpea.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to mongo");
    app.listen(3001, () => {
      console.log("now listening to port 3001");
    });
  });
