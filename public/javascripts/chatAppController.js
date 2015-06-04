function ChatApp(params){

	var self= this;
	self.usuariosConectados=  new UsuariosConectados();
	self.usuarioLogeado= params.usuarioLogeado;
	self.usuariosConectadosVista= new UsuariosConectadosVista({model: self.usuariosConectados , usuarioLogeado: params.usuarioLogeado } );
	self.eventos= params.eventos;
	self.socket= params.socket;

	
	self.iniciar= function(){

		if(self.socket && self.eventos && self.usuarioLogeado){

			self.eventos(self);
			self.socket.emit("conectar", {"nickname": self.usuarioLogeado.get("nickname") } );
			
		}else{
			alert("No es posible iniciar la aplicación.")
		}

	}

}