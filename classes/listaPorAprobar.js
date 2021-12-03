/*jshint esversion: 6 */
const e = require("express");
const queries = require("../database/commonQueries.js");


// Una peticion es el body de un post, y un usuario
let ReservacionesPendientes = function(sqlReservaciones){
    this.reservaciones = sqlReservaciones;
};

let ResultadoPeticion = function(exito, message){
    this.exito= exito;
    this.message = message;
};

function getReservacionesPendientes(connection, callback){
    const query = queries.getPendientes();
    connection.query(query, (error, results, fields) => {
        if(error){
            callback( new ReservacionesPendientes([]));
        }else{
            callback(new ReservacionesPendientes(results));
        }
    });
}

function aprobarReservacion(connection, messager, idReservacion, callback){
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
                    connection.query(queryAceptar, (error, results3, fields) => {
                        if(error){
                            callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo 3"));
                        }
                        else{
                            const data = {
                                to: '<' + results[0].ID_Usuario +'@up.edu.mx>',
                                from: 'deportesUP@mail.canchasup.live, deportesUP@mail.canchasup.live',
                                subject: 'Update: Tu reservacion fue aceptada!',
                                text: 'Han aceptado tu peticion para usar las canchas de la UP!'
                            };
                            messager.messages().send(data, function (error, body) {
                                callback(new ResultadoPeticion(true, "La reservacion ha sido aceptada"));
                            });

                            
                        }
                    });
                }

            });


        }
    });
}

function rechazarReservacion(connection, messager, idReservacion, callback){

    const queryReservacion = queries.getReservacionFromID(idReservacion);
    connection.query(queryReservacion, (error0, results0, fields) => {
        if(error0){
            callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo"));
        }else if(results0.length == 0){
            callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo"));
        }else{
            const query = queries.rechazarReservacion(idReservacion);
            connection.query(query, (error, results, fields) => {
                if(error){
                    callback(new ResultadoPeticion(false, "Hubo un error. Refresque la pagina e intentelo de nuevo"));
                }
                else{
                    const data = {
                        to: '<' + results0[0].ID_Usuario +'@up.edu.mx>',
                        from: 'deportesUP@mail.canchasup.live, deportesUP@mail.canchasup.live',
                        subject: 'Update: Tu reservacion fue rechazada',
                        text: 'Han rechazado tu peticion para usar las canchas de la UP. Ponte en contacto con el departamento de Deportes para mas informacion'
                    };
                    messager.messages().send(data, function (error, body) {
                        callback(new ResultadoPeticion(true, "La reservacion ha sido eliminada"));
                    });
                }
            });
        }
    });
}

// exports
module.exports = {getReservacionesPendientes, rechazarReservacion, aprobarReservacion};