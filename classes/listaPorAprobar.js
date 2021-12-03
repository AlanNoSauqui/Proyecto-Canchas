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
    const query = queries.getReservacionFromID(idReservacion);
    connection.query(query, (error, results, fields) => {
        if(error){
            callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo 1"));
            
        }
        else{
            if(results.length == 0){
                callback(new ResultadoPeticion(false, "La reservacion que intenta agregar no existe. Refresque la pagina e intentelo de nuevo"));
                
            }
            fechaInicio = new Date(results[0].Fecha_inicio*1000);
            fechaInicio = fechaInicio.toISOString().slice(0, 19).replace('T', ' ');
            fechaFin = new Date(results[0].fecha_Fin*1000);
            fechaFin = fechaFin.toISOString().slice(0, 19).replace('T', ' ');
            const query2 = queries.checarConflictos(fechaInicio, fechaFin, results[0].id_cancha);
            connection.query(query2, (error2, results2, fields) => {
                if(error2){
                    callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo 2"));
                }
                else if(results2[0].conflictos != 0){
                    
                    callback(new ResultadoPeticion(false, "La reservacion choca con otra reservacion ya existente"));
                }
                else{
                    const queryAceptar = queries.aceptarReservacion(idReservacion);
                    connection.query(queryAceptar, (error, results, fields) => {
                        if(error){
                            callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo 3"));
                        }
                        else{
                            callback(new ResultadoPeticion(true, "La reservacion ha sido aceptada"));
                        }
                    });
                }

            });


        }
    });
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