Template.Log.onCreated(function(){
	var self = this;
	self.autorun(function(){
		self.subscribe('moduloLogs50');
		self.subscribe('moduloEstado');
	});
});

Template.Log.helpers({
	moduloLogs:function(){
		//return ModuloLogs.find({sort: {fecha:-1}});
		return ModuloLogs.find({}, {
      				sort: { fechaOrigen: -1 }, limit:50
    				});
	},
	compare:function(v1, v2) {
  		if (typeof v1 === 'object' && typeof v2 === 'object') {
    		return _.isEqual(v1, v2); // do a object comparison
  		} else {
    		return v1 === v2;
	    }
	} ,
	momentFmt: function(timestamp) {
		if (timestamp) {
			return moment.utc(timestamp).format('DD/MM/YYYY h:mm:ss a');
		}
	}
});


Template.Log.events({
	'click .toggle-btn':function(event, template){
		Meteor.call('togglePrendeApaga',this._id, this.estado);
	}
});