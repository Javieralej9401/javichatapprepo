var Usuario = Backbone.Model.extend({

  	defaults: {
        nickname: null,
        fotoUrl: null,
        conversaciones: {}, //json de nicks
    },
});

var UsuariosConectados= Backbone.Collection.extend({
		model:Usuario,
})
