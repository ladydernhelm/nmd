if (Meteor.isServer) {
	Meteor.publish("goals", function () {
		return Goals.find({});
	});

  //process.env.MAIL_URL = MAIL GUN URL
}

Meteor.methods({
  addGoal: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Goals.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  setChecked: function (goalId, setChecked) {
    var goal = Goals.findOne(goalId);

    Goals.update(goalId, {$set: { checked: setChecked} });
  }
})