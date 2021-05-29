const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
var port = process.env.PORT || 8080;

var utenti = {};
var nextID = 0; 

let options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["htm", "html"],
  index: false,
  setHeaders: function(res, path, stat){
    res.set("x-timestap", Date.now());
  }
};

app.use(express.static("public", options));     // serving the public folder

app.get("/", function(req, res){
  res.sendFile(__dirname + "//jamboard.html");
});

io.on("connection", function(socket){

  var utente;
  socket.currentLine = undefined;
  var draw = true;

  socket.on("imposta_utente", (nome) => {
    utente = nome;
    utenti[utente] = { "draw": draw };
    console.log("Utente " + utente + " è entrato");    
  });

  socket.on("draw_status", (draw_status) => {
    draw = draw_status;
    utenti[utente].draw = draw;    
  });

  socket.on("aggiungi_punto", (punto) => {
      if(socket.currentLine == undefined){
        socket.currentLine = { "id": nextID, "linea": [], "colore": punto.color, "line_width": punto.line_width };
        nextID = nextID + 1;
      }
      aggiungiPuntoAllaLinea(punto, socket.currentLine.linea);
  });

  socket.on("linea_terminata", () => {
    socket.currentLine = undefined;
  });

  socket.on("clear", () => {
    io.emit("clear");
    socket.currentLine.linea = [];
  });

  function aggiungiPuntoAllaLinea(punto, linea){
    linea.push(punto);
    if(linea.length > 2){
      var punti = { "punto": linea[linea.length-1], "punto_vecchio": linea[linea.length-2], "draw_status": draw, "line_width": punto.line_width };
    }
    else{
      var punti = { "punto": linea[linea.length-1], "punto_vecchio": linea[linea.length-1]+2, "draw_status": draw, "line_width": punto.line_width };
    }
    io.emit("aggiungi_punto", punti);
  }

  socket.on("disconnect", function(){
    console.log("qualcuno si è disconnesso");
  });
});
server.listen(port, function(){
  console.log("Il server è attivo sulla porta 3000");
});
