Router.configure({
	layoutTemplate: "layout"
});


Router.map(function(){
	this.route("home", {path: "/"});
	this.route("events", {path: "/events"});
	this.route("about", {path: "/about"});
    this.route("goals", {path: "/goals"//,

    // onBeforeAction: function (pause) {
    //   if (!Meteor.user()) {
    //     // render the login template but keep the url in the browser the same
    //     this.render("login");
    //     // pause the rest of the before hooks and the action function 
    //     // pause();
    //   }
   // },
  });
});
