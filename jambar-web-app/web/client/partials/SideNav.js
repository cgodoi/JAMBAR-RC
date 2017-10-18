if (Meteor.isClient){
    
    Template.SideNav.events({
    'click .logout':function(event, template){
        console.log("que wa");
        event.preventDefault();
        Meteor.logout();
    }
    });    
}