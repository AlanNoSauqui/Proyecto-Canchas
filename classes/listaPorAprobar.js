/*jshint esversion: 6 */
const e = require("express");
const queries = require("../database/commonQueries.js");


// Una peticion es el body de un post, y un usuario
let ReservacionesPendientes = function(sqlReservaciones){
    this.reservaciones = sqlReservaciones
};

let ResultadoPeticion = function(exito, message){
    this.exito= exito;
    this.message = message;
};

function getReservacionesPendientes(connection, callback){
    const query = queries.getPendientes()
    connection.query(query, (error, results, fields) => {
        if(error){
            callback( new ReservacionesPendientes([]));
        }else{
            callback(new ReservacionesPendientes(results));
        }
    });
}

function aprobarReservacion(connection, idReservacion, callback){
    new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo")
};

function rechazarReservacion(connection, idReservacion, callback){
    const query = queries.rechazarReservacion(idReservacion);
    connection.query(query, (error, results, fields) => {
        if(error){
            callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo"));
        }
        else{
            callback(new ResultadoPeticion(true, "Reservacion eliminada"));
        }
    })
};

// exports
module.exports = {getReservacionesPendientes, rechazarReservacion, aprobarReservacion};