/*************************************
below is mostly routing code from sample 1/2/3 routing app I found
*************************************/

goals = new Mongo.Collection("goals");

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

//want to send users to goals once they log in... will have to figure that out...

Router.route('/goals');

// when you navigate to "/one" automatically render the template named "One".
Router.route('/events');

// when you navigate to "/two" automatically render the template named "Two".
Router.route('/about');


/*************************************
below is client code from metoer todo demos
*************************************/
if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("goals");

  Template.body.helpers({
    goals: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return goals.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return goals.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return goals.find({checked: {$ne: true}}).count();
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
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.goals.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteGoal", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
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
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}









/*************************************
below is server code from sample 1/2/3 routing app I found
*************************************/







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

