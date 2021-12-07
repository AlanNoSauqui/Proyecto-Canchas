// ----------------------------Variables y funciones para consultas----------------------------

// Funciones de querys
let ReservacionesCancha = function(cancha, sqlReservacion, sqlRecurrentes){
    this.cancha = cancha;
    this.reservaciones = sqlReservacion;
    this.recurrentes = sqlRecurrentes;
};

infoDate = function(date, ReservacionesCancha){
    // En caso de que no se haya "corregido" la hora de js
    const sixHourMiliseconds = 6*60*60*1000;
    // date.setTime(date.getTime() - sixHourMiliseconds);
    for (let reservacion of ReservacionesCancha.reservaciones){
        inicio = new Date(reservacion.fechaInicio*1000);
        fin = new Date(reservacion.fechaFin*1000);
        if(date.getTime() >= reservacion.fechaInicio*1000 && date.getTime() < reservacion.fechaFin*1000){
            return reservacion;
        }
    }

    for (let recurrente of ReservacionesCancha.recurrentes){
        // checar si algun dia estorba
        let day = date.getDay();
        let time = date.toLocaleTimeString('en-US', { hour12: false });
        if(day == 0 && recurrente.Domingo && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
        if(day == 1 && recurrente.Lunes && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
        if(day == 2 && recurrente.Martes && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
        if(day == 3 && recurrente.Miercoles && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
        if(day == 4 && recurrente.Jueves && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
        if(day == 5 && recurrente.Viernes && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
        if(day == 6 && recurrente.Sabado && time >= recurrente.Hora_Inicio && time < recurrente.Hora_Fin){
            return recurrente;
        }
    }
    return null;
};

// Crear objeto reservaciones
let objetoReservaciones = JSON.parse(document.currentScript.getAttribute('reservaciones'))
objetoReservaciones = new ReservacionesCancha(objetoReservaciones.cancha.Nombre, objetoReservaciones.reservaciones, objetoReservaciones.recurrentes);


const cancha = JSON.parse(document.currentScript.getAttribute('cancha'));



// ----------------------------Variables y funciones para obtener datos----------------------------

var sumaDias = 0
		
const dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

getMesNombre = function(){
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + sumaDias);
    const nombreMes = meses[tomorrow.getMonth()];
    
    return nombreMes
}

fecha = function(x){
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + sumaDias + x);

    return tomorrow
}

getDiaNombre = function(x){
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + sumaDias + x);
    const nombreDia = dias[tomorrow.getDay()];
    
    return nombreDia
}

getDia = function(x){
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + sumaDias + x);
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    
    return dd
}

// --------------------------- POST para actualizar datos ----------------------------------
function updateData(){
    fetch('/Reservaciones/' + cancha.ID, {method: 'Post', body: 
        new URLSearchParams({
            type: 'update',
        })
    }).then( (value) => {
        return value.json();
    })
    .then( (json) => {
        objetoReservaciones = new ReservacionesCancha(json.cancha.Nombre, json.reservaciones, json.recurrentes);
        recargar();
    });
}

// --------------------------- POST para mandar formulario ----------------------------------
// fechaInicio y fechaFin son fechas de javascript 
function sendData(fechaInicio, fechaFin, comentarios, valid){
    fetch('/Reservaciones/' + cancha.ID, {method: 'Post', body: 
        new URLSearchParams({
            type: 'post',
            fechaInicio: fechaInicio,
            fechaFinal: fechaFin,
            comentarios: comentarios
        })
    }).then( (value) => {
        return value.json();
    })
    .then( (json) => {
        if(json.exito){
            alert('Se ha mandado su solicitud de reservación de manera exitosa. Pronto le llegará un correo confirmando o rechazando su petición de reservación.');
        }
        else{
            alert('Se ha rechazado su solicitud de reservación, por favor verifique que no exista otra reservación en el mismo horario que usted solicitó o póngase en conctacto con el departamento de Deportes.')
        }
    });
}

// Funcion que manda a llamar a la funcion sendData y le manda las fechas y los comentarios
function obtenerVariablesFormulario(){
    let firstDateToSend;
    let lastDateToSend;
    let commentsToSend = '';

    let cadena = '';

    // Fecha
    let datePickerDate = $( "#datepicker1" ).datepicker( "getDate" );
    let actualDate0 = new Date();
    let actualDate = new Date(actualDate0.getMonth()+1  + '/' + actualDate0.getDate() + '/' +  actualDate0.getFullYear() + ' 0:00');
    let resDate;

    if(datePickerDate != null){
        let resDate = datePickerDate.getTime() - actualDate.getTime();
        if(resDate < 0){
            alert(resDate);
            cadena += "Introduzca una fecha válida (del día de hoy o posterior).\n\n"; 
        }
        else{
            // $( "#datepicker1" ).css({backgroundColor: '#ffffff'});
            dataToSend = datePickerDate;
        }
    }
    else{
        cadena += "Introduzca una fecha.\n\n";
    }

    // Horas
    let valueID1 = $("#calendarFormSelectedID1 option:selected").val();
    let valueID2 = $("#calendarFormSelectedID2 option:selected").val();
    let resHours;

    if(valueID1 != 'Elige...' && valueID2 != 'Elige...'){
        resHours = Number(valueID2)-Number(valueID1);
        if(resHours <= 0){
            cadena += "Introduzca un horario válido (mínimo de 1 hora).\n\n";
        }
        else{
            firstDateToSend = new Date(datePickerDate);
            firstDateToSend.setTime(firstDateToSend.getTime() + Number(valueID1));

            lastDateToSend = new Date(datePickerDate);
            lastDateToSend.setTime(lastDateToSend.getTime() + Number(valueID2));

            if(firstDateToSend.getTime()-actualDate0.getTime() < 0){
                cadena += "Introduzca un horario válido (Después de esta hora).\n\n";
            }
        }

    }
    else{
        cadena += "Complete los dos campos solicitados para el horario.\n\n";
    }

    if(cadena != ''){
        alert(cadena);
    }
    else{
        commentsToSend = $("#calendarFormTextAreaWriteID").val();

        sendData(firstDateToSend, lastDateToSend, commentsToSend, true);
    }
}










// ----------------------------Funcion recargar----------------------------

function recargar(){    
    // Poner la cancha
        let cancha = 'Cancha ';
        cancha += objetoReservaciones.cancha;

        document.getElementById("canchaID").innerHTML = cancha;

    // Poner el carousel
        var indiceFoto = 0;
        const fotos = [
            ['https://i.imgur.com/AuEJ9bN.jpg','https://i.imgur.com/sPdKWn1.jpg','https://i.imgur.com/tx979e8.jpg','https://i.imgur.com/4buLWTS.jpg','https://i.imgur.com/n4KE5nW.jpg'],             //Volleyball 
            ['https://i.imgur.com/4f0JQpm.jpg','https://i.imgur.com/TSUpTGB.jpg','https://i.imgur.com/KZsHR5J.jpg','https://i.imgur.com/n4GKZdF.jpg','https://i.imgur.com/c7QJWma.jpg'],             //Basketball
            ['https://i.imgur.com/bLqGU4t.jpg','https://i.imgur.com/4juw6Mw.jpg','https://i.imgur.com/LYA2QzD.jpg','https://i.imgur.com/7dQqpSm.jpg','https://i.imgur.com/GegsgMD.jpg'],             //Soccer
            ['https://i.imgur.com/wqXn6N1.jpg','https://i.imgur.com/Fjg5J34.jpg','https://i.imgur.com/F8dpbpL.jpg','https://i.imgur.com/Vvzik8R.jpg','https://i.imgur.com/4IHMq1C.jpg'],             //Tennis
            ['https://i.imgur.com/L8hHW4a.jpg','https://i.imgur.com/Jwxcy8I.jpg','https://i.imgur.com/UzTNahE.jpg','https://i.imgur.com/9miRFA3.jpg','https://i.imgur.com/5VY9GlH.jpg']              //Padel
        ]

        if(objetoReservaciones.cancha == 'Volleyball'){
            indiceFoto = 0;
        }
        else if(objetoReservaciones.cancha == 'Básquetbol'){
            indiceFoto = 1;
        }
        else if(objetoReservaciones.cancha == 'Fútbol'){
            indiceFoto = 2;
        }
        else if(objetoReservaciones.cancha == 'Tennis'){
            indiceFoto = 3;
        }
        else if(objetoReservaciones.cancha == 'Padel'){
            indiceFoto = 4;
        }

        let carousel = '';
        carousel += "<ol class='carousel-indicators'>";
        carousel += "   <li data-target='#carouselExampleIndicators' data-slide-to='0' class='active'></li>";
        carousel += "   <li data-target='#carouselExampleIndicators' data-slide-to='1'></li>";
        carousel += "   <li data-target='#carouselExampleIndicators' data-slide-to='2'></li>";
        carousel += "   <li data-target='#carouselExampleIndicators' data-slide-to='3'></li>";
        carousel += "   <li data-target='#carouselExampleIndicators' data-slide-to='4'></li>";
        carousel += "</ol>";
        carousel += "<div class='carousel-inner'>";
        carousel += "   <div class='carousel-item active'>";
        carousel += "       <img class='d-block w-100' src="+fotos[indiceFoto][0]+" alt='First slide'>";
        carousel += "   </div>";
        carousel += "   <div class='carousel-item'>";
        carousel += "       <img class='d-block w-100' src="+fotos[indiceFoto][1]+" alt='Second slide'>";
        carousel += "   </div>";
        carousel += "   <div class='carousel-item'>";
        carousel += "       <img class='d-block w-100' src="+fotos[indiceFoto][2]+" alt='Third slide'>";
        carousel += "   </div>";
        carousel += "   <div class='carousel-item'>";
        carousel += "       <img class='d-block w-100' src="+fotos[indiceFoto][3]+" alt='Fourth slide'>";
        carousel += "   </div>";
        carousel += "   <div class='carousel-item'>";
        carousel += "       <img class='d-block w-100' src="+fotos[indiceFoto][4]+" alt='Fifth slide'>";
        carousel += "   </div>";
        carousel += "</div>";
        carousel += "<a class='carousel-control-prev' href='#carouselExampleIndicators' role='button' data-slide='prev'>";
        carousel += "   <span class='carousel-control-prev-icon' aria-hidden='true'></span>";
        carousel += "   <span class='sr-only'>Previous</span>";
        carousel += "</a>";
        carousel += "<a class='carousel-control-next' href='#carouselExampleIndicators' role='button' data-slide='next'>";
        carousel += "   <span class='carousel-control-next-icon' aria-hidden='true'></span>";
        carousel += "   <span class='sr-only'>Next</span>";
        carousel += "</a>";

        document.getElementById("carouselExampleIndicators").innerHTML = carousel;

    // Poner el mes
        let newDay = fecha(0);
        let monthName = meses[newDay.getMonth()];
        for(let i=1;i<7;i++){
            newDay = fecha(i);
            if(meses[newDay.getMonth()] != monthName){
                monthName += ' / ' + meses[newDay.getMonth()];
                break;
            }

        }
        newDay = fecha(0);
        monthName += ' ' + newDay.getFullYear();

        document.getElementById("mesID").innerHTML = monthName;

    // Poner botones
        let calendarButtonFrame = '';
        if(sumaDias > 0){
            calendarButtonFrame += "<a class='calendarButton' onclick='semanaAnterior()'>";
            calendarButtonFrame += "<i class='fas fa-angle-left'></i>";
            calendarButtonFrame += "</a>";
        }
        calendarButtonFrame += "<a class='calendarButton' onclick='updateData()'>";
        calendarButtonFrame += "<i class='fas fa-redo-alt'></i>";
        calendarButtonFrame += "</a>";
        calendarButtonFrame += "<a class='calendarButton' onclick='semanaSiguiente()'>";
        calendarButtonFrame += "<i class='fas fa-angle-right'></i>";
        calendarButtonFrame += "</a>";

        document.getElementById("calendarButtonFrameID").innerHTML = calendarButtonFrame;


    // Poner DatePicker
        let datePickerVariable = '';
        datePickerVariable += "<input class='datePickerInput' type='text' placeholder='Selecciona una fecha' id='datepicker'></input>";
        datePickerVariable += "<a class='calendarButtonDatePicker' onclick='getDatePickerDate()'>";
        datePickerVariable += "<i class='fas fa-arrow-right'></i>";
        datePickerVariable += "</a>";

        document.getElementById("datePickerFrameID").innerHTML = datePickerVariable;

        // Activa el DatePicker
            $(document).ready(function () {
                $('#datepicker').datepicker({
                beforeShow: function() {
                    setTimeout(function(){
                        $('.ui-datepicker').css('z-index', 99999999999999);
                    }, 0);
                },
                inline: true,
                dateFormat: 'dd-mm-yy',
                showOtherMonths: true,
                dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                });
            });


    // Poner el encabezado del calendario
        let weekdays = '';
        for(let i=0;i<7;i++){
            weekdays += "<li style='border-right:solid; border-color: #B79257; grid-column:" + (i+1) + "; grid-column-start: " + (i+1) + "; grid-column-end: " + (i+2) + "; min-width: 0.8rem;'>";
            weekdays += "<p>" + getDiaNombre(i) + "</p>";
            weekdays += "<p>" + getDia(i) + "</p>";
            weekdays += "</li>";
        }
        document.getElementById("weekdaysID").innerHTML = weekdays;


    // Poner las horas en el calendario
        let timeslots='';
        for(let i=0;i<24;i++){
            timeslots += "<li> " + i + ":00 </li>";
        }
        document.getElementById("timeslotsID").innerHTML = timeslots;

    // Poner las reservaciones en el calendario
        let event_container = '';
        for(let i=1; i<=7; i++){
            for(let j=1; j<=24; j++){
                let fechaDia = fecha(i-1);
                let c = new Date(fechaDia.getMonth()+1  + '/' + fechaDia.getDate() + '/' +  fechaDia.getFullYear() + ' 0:00');
                let hora = (j-1)*60*60*1000;

                c.setTime(c.getTime() + hora);

                reservacionIndividual = infoDate(c, objetoReservaciones);

                if(reservacionIndividual != null){
                    event_container += "<div class='slot' style='grid-row:" +  j + "; grid-row-start: " + j + "; grid-row-end: " + (j+1) + "; grid-column:" + i + "; grid-column-start: " + i + "; grid-column-end: " + (i+1) + ";'>";
                    event_container += "<div class='event-status'>RESERVADO</div>";
                    event_container += "<span> Reservación No." + (reservacionIndividual.idReservacion ? reservacionIndividual.idReservacion :  " r" + reservacionIndividual.ID)  + "</span>"
                    event_container += "</div>";
                }
            }
        }
        
        document.getElementById("event_containerID").innerHTML = event_container;

    // Poner formulario
        let formularioFrame = "<h1 class='calendarFormTittle'>Hacer una reservación</h1>";

        formularioFrame +=  "<div class='input-group mb-3 calendarFormDatePicker mx-auto'>";
        formularioFrame +=      "<div class='input-group-prepend'>";
        formularioFrame +=          "<span class='input-group-text' id='inputGroup-sizing-default'>Fecha</span>";
        formularioFrame +=      "</div>";
        formularioFrame +=      "<input type='text' id='datepicker1' class='form-control' aria-label='Default' aria-describedby='inputGroup-sizing-default' placeholder='Elige...'>";
        formularioFrame +=  "</div>";

        formularioFrame +=  "<div class='input-group mb-3 calendarFormHoursInput mx-auto'>";
        formularioFrame +=      "<select class='custom-select' id='calendarFormSelectedID1'>";
        formularioFrame +=          "<option selected>Elige...</option>";
        for(let i=0; i<24;i++){
            formularioFrame += "<option class='calendarFormSelected' value='" + (i*60*60*1000) + "'>" + i + ":00" + "</option>";
        }
        formularioFrame +=      "</select>";
        formularioFrame +=      "<div class='input-group-append'>";
        formularioFrame +=          "<label class='input-group-text calendarFormHoursAppend' for='inputGroupSelect02'>Hora Inicio</label>";
        formularioFrame +=      "</div>";
        formularioFrame +=  "</div>";

        formularioFrame +=  "<div class='input-group mb-3 calendarFormHoursInput mx-auto'>";
        formularioFrame +=      "<select class='custom-select' id='calendarFormSelectedID2'>";
        formularioFrame +=          "<option selected>Elige...</option>";
        for(let i=0; i<24;i++){
            formularioFrame += "<option class='calendarFormSelected' value='" + (i*60*60*1000) + "'>" + i + ":00" + "</option>";
        }
        formularioFrame +=      "</select>";
        formularioFrame +=      "<div class='input-group-append'>";
        formularioFrame +=          "<label class='input-group-text calendarFormHoursAppend' for='inputGroupSelect02'>Hora Fin</label>";
        formularioFrame +=      "</div>";
        formularioFrame +=  "</div>";

        formularioFrame +=  "<h4 class='calendarFormCharactersLeft mx-auto' id='calendarFormCharactersLeftID'>0/300</h4>";
        formularioFrame +=  "<div class='input-group calendarFormTextArea mx-auto'>";
        formularioFrame +=      "<textarea class='form-control' id='calendarFormTextAreaWriteID' maxlength='300' aria-label='With textarea'  placeholder='Comentarios (opcional).'></textarea>";
        formularioFrame +=  "</div>";

        formularioFrame +=  "<div class='calendarFormButtonFrame'>";
        formularioFrame +=      "<button class='calendarFormButton' onclick='obtenerVariablesFormulario()'>Enviar</button>";
        formularioFrame +=  "</div>";

        document.getElementById("calendarFormID").innerHTML = formularioFrame;

        // Activa el DatePicker
            $(document).ready(function () {
                $('#datepicker1').datepicker({
                beforeShow: function() {
                    setTimeout(function(){
                        $('.ui-datepicker').css('z-index', 99999999999999);
                    }, 0);
                },
                inline: true,
                dateFormat: 'dd-mm-yy',
                showOtherMonths: true,
                dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                });
            });

        // Verificador visual de fecha correcta
            $(document).ready(function () {
                $("#datepicker1").mouseup(function(){
                    let datePickerDate = $( "#datepicker1" ).datepicker( "getDate" );
                    let actualDate = new Date();

                    if(datePickerDate != null){
                        let res = datePickerDate.getTime() - actualDate.getTime();
                        if(res < 0){
                            $( "#datepicker1" ).css({backgroundColor: 'red'});
                        }
                        else{
                            $( "#datepicker1" ).css({backgroundColor: '#ffffff'});
                        }
                    }
                });
            });
        
        // Verificador visual de hora correcta
            $(document).ready(function () {
                $("#calendarFormSelectedID1").mouseup(function(){
                    let valueID1 = $("#calendarFormSelectedID1 option:selected").val();
                    let valueID2 = $("#calendarFormSelectedID2 option:selected").val();
                    if(valueID1 != 'Elige...' && valueID2 != 'Elige...'){
                        var x = Number(valueID2)-Number(valueID1);
                        valueID1 = Number(valueID1);
                        valueID2 = Number(valueID2);
                        if(x <= 0){
                            if(valueID1 > valueID2){
                                $("#calendarFormSelectedID1").css({backgroundColor: 'red'});
                                $("#calendarFormSelectedID2").css({backgroundColor: 'red'});
                            }
                            else if(valueID2 < valueID1){
                                $("#calendarFormSelectedID1").css({backgroundColor: 'red'});
                                $("#calendarFormSelectedID2").css({backgroundColor: 'red'});
                            }
                            else if(valueID1 == valueID2){
                                $("#calendarFormSelectedID1").css({backgroundColor: 'red'});
                                $("#calendarFormSelectedID2").css({backgroundColor: 'red'});
                            }
                        }
                        else{
                            $("#calendarFormSelectedID1").css({backgroundColor: '#ffffff'});
                            $("#calendarFormSelectedID2").css({backgroundColor: '#ffffff'});
                        }
                    }
                });
            });

            $(document).ready(function () {
                $("#calendarFormSelectedID2").mouseup(function(){
                    let valueID1 = $("#calendarFormSelectedID1 option:selected").val();
                    let valueID2 = $("#calendarFormSelectedID2 option:selected").val();
                    if(valueID1 != 'Elige...' && valueID2 != 'Elige...'){
                        var x = Number(valueID2)-Number(valueID1);
                        valueID1 = Number(valueID1);
                        valueID2 = Number(valueID2);
                        if(x <= 0){
                            if(valueID1 > valueID2){
                                $("#calendarFormSelectedID1").css({backgroundColor: 'red'});
                                $("#calendarFormSelectedID2").css({backgroundColor: 'red'});
                            }
                            else if(valueID2 < valueID1){
                                $("#calendarFormSelectedID1").css({backgroundColor: 'red'});
                                $("#calendarFormSelectedID2").css({backgroundColor: 'red'});
                            }
                            else if(valueID1 == valueID2){
                                $("#calendarFormSelectedID1").css({backgroundColor: 'red'});
                                $("#calendarFormSelectedID2").css({backgroundColor: 'red'});
                            }
                        }
                        else{
                            $("#calendarFormSelectedID1").css({backgroundColor: '#ffffff'});
                            $("#calendarFormSelectedID2").css({backgroundColor: '#ffffff'});
                        }
                    }
                });
            });
        
        // Contador de caracteres limite
            $("#calendarFormTextAreaWriteID").keyup(function(){
                $("#calendarFormCharactersLeftID").text( $(this).val().length + '/300');
            });



    }











// ----------------------------Funciones llamadas desde el ejs----------------------------
function semanaSiguiente(){
    sumaDias = parseInt(sumaDias/7);
    sumaDias = sumaDias*7;
    sumaDias = sumaDias + 7;

    recargar();
}

function semanaAnterior(){
    sumaDias = sumaDias - 7;

    if(sumaDias < 0){
        sumaDias = 0;
        recargar();
    }

    recargar();
}

function getDatePickerDate(){
    let a = new Date();
    var b = $( "#datepicker" ).datepicker( "getDate" );
    if(b != null){
        a = new Date(a.getMonth()+1  + '/' + a.getDate() + '/' +  a.getFullYear() + ' 0:00');

        let day1 = a.getTime();
        let day2 = b.getTime();
        let res = day2-day1;

        res = res/1000
        res = res/60
        res = res/60
        res = res/24

        if(res >= 0){
            sumaDias = res;
        }
        else{
            sumaDias = 0;
        }

        recargar();

    }
}

recargar();


