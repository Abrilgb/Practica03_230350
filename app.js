const express = require('express');
const session = require('express-session');
const moment = require("moment-timezone");



const app = express();


//Configuración de la sesión
app.use(session({
    secret: 'p3-AGB#-yinyerina-sesionespersistentes', //Secreto para firmar la cookie de sesión
    resave:false,  //No resguardar la sesión si no ha sido modificada
    saveUninitialized:false,  //Guardar la sesión aunque no haya sido inicializada
    cookie:{secure:false, maxAge: 24 * 60 * 60 * 40}  //Usar secure:true solo si usas HTTPS, maxage para la duracin
    
}));

//Midelware para mostrar detalles de la sesion
app.use((req,res, next)=>{
    if(req.session){
        if(!req.session.createdAt){
            req.session.createdAt=new Date(); //Asignamos la fecha de la creación de la sesión
        }
        req.session.lastAccess=new Date(); //Asignamos la última vez que se accedió a la sesión
    }
    next();
});


app.get('/login/:User',(req,res)=>{
    if(req.session.createdAt){
        req.session.User=req.params.User;
        req.session.createdAt=new Date();
        req.session.lastAccess=new Date();
        res.send("La sesion ha sido iniciada");
    }else{
        res.send("la sesion ya existe ")
    }
    
})

app.get('/update',(req,res)=>{
    if(req.session.createdAt){
        req.session.lastAccess=new Date();
        res.send("La fecha de ultimo acceso ha sido actualizada");
    }else{
        res.send("no hay una sesion activa ")
    }
    
})


//Ruta para mostrar la información de la sesión
app.get('/session',(req,res)=>{
    if(req.session.createdAt){
        const now= new Date();
        const started  = new Date(req.session.createdAt);
        const lastUpdate = new Date(req.session.lastAccess);

        //calcular la antuguedad de la sesion 

        const sessionAgeMs = now - started;
        const hours = Math.floor(sessionAgeMs/(1000*60*60));
        const minutes = Math.floor((sessionAgeMs % (1000*60*60)/(1000*60*60)));
        const secons = Math.floor((sessionAgeMs % (1000*60))/1000);

        //convertir las fechas si alnuso del horario de CDMX 
        const createdAt_CDMX=moment(started).tz('America/Mexico_City').format('YYYY/MM/DD HH:mm:ss');
        const lastdAccess_CDMX=moment(started).tz('America/Mexico_City').format('YYYY/MM/DD HH:mm:ss');
        
        res.json({
            message:'Estado de lasesion',
            user:req.session.User,
            sessionid:req.sessionID,
            inicio: createdAt_CDMX, 
            ultimoAcceso: lastdAccess_CDMX,
            antiguedad: `${hours} horas, ${minutes} y ${secons}segundos`
        })
    }else{
        res.send('No hay una sesion activa')
    }
})

//Ruta para cerrar la sesión
app.get('/logout',(req,res)=>{
    if(req.session.createdAt){
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send('Error al cerrar sesion.');
            }
            res.send('<h1>Sesión cerrada exitosamente.</h1>');
        });
    }else{
        res                                                                                                                                                                     .send('No hay una sesin activa para cerrar')
    }
    
});

//Iniciar el servidor en el puerto 3000
app.listen(3000,()=>{
    console.log('Servidor corriendo en el puerto 3000');
});