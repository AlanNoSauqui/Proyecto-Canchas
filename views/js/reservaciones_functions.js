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
            // Mostrar mensaje de exito
        }
        else{
            // Mostrar mensaje de error
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
            // Mostrar mensaje de exito
        }
        else{
            // Mostrar mensaje de error
        }
    });
}
