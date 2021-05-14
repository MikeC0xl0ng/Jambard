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

  socket.on("imposta_utente", function(nome){
    utente = nome;
    utenti[utente] = [];
    console.log("Utente " + nome + " è entrato");
  });

  socket.on("aggiorna_linea", function(linea){
    // sostituisci la linea (se non è una nuova)
    // oggetto composto da line e il sui id
    utenti[utente].push(linea);
    var o = {"linea": linea, "utente": utente};
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
