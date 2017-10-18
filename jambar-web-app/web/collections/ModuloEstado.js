ModuloEstado = new Mongo.Collection('moduloEstado');

ModuloEstado.allow({
	insert:function(userId,doc){
		return !!userId; //quien puede insertar, solo si eres user id (logeado)
	},
	update:function(userId,doc){
		return !!userId;//permitir actualizar collection
	}
});


ModuloEstadoSchema =  new SimpleSchema({
	origen:{
		type:String,
		label:"Origen"
	},
	fechaOrigen:{
		type:Date,
		label:"Created At"
	},	
	moduloID:{
		type:String,
		label:"IdModulo"
	},
	valor:{
		type:String,
		label:"Valor"
	},
	ejecutado:{
		type:String,
		label:"ejecutado"	
	},
	mensaje:{
		type:String,
		label:"mensaje"	
	},
	fechaEjecuta:{
		type:Date,
		autoValue: function(){
			return new Date()
		}
		}	
});

Meteor.methods({
	deleteModuloEstado:function(id){
		ModuloEstado.remove(id);
	},
	insertaModuloEstado:function(pOrigen, pModulo, pValor,pMensaje, pEjecutado){

		ModuloEstado.insert({origen:pOrigen
						   ,fechaOrigen: new Date()
							, moduloID:pModulo
							, valor:pValor
							, mensaje:pMensaje
							, ejecutado:pEjecutado });
	}
});

ModuloEstado.attachSchema(ModuloEstadoSchema);