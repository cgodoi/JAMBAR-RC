
Template.Dash.onCreated(function(){
	var self = this;
	self.autorun(function(){
		self.subscribe('tipoDispositivos');
		self.subscribe('sectores');
		self.subscribe('modulos');
		self.subscribe('moduloEstado');
		//self.subscribe('moduloLogs');
		//self.subscribe('dispositivos');
		self.subscribe('dashDevices');
		//self.subscribe('UltimoLogPorModulo');

	});

	

});

Template.LedTemplate.helpers({
	momentFmt: function(timestamp) {
		if (timestamp) {
			return moment.utc(timestamp).format('MMM Do YYYY h:mm:ss a');
		}
	}});


Template.Dash.helpers({
	momentFmt: function(timestamp) {
		if (timestamp) {
			return moment.utc(timestamp).format('MMM Do YYYY h:mm:ss a');
		}
	},
	myDashDevices:function(){
	var dashDispositivosSalida=[];
  	var myDashDevices = Dispositivos.find({inDashboard:true},{sort: { sectorID: 1,  moduloID: -1 }});

   		myDashDevices.forEach(function (myDevice) {
			   //console.log(myDevice);
		    //buscar modulo
			var  myModulo = Modulos.findOne({_id: myDevice.moduloID});	
			//buscar Tipo dispositivo
			var myTipoDispositivo = TipoDispositivos.findOne({_id: myDevice.tipoDispositivoID});
			//buscar sector
			var mySector = Sectores.findOne({_id:myDevice.sectorID});
			//buscar ultima Actividad Ejecutada
			var myActividad = ModuloEstado.findOne({moduloID:myDevice.moduloID, ejecutado:'S'}, {sort: { fechaEjecuta: -1 }, limit:1});
			console.log(myActividad);
			var mValor = typeof myActividad !== 'undefined' ? myActividad.valor : '0';
			var dispoActivo = false;
				if (mValor == '1' ){
					dispoActivo = true;
				}
			var dispoEstado	=  dispoActivo !== true ? 'Desactivado' : 'Activado';

			var miElemento = //[
								  { mDispoEstado :dispoEstado,
								  	mDispoActivo :dispoActivo,
								  	mDispositivo : myDevice,
								  	mTipoDispositivo : myTipoDispositivo,
								  	mSector : mySector,
								  	mModulo     : myModulo,
								  	mActividad : myActividad
								  };
							//];
			dashDispositivosSalida.push(miElemento);
	  });

   	return dashDispositivosSalida;
	},
	compare:function(v1, v2) {
  		if (typeof v1 === 'object' && typeof v2 === 'object') {
    		return _.isEqual(v1, v2); // do a object comparison
  		} else {
    		return v1 === v2;
	    }
	}

});


Template.DashIpCam.helpers({
	compare:function(v1, v2) {
  		if (typeof v1 === 'object' && typeof v2 === 'object') {
    		return _.isEqual(v1, v2); // do a object comparison
  		} else {
    		return v1 === v2;
	    }
	},
	cssCamIp:function(mDispo){
		var camsrc='';
		var existsSrc=false;
		mDispo.caracteristicas.forEach(function(element) {
		if(element.nombre=='camsrc'){
			camsrc = element.valor;
			existsSrc=true;
		}
		}, this);


		if(existsSrc){
			return '.' + mDispo._id +' {color: #fff;background:url(\''+camsrc +'\');background-repeat:no-repeat;background-size:cover;background-position:center;height:100%} '+
					'.' + mDispo._id +'_1 {width:640px;height:480px}';
		}else{
			return ' ';
		}

		
	}
});


Template.Dash.events({
	'click .luzOnOff':function(){
		//console.log(this);
		var mValor = typeof this.mActividad !== 'undefined' ? this.mActividad.valor : ('0');
		if (mValor == '0' ){
			mValor ='1';
		}else{
			mValor ='0';
		}
		var mMensaje = this.mModulo.codigo+'='+mValor;
	    Meteor.call('insertaModuloLog','webApp', this.mModulo._id,mValor, mMensaje, 'P');
	}
});

Template.DashIpCam.events({
	'click .cambtns':function(sender){
		var mUrl = sender.currentTarget.value;
		console.log(mUrl);
		$.get(mUrl, function(data, status){
			console.log("Cams get result:");
        	console.log(data + status);
    	});
	}
});