var express = require('express');
var router = express.Router();


function getMac(ip,callback){
  if(ip!="::1" && ip != "127.0.0.1" && ip != "localhost" ){
    macClient.getMAC(ip,function(err,mac){
      if(!err){
        callback(mac);
      }
    })
  }else{

    macServer.getMac(function(err,mac){
      if (err)  throw err;
      if(mac)
        callback(mac);
      
    })
  }
}
function getIpByRequest(req){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if( ip.indexOf("::ffff:")> -1){
        ip=ip.replace("::ffff:","");
    }
    return ip;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Bienvenido' });
});


router.post('/', function(req, res, next) {

		var ip= getIpByRequest(req);

		getMac(ip, function(mac){

	  		var datosUsuario= {
	  			"nickname": req.body.nickname,
                "socket": null, 
                "ip":  ip,
                "mac": mac,
                "fotoUrl": null, 
            }    
			var disponible= chatapp.verificarUsuarioDisponible(datosUsuario);
			if(disponible){
				
				chatapp.agregarUsuario(datosUsuario);

				res.render('index', 
					{ 
						title: 'Bienvenido a nuestras salas de chat', 
						datosUsuario: {
							"nickname": datosUsuario.nickname,
							"fotoUrl": datosUsuario.fotoUrl, 
						} 
					}
				);

			}else{
				console.log("Error Login");
				res.render("login", 
					{
						title: 'Bienvenido a nuestras salas de chat', 
						"errores": "Este nickname ya está en uso o es vacío"
					} 
				);
			}
			


		});


	// var disponible= usuariosConectados[ req.body.nickname ] == null;

	// if( disponible ){

	// 	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	// 	usuariosConectados[ req.body.nickname ] = {
	// 												"socket": null, 
	// 												"ip":  ip, "salas": null,
	// 												"fotoUrl": null 
	// 											  }

	// 	res.render(
	// 		'index', 
	// 		{ 
	// 			title: 'Bienvenido a nuestras salas de chat', 
	// 			datosUsuario: {
	// 				"nickname": req.body.nickname,
	// 				"fotoUrl": null 
	// 			} 
	// 		}
	// 	);

	// }else{

	// 	res.render("login", {"errores": "Este nickname ya está en uso"} );
	// }

});

router.get('/inicio', function(req, res, next) {
  res.render('index', { title: 'Bienvenido a nuestras salas de chat' });
});
router.get('/test', function(req, res, next) {
	
  res.render('test', { title: 'Bienvenido a nuestras salas de chat' });
});

module.exports = router;
