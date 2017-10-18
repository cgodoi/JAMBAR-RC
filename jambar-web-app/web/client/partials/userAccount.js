if (Meteor.isClient){
    Template.Register.events({
    'submit form':function(event, template){
        event.preventDefault();
        var emailVar =template.find('#register-email').value;
        var passwordVar =template.find('#register-password').value;
        Account.createUser({
            email: emailVar,
            password: passwordVar
        });
    }
    });

    Template.Login.events({
    'submit form':function(event, template){
        event.preventDefault();
        var emailVar =template.find('#login-email').value;
        var passwordVar =template.find('#login-password').value;
        Meteor.loginWithPassword(emailVar,passwordVar);
    }
    });    
}