if (Meteor.isClient) {
	// code to run on cliente at startup
  // counter starts at 0
  Session.setDefault('counter', 0);
  Meteor.subscribe( 'dashDevices', function(){
  	console.log( "Inbox data ready." );
  });
  
  

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });

  Meteor.publish("dashDevices", function(){
  	var myDashDevices = Dispositivos.find({inDashboard:true},{sort: { moduloID: -1 }});
  	return  myDashDevices;
	});

}
