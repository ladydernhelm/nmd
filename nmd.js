/*************************************
below is mostly routing code from sample 1/2/3 routing app I found
*************************************/

goals = new Mongo.Collection("goals");



//would like to get email AND username :)

Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
});

Router.route('/', function () {
  // render the Home template with a custom data context
  
});

Router.route('/goalspage');
Router.route('/events');
Router.route('/about');


/*************************************
below is client code from metoer todo demos
*************************************/
if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("goals");

  Template.body.helpers({
    goals: function () {
  //     if (Session.get("hideCompleted")) {
  //       // If hide completed is checked, filter tasks
  //       return goals.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
  //     } else {
  //       // Otherwise, return all of the tasks
  //       return goals.find({}, {sort: {createdAt: -1}});
  //     }
  //   },
  //   hideCompleted: function () {
  //     return Session.get("hideCompleted");
  //   },
  //   incompleteCount: function () {
  //     return goals.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-goal": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Meteor.call("addGoal", text);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    //don't really know what this does....
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.goal.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteGoal", this._id);
    },
    // "click .toggle-private": function () {
    //   Meteor.call("setPrivate", this._id, ! this.private);
    // }
  });

  Template.goal.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

}




/*************************************
below is server code from metoer todos demo
*************************************/






Meteor.methods({
  addGoal: function (text) {


    goals.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      // username: Meteor.user().username
    });
  },
  deleteGoal: function (goalId) {
    var goal = goals.findOne(goalId);
    if (goal.private && goal.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    goals.remove(goalId);
  },
  setChecked: function (goalId, setChecked) {
    var goal = goals.findOne(goalId);
    if (goal.private && goal.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    goals.update(goalId, { $set: { checked: setChecked} });
  },
  // setPrivate: function (goalId, setToPrivate) {
  //   var goal = goals.findOne(goalId);

  //   // Make sure only the task owner can make a task private
  //   if (goal.owner !== Meteor.userId()) {
  //     throw new Meteor.Error("not-authorized");
  //   }

  //   goals.update(goalId, { $set: { private: setToPrivate } });
  // }
});

// if (Meteor.isServer) {
//   // Only publish tasks that are public or belong to the current user
//   Meteor.publish("goals", function () {
//     return goals.find({
//       $or: [
//         { private: {$ne: true} },
//         { owner: this.userId }
//       ]
//     });
//   });
// }


/*************************************
below is my mix of server code from sample 1/2/3 routing & todos
*************************************/




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // server
    Meteor.publish("goals", function () {
        return goals.find({}, {fields: {text: 1}});
    });
  });
}

console.log(goals);

console.log(goals.find({},{fields: {text:1}}));



/*************************************
below is server code from sample 1/2/3 routing app I found
*************************************/






// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//     // server
//     Meteor.publish("userData", function () {
//       if (this.userId) {
//         return Meteor.users.find({_id: this.userId},
//                                  {fields: {'other': 1, 'things': 1}});
//       } else {
//         this.ready();
//       }
//     });


//   });
// }

