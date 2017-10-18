 Meteor.publish('modulos',function(){
	//return Recipes.find({author:this.userId}) ;//solo las recipes del autor
	return Modulos.find() ;//solo las recipes del autor
 });


 Meteor.publish('tipoDispositivos',function(){
	//return Recipes.find({author:this.userId}) ;//solo las recipes del autor
	return TipoDispositivos.find() ;//solo las recipes del autor
 });

 Meteor.publish('sectores',function(){
	//return Recipes.find({author:this.userId}) ;//solo las recipes del autor
	return Sectores.find() ;//solo las recipes del autor
 });
 Meteor.publish('recipes',function(){
	//return Recipes.find({author:this.userId}) ;//solo las recipes del autor
	return Recipes.find() ;//solo las recipes del autor
 });
 Meteor.publish('dispositivos',function(){
	//return Dispositivos.find({author:this.userId}) ;//solo las recipes del autor
	return Dispositivos.find() ;//solo las recipes del autor
 });

  Meteor.publish('SingleRecipe',function(id){
	//return Recipes.find({author:this.userId}) ;//solo las recipes del autor
	check(id, String);
	return Recipes.find({_id:id}) ;//solo las recipes del autor
 });

 Meteor.publish('SingleDispositivo',function(id){
	//return Recipes.find({author:this.userId}) ;//solo las recipes del autor
	check(id, String);
	return Dispositivos.find({_id:id}) ;//solo las recipes del autor
 });

  Meteor.publish('moduloEstado',function(id){
	return ModuloEstado.find() ;
 });


  Meteor.publish('moduloLogs',function(id){
	//return  ModuloLogs.find({ultimo:'S'});
	return  ModuloLogs.find();
 });

   Meteor.publish('moduloLogs50',function(id){
	//return  ModuloLogs.find({ultimo:'S'});
	return  ModuloLogs.find({}, {
      				sort: { fechaOrigen: -1 }, limit:50
    				});
 });

 Meteor.publish('programacion',function(id){
	//return  ModuloLogs.find({ultimo:'S'});
	return  Programacion.find();
 });