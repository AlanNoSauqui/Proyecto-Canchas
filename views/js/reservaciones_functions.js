// Aprobar reservacion
function aprobarReservacion(idReservacion){
    fetch('/ReservacionesPendientes/' , {method: 'Post', body: 
        new URLSearchParams({
            type: 'aprobar',
            idReservacion: idReservacion
        })
    }).then( (value) => {
        return value.json();
    })
    .then( (json) => {
        if(json.exito){
            alert('Se ha aprobado esta reservación de manera exitosa.');
        }
        else{
            alert('Error al aprobar.');
        }
    });
}

function rechazarReservacion(idReservacion){
    fetch('/ReservacionesPendientes/' , {method: 'Post', body: 
        new URLSearchParams({
            type: 'rechazar',
            idReservacion: idReservacion
        })
    }).then( (value) => {
        return value.json();
    })
    .then( (json) => {
        if(json.exito){
            alert('Se ha rechazado esta reservación de manera exitosa.');
        }
        else{
            alert('Error al rechazar.');
        }
    });
}
