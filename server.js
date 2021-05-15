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

  var utente;

  socket.on("imposta_utente", (nome) => {
    utente = nome;
    utenti[utente] = {};
    console.log("Utente " + utente + " è entrato");    
  });

  socket.on("aggiorna_linea", function(punto){
    var id = Object.keys(utenti[utente]).length - 1;
    //console.log("Linea continuata con id: " + id);
    utenti[utente][id].punti.push({ "x": punto.x, "y": punto.y });
    console.log("Utente " + utente + " ha le seguente linee:");
    console.log(utenti[utente]);
    var o = { "punto": punto, "ultimo_punto": utenti[utente][id].punto, "utente": utente };
    io.emit("aggiungi_punto", o);
  });

  socket.on("crea_linea", (punto) => {
    var id = Object.keys(utenti[utente]).length;
    console.log("Linea creata con id: " + id);
    var linea = { "punti": [{"x": punto.x, "y": punto.y }], "color": punto.col };
    utenti[utente][id] = linea;
    var o = {"punto": punto, "ultimo_punto": { "x": punto.x, "y": punto.y }, "utente": utente };
    io.emit("aggiungi_punto", o);
  });

  //socket.on("cambia_colore", function(colore){});

  socket.on("disconnect", function(){
    console.log("qualcuno si è disconnesso");
  });
});
server.listen(3000, function(){
  console.log("Il server è attivo sulla porta 3000");
});
