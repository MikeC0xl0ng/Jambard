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

  // socket.on("aggiorna_linea", function(punto){
  //   var id = Object.keys(utenti[utente]).length - 1;
  //   //console.log("Linea continuata con id: " + id);
  //   utenti[utente][id].punti.push({ "x": punto.x, "y": punto.y });
  //   console.log("Utente " + utente + " ha le seguente linee:");
  //   console.log(utenti[utente]);
  //   console.log(utenti[utente][id].punto);
  //   var o = { "punto": punto, "ultimo_punto": utenti[utente][id].punto, "utente": utente };
  //   // manda punto e il suo id
  //   io.emit("aggiungi_punto", o);
  // });

  // socket.on("crea_linea", (punto) => {
  //   var id = Object.keys(utenti[utente]).length;
  //   console.log("Linea creata con id: " + id);
  //   var linea = { "punti": [{"x": punto.x, "y": punto.y }], "color": punto.col };
  //   utenti[utente][id] = linea;
  //   // guarda è stata aggiunta una linea
  //   var o = {"punto": punto, "ultimo_punto": { "x": punto.x, "y": punto.y }, "utente": utente };
  //   io.emit("aggiungi_punto", o);
  //   io.emit("crea_nuova_linea", linea);
  // });

  socket.on("aggiungi_punto", (punto) => {
    if(socket.currentLine == undefined){
      socket.currentLine = { "id": nextID, "linea": [], "colore": punto.color };
      nextID = nextID + 1;
    }
    aggiungiPuntoAllaLinea(punto, socket.currentLine.linea);
  });

  socket.on("linea_terminata", () => {
    socket.currentLine = undefined;
  });

  function aggiungiPuntoAllaLinea(punto, linea){
    linea.push(punto);
    if(linea.length > 2){
      var punti = { "punto": linea[linea.length-1], "punto_vecchio": linea[linea.length-2] };
    }
    else{
      var punti = { "punto": linea[linea.length-1], "punto_vecchio": linea[linea.length-1]+2 };
    }
    io.emit("aggiungi_punto", punti);
  }

  // clickdown - evento
  // mouse up - linea terminata
  // il server quando riceve una linea nuova la crea e dà un id e comunica (sempre) la stessa cosa: nuovo punto di questo utente e questa linea
  // il cliente si chiede "Ce l'ho?" il push / creano la linea

  //socket.on("cambia_colore", function(colore){});

  socket.on("disconnect", function(){
    console.log("qualcuno si è disconnesso");
  });
});
server.listen(3000, function(){
  console.log("Il server è attivo sulla porta 3000");
});
