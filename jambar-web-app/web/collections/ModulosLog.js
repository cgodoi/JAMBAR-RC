ModuloLogs = new Mongo.Collection('moduloLogs');

ModuloLogs.allow({
	insert:function(userId,doc){
		return !!userId; //quien puede insertar, solo si eres user id (logeado)
	},
	update:function(userId,doc){
		return !!userId;//permitir actualizar collection
	}
});


ModuloLogSchema =  new SimpleSchema({
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
	deleteModuloLog:function(id){
		ModuloLogs.remove(id);
	},
	insertaModuloLog:function(pOrigen, pModulo, pValor,pMensaje, pEjecutado){

		ModuloLogs.insert({origen:pOrigen
						   ,fechaOrigen: new Date()
							, moduloID:pModulo
							, valor:pValor
							, mensaje:pMensaje
							, ejecutado:pEjecutado });
	}
});

ModuloLogs.attachSchema(ModuloLogSchema);