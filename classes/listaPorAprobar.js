/*jshint esversion: 6 */
const queries = require("../database/commonQueries.js");


// Una peticion es el body de un post, y un usuario
let ReservacionesPendientes = function(sqlReservaciones){
    this.reservaciones = sqlReservaciones
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

// exports
module.exports = {getReservacionesPendientes};