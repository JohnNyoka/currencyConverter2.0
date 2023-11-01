
const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();

const dataSchema = new mongoose.Schema({
  name: String,
  password: String,
  country: String,
});

const historySchema = new mongoose.Schema({
  userId: String,
 country: String,
 currencyvl: String,
});
const DataModel = mongoose.model("User", dataSchema);
const HistoryModel = mongoose.model("history", historySchema);

app.use(cors());
app.use(express.json());

//to create a new user
app.post("/users", (req, res) => {
  console.log(req.body);
  console.log("test call");
  const newData = new DataModel(req.body);
  newData
    .save()
    .then(() => console.log("saved to mongo"))
    .catch((err) => console.log(err))
    .then(() => {
      res.status(200).json("user is signed in");
    });
});

app.post("/history", (req, res) => {
  console.log(req.body);
  const newHistory = new HistoryModel(req.body);
  newHistory
    .save()
    .then(() => console.log("saved to mongo"))
    .catch((err) => console.log(err))
    .then(() => {
      res.status(200).json("history has been saved");
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

app.get("/history/:id", (req, res) => {
  let {id} = req.params
  console.log(req.body);
  HistoryModel.find({userId:id})
    .then((history) => {
        console.log({history})
      res.status(200).json(history);
    })
    .catch((err) => {
        console.log({err})
      res.status(404).json("history not found");
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
