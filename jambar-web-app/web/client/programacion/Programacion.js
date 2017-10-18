Template.Programacion.onCreated(function(){
    this.editMode = new ReactiveVar(false);
    var self = this;
	self.autorun(function(){
		self.subscribe('programacion');
	});
    });
    
    Template.Programacion.helpers({
        updateProgramacionId: function(){
            return this._id;
        },
        editMode:function(){
            return Template.instance().editMode.get(); //instancia particular de template
        },
        programacion:()=> {
            return Programacion.find();
        }
    });
    
    Template.Programacion.events({
        'click #btnNuevoProgramacion':()=>{
            Session.set('nuevoProgramacion', true);
        },
        'click .fa-trash' : function(){
            Meteor.call('deleteProgramacion',this._id);
        },
        'click .fa-pencil' : function(event, template){
            template.editMode.set(!template.editMode.get());
        }
    });


    Template.NuevoProgramacion.events({
        'click .fa-close' : function(){
            Session.set('nuevoProgramacion',false)
        }
    });