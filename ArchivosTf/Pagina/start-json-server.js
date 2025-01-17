const jsonServer = require('json-server'); 
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("./assets/json/usuarios.json");
const middlewares = jsonServer.defaults();

server.use(cors()); 
server.use(middlewares); 
server.use(router); 


server.listen(3000);