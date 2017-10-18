//control router login usuario
if(Meteor.isClient){
	Accounts.onLogin(function(){
		FlowRouter.go('dash');
	});

	Accounts.onLogout(function(){
		FlowRouter.go('home');
	});
}

FlowRouter.triggers.enter([function(context,redirect){
if(!Meteor.userId()){
	FlowRouter.go('home'); //si no hay usuario, ir al home
}	
}]);


FlowRouter.route('/',{
	name:'home',
	action(){
		if(Meteor.userId()){
			FlowRouter.go('dash'); //si esta logeado, ir al recipe book
		}
		BlazeLayout.render('HomeLayout');
	}
	
});

/*dashppal*/
FlowRouter.route('/dash',{
	name:'dash',
	action(){
		BlazeLayout.render('MainLayout',{main:'Dash'});
	}
});

/*parametria*/
FlowRouter.route('/parametros',{
	name:'parametros',
	action(){
		BlazeLayout.render('MainLayout',{main:'Parametros'});
	}
});

/*fin parametria*/

/*Log de modulos*/
FlowRouter.route('/log',{
	name:'log',
	action(){
		BlazeLayout.render('MainLayout',{main:'Log'});
	}
});

FlowRouter.route('/dispositivos',{
	name:'dispositivos',
	action(){
		BlazeLayout.render('MainLayout',{main:'Dispositivos'});
	}
});
FlowRouter.route('/dispositivo/:id',{
	name:'dispositivo',
	action(){
		BlazeLayout.render('MainLayout',{main:'DispositivoSingle'});
	}
});

FlowRouter.route('/recipe-book',{
	name:'recipe-book',
	action(){
		BlazeLayout.render('MainLayout',{main:'Recipes'});
	}
});

FlowRouter.route('/recipe/:id',{
	name:'recipe',
	action(){
		BlazeLayout.render('MainLayout',{main:'RecipeSingle'});
	}
});

FlowRouter.route('/menu',{
	name:'menu',
	action(){
		BlazeLayout.render('MainLayout',{main:'Menu'});
	}
});

FlowRouter.route('/shopping-list',{
	name:'shopping-list',
	action(){
		BlazeLayout.render('MainLayout',{main:'ShoppingList'});
	}
});