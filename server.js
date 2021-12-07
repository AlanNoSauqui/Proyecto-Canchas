/*jshint esversion: 6 */ 
// -----------------------SQL -----------------------
const dbUtils = require("./database/connection.js");
const  dbConnection = dbUtils.createConnection();

// -----------------------Passport -----------------------
const passport = require('passport');
const passportFactory = require("./database/passportFactory.js");
const session = require("express-session");
passportFactory.setupPassport(passport, dbConnection);

// ----------------------Mailgun---------------------------
const mailgun = require('./database/mailgunFactory.js');
const messager = mailgun.getTransporter();

// -----------------------Express-----------------------
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


// Set Express sessions with passport
app.use(express.static("public"));
app.use(session(
  { secret: "cats",
    resave: true,
    saveUninitialized: true,  
  }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
  
// Set EJS as templating engine 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use('/', express.static(__dirname));
  
// ----------------------Prototypes-----------------------------
const UserClass = require("./classes/user.js");
const ErrorMessages = require("./classes/errorMessages.js");
const CanchasClass = require("./classes/cancha.js");
const ReservacionesClass = require("./classes/reservacion.js");
const PeticionesClass = require("./classes/peticionReservacion.js");
const ReservacionesPendientes = require("./classes/listaPorAprobar.js");

// -----------------------Functions-----------------------

app.get('/', (req, res) => {
    res.redirect('/Inicio');
});

// Pagina de prueba con todos los links
app.get('/Links', (req, res) => {
    res.render('pages/links', { pageType: "Inicio", userInfo: new UserClass.User(req.user) });
});

// Error permisos no sufucientes
app.get('/OnlyAdmin', (req, res) => {
    res.render('pages/error', { pageType: "Inicio", userInfo: new UserClass.User(req.user), error: new ErrorMessages.ErrorNotAuthorized() });
});

//Log in Fallido
app.get('/FailedLogin', (req, res) => {
    res.render('pages/error', { pageType: "Inicio", userInfo: new UserClass.User(req.user), error: new ErrorMessages.ErrorFailedLogin() });
});

// Home
app.get('/Inicio', (req, res) => {
    res.render('pages/home', { pageType: "Inicio", userInfo: new UserClass.User(req.user) });
});

// Reservaciones
app.get('/Reservaciones', (req, res) => {
    if(req.user){ 
        res.redirect('/Reservaciones/1');
    }
    else{
        req.session.redirectTo = '/Reservaciones';
        res.redirect('/IniciarSesion');
    } 
});

// Paginas de Reservaciones Individuales por cancha
app.get('/Reservaciones/:idCancha', (req, res) =>{
    if(req.user){
        //usuario loggeado
        CanchasClass.getCanchaFromID(req.params.idCancha, dbConnection, (cancha) => {
            if(cancha == null){
                res.render('pages/error', { pageType: "Inicio", userInfo: new UserClass.User(req.user), error: new ErrorMessages.ErrorPageMissing() });
            }else{
                // Aqui renderizar pagina de reservacion de la cancha
                ReservacionesClass.getReservacionesOfCancha(cancha, dbConnection, (cancha, reservacionesCancha) => {

                    res.render('pages/calendar', { 
                        pageType: "Reservaciones", userInfo: new UserClass.User(req.user), cancha: cancha, reservaciones: reservacionesCancha
                    });
                });
            }
        });
    }
    else{
        req.session.redirectTo = '/Reservaciones/' + req.params.idCancha;
        res.redirect('/IniciarSesion');
    }  
});

app.post('/Reservaciones/:idCancha', (req, res) =>{
    if(req.user){
        //usuario loggeado
        CanchasClass.getCanchaFromID(req.params.idCancha, dbConnection, (cancha) => {
            if(cancha == null){
                res.send(null);
            }else{
                // Aqui renderizar pagina de reservacion de la cancha
                if(req.body.type == 'update'){
                ReservacionesClass.getReservacionesOfCancha(cancha, dbConnection, (cancha, reservacionesCancha) => {
                    res.send( reservacionesCancha );
                });
                }
                else if(req.body.type == 'post'){
                    peticion = new PeticionesClass.PeticionReservacion(req.user, cancha, req.body);
                    peticion.resolverPeticion(dbConnection, (resultado) =>  {
                        res.send(resultado);
                    });
                
                }else{
                    res.send(null);
                }
            }
        });
    }
    else{
        res.send(null);
    }  
});

// Reservaciones Pendientes
app.get('/ReservacionesPendientes', (req, res) => {
    if(req.user){ 
        if(req.user.Es_Admin){
            ReservacionesPendientes.getReservacionesPendientes(dbConnection, (listaReservaciones) =>{
                console.log(listaReservaciones);
                res.render('pages/reservationsPendientes', { pageType: "ReservacionesPendientes", listReservations: listaReservaciones , userInfo: new UserClass.User(req.user) });
            });
        }
        else{
            res.redirect("/OnlyAdmin");
        }
    }
    else{
        req.session.redirectTo = '/ReservacionesPendientes';
        res.redirect('/IniciarSesion');
    } 
});

// Aprobar Rechazar Reservaciones
app.post('/ReservacionesPendientes', (req, res) => {
    if(req.user){ 
        if(req.user.Es_Admin){
            if(req.body.type == 'aprobar'){
                ReservacionesPendientes.aprobarReservacion(dbConnection, messager,  req.body.idReservacion, (result) => {
                    res.send(result);
                });
            }
            else if(req.body.type == 'rechazar'){
                ReservacionesPendientes.rechazarReservacion(dbConnection, messager, req.body.idReservacion, (result) => {
                    res.send(result);
                });
            }else{
                res.send(null);
            }
        }else{
            res.send(null);
        }
    }else{
        res.send(null);
    }
});

// Login
app.get('/IniciarSesion', (req, res) => {
    res.redirect('/auth/google');
});

//Logout
app.get('/CerrarSesion', (req, res) =>{
    req.logout();
    res.redirect('/Inicio');
});

// How to reserve
app.get('/ComoReservar', (req, res) => {
    res.render('pages/howToReserve', { pageType: "ComoReservar", userInfo: new UserClass.User(req.user) });
});

// More info
app.get('/MasInfo', (req, res) => {
    res.render('pages/moreInfo', { pageType: "MasInformacion", userInfo: new UserClass.User(req.user) });
});
  
// Google Auth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/FailedLogin' }),
  function(req, res) {
    const redirect = req.session.redirectTo || '/Inicio';
    delete req.session.redirectTo;
    res.redirect(redirect);
  });

// Server setup
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
