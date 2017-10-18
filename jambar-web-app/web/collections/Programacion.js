Programacion = new Mongo.Collection('programacion');

Programacion.allow({
	insert:function(userId,doc){
		return !!userId; //quien puede insertar, solo si eres user id (logeado)
	},
	update:function(userId,doc){
		return !!userId;//permitir actualizar collection
	}
});


ProgramacionSchema =  new SimpleSchema({
    nombre:{
		type:String,
		label:"Nombre"
    },
    estado:{
		type:Boolean,
		label:"Estado"
    },
    dispositivoId:{
		type: String,
    	label: 'Dispositivo',
      	autoform: {
      	firstOption: 'Seleccione un dispositivo',
      		options: function () {
        		return Dispositivos.find().map( function ( c ) {
            													return {label: c.nombre,
            															value: c._id };
            																	 }
            													);
      							},
    				}		
    },
    usuario:{
		type:String,
		label:"Creado por",
		autoValue:function(){
			return this.userId
		},
		autoform:{
			type:"hidden"
		}
	},
	fechaCreacion:{
		type:Date,
		label:"Fecha de creacion",
		autoValue: function(){
			return new Date()
		},
		autoform:{
			type:"hidden"
		}
	}
});

Meteor.methods({
	deleteProgramacion:function(id){
		Programacion.remove(id);
	},
	insertaProgramacion:function(pNombre, pEstado, pDispositivoId){

		Programacion.insert({nombre:pNombre
						   ,estado: pEstado
							, dispositivoId:pDispositivoId});
	}
});

Programacion.attachSchema(ProgramacionSchema);