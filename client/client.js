
if (Meteor.isClient) {
	// This code only runs on the client
	Meteor.subscribe("goals");
	
	Template.goals.events({
		"click .toggle-checked": function () {
			// Set the checked property to the opposite of its current value
			Meteor.call("setChecked", this._id, ! this.checked);
		},
		
		"submit form": function (event) {
			event.preventDefault();
			// This function is called when the new task form is submitted
			var text = event.target.text.value;
			
			Meteor.call("addGoal", text);  
			// Clear form
			event.target.text.value = "";
			// Prevent default form submit
			return false;
		}
	});

	Template.goals.helpers({
		goals: function () {
			return Goals.find({'owner':UserId}, {sort: {createdAt: -1}});
		}
	});

	$( document ).ready(function() {
	    $(".button-collapse").sideNav();
	});
}



