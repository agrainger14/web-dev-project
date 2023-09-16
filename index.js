require("dotenv").config();

const express = require("express");
const app = express();

const path = require('path');

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/")),
  express.static(path.join(__dirname, "node_modules/datatables.net-bs5/css")),
  express.static(path.join(__dirname, "node_modules/datatables/media/css"))
)

app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js/")),
  express.static(path.join(__dirname, "node_modules/jquery/dist/")),
  express.static(path.join(__dirname, "node_modules/datatables.net/js")),
  express.static(path.join(__dirname, "node_modules/chart.js/dist/")),
  express.static(path.join(__dirname, "node_modules/datatables.net-bs5/js/")),
)

app.use(express.static(path.join(__dirname, 'public')));  

//cookie parser to parse httponly cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//api routing
app.use(express.json());
const userRouter = require("./api/user/router");
const moodRouter = require("./api/mood/router");
app.use("/api/user/", userRouter);
app.use("/api/mood/", moodRouter);

//frontend routes
app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/views/');
})

app.get('/moodlist.html', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/views/moodlist.html');
})

app.get('/moodsummary.html', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/views/moodsummary.html');
})

//redirect route
app.get('*', (req, res) => {
  res.status(404).redirect('/')
});

module.exports = app;