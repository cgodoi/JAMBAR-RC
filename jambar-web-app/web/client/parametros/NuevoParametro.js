Template.NuevoSector.events({
	'click .fa-close' : function(){
		Session.set('nuevoSector',false)
	}
});

Template.NuevoTipoDispositivo.events({
	'click .fa-close' : function(){
		Session.set('nuevoTipoDispositivo',false)
	}
});

Template.NuevoModulo.events({
	'click .fa-close' : function(){
		$("#newRecipeContainerNuevoSector").parent().removeClass( "zoomIn animated webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend" ).addClass( "zoomOut animated webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend" );
		Session.set('nuevoModulo',false);
	}
});