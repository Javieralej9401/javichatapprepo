$.fn.renderTemplate = function(template, data,op) {
          var compiled = {};
          if (template instanceof jQuery) {
            template = $(template).html();
          }
 
          compiled[template] = Handlebars.compile(template);
          if(op==0){
          	this.html(compiled[template](data));
          }else{
          	this.append(compiled[template](data));
          }
};
var UsuarioVista= Backbone.View.extend({
  	 tagName: 'li',
  	 initialize:function(){
  	 	this.render();
  	 },
  	 render: function(){

  	 	 $(this.el).renderTemplate($("#usuarioListProto"), {nick:  this.model.get("nickname")});
        $(this.el).find(".users-list-name").html(this.model.get("nickname") );
  	 }
  })
var UsuariosConectadosVista= Backbone.View.extend({
		 el: '#usuariosOnlineContainer',
		 usuarioLogeado: null ,
  	 initialize:function(params){

  	 	this.usuarioLogeado= params.usuarioLogeado;
  	 	
  	 	this.render();
	    this.listenTo(this.model, 'reset', this.render);
	    this.listenTo(this.model, 'remove', this.render);
	    this.listenTo(this.model, 'add', this.render);

	    
  	 },
  	 events: {
            "click .userItem ": "AbrirConversacion",
            "click .enviarMsjBtn ": "nuevoMensajeA",
            "keydown .msjInput":  "keydownF", 
     },
  	 render: function(){
  	 	var usuariosCollection =this.model.models;
  	 	$(this.el).find(".users-list").empty();
  	 	if(usuariosCollection.length>0){

  	 		$(this.el).find(".cantusuariosCon")
  	 				  .html(usuariosCollection.length +" usuarios")
  	 		var listaUsuarios= $(this.el).find(".users-list");

	  	 	this.model.each(function(m,indice) {
	  	 		
	
            var usuarioVista;
	  	 			//if(m.get("nickname")!= this.usuarioLogeado.get("nickname") ){
	  	 				
                usuarioVista= new UsuarioVista({model:m} );

            //}
	  	 			listaUsuarios.append(usuarioVista.el);
	  	 	},this);

  	 	}

  	 		return this;
         
  	 },
  	 AbrirConversacion: function(ev){
  	
  	 	var targetNickname=  $(ev.currentTarget)
  	 						 .find(".users-list-name").text();

  	 	if(targetNickname==""){
  	 		return;
  	 	}
      if(targetNickname ==  this.usuarioLogeado.get("nickname")){
          return;
      }
    var inputMsj =   $(this.el).find(".msjInput");
    var inputMsjW =  $(this.el).find(".inputMsjW");

    $(".users-list ").find(".chattingMark").fadeOut("fast");
    $(ev.currentTarget)
                 .find(".chattingMark").fadeIn();
    

    if(inputMsjW.hasClass("hiddenc")){

       inputMsjW.removeClass("hiddenc");
       inputMsjW.show();
       
    }
  
 		$(this.el).find(".direct-chat")
 				  .attr("data-usuario-activo", targetNickname );

 		$(this.el).find(".direct-chat .NickConvPrivate")
 				  .html("Privado a "+ targetNickname);

 		var mensajesContainer= $(this.el).
 							   find(".direct-chat .direct-chat-messages");
 		mensajesContainer.empty();

 		var mensajesPSession = sessionStorage.getItem("mensajesPrivados");

 		if(!mensajesPSession){
 			return;
 		}
			//Se convierte el string de la sesion a json.
			var MensajesPJSON= JSON.parse(mensajesPSession);

			if( MensajesPJSON[targetNickname]  ){
					
			var mensajesConUsuario= MensajesPJSON[targetNickname].mensajes;
			var NickUsuarioLogueado=  this.usuarioLogeado.get("nickname");

			for (var i = 0; i < mensajesConUsuario.length; i++) {

			var params={ nick: null, msj: mensajesConUsuario[i].mensaje }; 
			var plantilla="";

				if( mensajesConUsuario[i].nickname == NickUsuarioLogueado ){

					params.nick= "tú";
					plantilla=$('#mensajePrinci');

				}else{

					params.nick=mensajesConUsuario[i].nickname;
					plantilla=$('#mensajeSecond');
				}
				mensajesContainer.renderTemplate(plantilla, params,1);
				
			};
			}

  	 	$(ev.currentTarget).removeClass("nuevoMsjAlerta")


  	 },
  	 keydownF: function(ev){
  	 	
	 		var code = ev.keyCode || ev.which;
	 		if(code!=13){
	 			
	 			return;
	 		}else{
	 			ev.preventDefault();
	 			this.nuevoMensajeA();
	 		}
  	 },
  	 nuevoMensajeA: function(){

  	 	nicknameMsjTo= $(this.el).find(".direct-chat").
  	 							 attr("data-usuario-activo");

  	 	mensaje= $(this.el).find(".direct-chat .msjInput").val();

  	 	$(this.el).find(".direct-chat .msjInput").val("");
  	 	

  	 	if(mensaje==""){
  	 		return;
  	 	}

	 		$(".direct-chat-messages").renderTemplate(
	  	 							$('#mensajePrinci'), 
	  	 							{ nick: "Tú" , msj: mensaje },
	  	 							1
	 							      );
	 		socket.emit("nuevoMensajeA", {
	 										"nickname": nicknameMsjTo, 
	 										"mensaje": mensaje  
	 									  } 
	 					);


	 		var data={
  	 				nickname: nicknameMsjTo, 
  	 				me: this.usuarioLogeado.get("nickname") , 
  	 				mensaje: mensaje 
  	 			 };

  	 	GuardarMsjEnSesion(data);

  	 }
});
