Router.route('/', function () {
  this.render('home');
});

Router.route('/about', function () {
  this.render('about');
});

Router.route('/events', function () {
  this.render('events');
});

Router.route('/goals', function () {
  this.render('login');
});

Router.route('/goals/:_id', function () {
    UserId = this.params._id
  var goals = Goals.findOne({_id: this.params._id});
  this.render('goals', {data: goals});
});


