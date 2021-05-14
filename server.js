const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

var utenti = {};

app.get("/", function(req, res){
  res.sendFile(__dirname + "\\jamboard.html");
});

io.on("connection", function(socket){
  client(socket);
});

var client = function(socket){

  var utente;
  var id = 0;

  socket.on("imposta_utente", (nome) => {
    utente = nome;
    utenti[utente] = {"nome": utente};
    console.log("Utente " + utenti[utente].nome + " è entrato");
    console.log(utenti);
  });

  socket.on("aggiorna_linea", function(punto){
    utenti[utente].linea.linea.push(punto);
    var o = {"linea": utenti[utente].linea.linea, "utente": utente};
    io.emit("aggiorna_linea", o);
  });

  socket.on("crea_linea", (linea) => {
    linea.id = id++;
    console.log(linea);
    utenti[utente].linea = linea;
    var o = {"linea": linea.linea, "color": linea.color, "utente": utente};
    io.emit("aggiorna_linea", o);
  });


  socket.on("cambia_colore", function(colore){

  });

  socket.on("disconnect", function(){
    console.log("qualcuno si è disconnesso");
  });

}

server.listen(3000, function(){
  console.log("Il server è attivo sulla porta 3000");
});
