Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('Login');
  } else {
    this.next();
  }
});

Router.route('/', function () {
  // render the Home template with a custom data context
  this.render('Login');
});

// when you navigate to "/one" automatically render the template named "One".
Router.route('/one');

// when you navigate to "/two" automatically render the template named "Two".
Router.route('/two');

if (Meteor.isClient) {

    // client
  Meteor.subscribe("userData");
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // server
    Meteor.publish("userData", function () {
      if (this.userId) {
        return Meteor.users.find({_id: this.userId},
                                 {fields: {'other': 1, 'things': 1}});
      } else {
        this.ready();
      }
    });


  });
}

