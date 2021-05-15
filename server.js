const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

var utenti = {};
var nextID = 0; 

app.get("/", function(req, res){
  res.sendFile(__dirname + "\\jamboard.html");
});

io.on("connection", function(socket){

  var utente;
  socket.currentLine = undefined;

  socket.on("imposta_utente", (nome) => {
    utente = nome;
    utenti[utente] = {};
    console.log("Utente " + utente + " è entrato");    
  });

  socket.on("aggiungi_punto", (punto) => {
    if(socket.currentLine == undefined){
      socket.currentLine = { "id": nextID, "linea": [], "colore": punto.color };
      nextID = nextID + 1;
    }
    aggiungiPuntoAllaLinea(punto, socket.currentLine.linea);
  });

  socket.on("linea_terminata", (punto) => {
    aggiungiPuntoAllaLinea(punto, socket.currentLine.linea);
    socket.currentLine = undefined;
  });

  function aggiungiPuntoAllaLinea(punto, linea){
    linea.push(punto);
    io.emit("aggiungi_punto", linea[linea.length-1]);
    console.log(linea[linea.length-1]);
  }

  //socket.on("cambia_colore", function(colore){});

  socket.on("disconnect", function(){
    console.log("qualcuno si è disconnesso");
  });
});
server.listen(3000, function(){
  console.log("Il server è attivo sulla porta 3000");
});
