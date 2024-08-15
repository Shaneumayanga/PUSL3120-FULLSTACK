const express = require("express");
const app = express();
const PORT = 8080;

const cors = require("cors"); 

const { createDatabaseConnection } = require("../backend/database/db");
const {createWebsocketServer} = require("./websocket/websocket")

createDatabaseConnection();

createWebsocketServer()

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);


app.use("/api/user", require("./router/user.router"));
app.use("/api/movie", require("./router/movie.router"));



app.listen(8080, () => console.log(`App running on port : ${PORT}`));
