Dispositivos = new Mongo.Collection('dispositivos');

Dispositivos.allow({
	insert:function(userId,doc){
		return !!userId; //quien puede insertar, solo si eres user id (logeado)
	},
	update:function(userId,doc){
		return !!userId;//permitir actualizar collection
	}
});


Caracteristica = new SimpleSchema({
	nombre:{
		type:String
	},
	valor:{
		type:String
	}
});

DispositivoSchema =  new SimpleSchema({
	nombre:{
		type:String,
		label:"Nombre"
	},
	moduloID:{
		type: String,
    	label: 'Modulo',
      	autoform: {
      	firstOption: 'Seleccione modulo del dispositivo',
      		options: function () {
        		return Modulos.find().map( function ( c ) {
            													return {label: c.alias,
            															value: c._id };
            																	 }
            													);
      							},
    				}		
    			},
	tipoDispositivoID: {
      	type: String,
      	label: 'Tipo dispositivo',
      	autoform: {
      	firstOption: 'Seleccione tipo de dispositivo',
      		options: function () {
        		return TipoDispositivos.find().map( function ( c ) {
            													return {label: c.nombre,
            															value: c._id };
            																	 }
            													);
      							},
    				}
	},
	 sectorID: {
      	type: String,
      	label: 'Sector',
      	autoform: {
      	firstOption: 'Seleccione Sector',
      		options: function () {
        		return Sectores.find().map( function ( c ) {
            													return {label: c.nombre,
            															value: c._id };
            																	 }
            													);
      							},
    				}
	},
	caracteristicas:{
		type:[Caracteristica],
		optional:true

	},
	inDashboard:{
		type:Boolean,
		defaultValue:false,
		optional:true,
		autoform:{
			type:"hidden"
		}
	},
	userID:{
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

/*
 
*/
Meteor.methods({
	toggleDashboardDispositivo:function(id, currentState){
		Dispositivos.update(id,{
			$set:{
				inDashboard: !currentState
			}
		});
	},
	deleteDispositivo:function(id){
		Dispositivos.remove(id);
	},
	togglePrendeApaga:function(id,currentState){
		console.log(this);
		Dispositivos.update(id,{
			$set:{
				estado:!currentState
			}
		});
	}
});

Dispositivos.attachSchema(DispositivoSchema);