//Meteor.subscribe('dispositivos');

Template.Parametros.onCreated(function(){
	var self = this;
	self.autorun(function(){
		self.subscribe('sectores');
		self.subscribe('tipoDispositivos');
		self.subscribe('modulos');
		self.subscribe('programacion');
	});

		

});

Template.Parametros.onRendered(function () {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
		var anchors=[];
	$('.sectionParams').each( function() {
            var tmp_instance = $( this ).waypoint({
                handler: function(direction) {
                    $( this ).toggleClass("fadeIn");                        
                }
            });
            anchors.push( tmp_instance );
	});
 
    }
  });
});

Template.Parametros.helpers({
	sectores:()=> {
		return Sectores.find();
	},
	tipoDispositivos:()=> {
		return TipoDispositivos.find();
	},
	modulos:()=> {
		return Modulos.find();
	},
	programacion:()=> {
		return Programacion.find();
	}
});

Template.Parametros.events({
	
'click #btnNuevoSector':()=>{
	Session.set('nuevoSector', true);
},
'click #btnNuevoProgramacion':()=>{
	Session.set('nuevoProgramacion', true);
},
'click #btnNuevoTipoDispositivo':()=>{
	Session.set('nuevoTipoDispositivo', true);
}
,
'click #btnNuevoModulo':()=>{
	Session.set('nuevoModulo', true);
}
,
'click #btnEscanearModulos':()=>{
	Session.set('Cargando', true);
	console.log("consultando estado de modulos...");
	Meteor.call('EscanearModulos', function (err, response) {
	  console.log(response);
	    Session.set('Cargando', false);
	});
}

});


