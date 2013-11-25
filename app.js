/*jshint globalstrict:true, browser:true */
/*global Ember:false, localStorage:false */
'use strict';

var App = Ember.Application.create();

App.Router.map(function() {
	this.resource('hamster', {path: '/hamster/:hamster_id'}, function(){
		this.route('edit');
	});
	this.route('create');
});

//Excercise 1 - Create a dynamic segment using the path /#/hampster/{id}


//Excercise 2 - Create a resource to add a new hampster


//Excercise 3 - Using the add route as a base, create an edit route




App.Hamster = Ember.Object.extend({
	firstName: null,
	lastName: null,
	attitude: null,
	mood: function() {
		var nameImplyingMood = this.get('firstName');
		return nameImplyingMood.toLowerCase();
	}.property('firstName'),
	imageSrc: function() {
		return "./images/%@.png".fmt(this.get('mood'));
	}.property('mood')
});

App.IndexController = Ember.Controller.extend({
	names: [App.Hamster.create({
				id: "1",
				firstName: "Happy",
				lastName: "Hamster",
				attitude: 'ferocious'
			}), App.Hamster.create({
				id: "2",
				firstName: "Sad",
				lastName: "Hamster",
				attitude: 'passive'
			}), App.Hamster.create({
				id: "3",
				firstName: "Angry",
				lastName: "Hamster",
				attitude: 'active'
			})]
	,
	makeHappy: function(hamster) {
		hamster.set('firstName', 'Happy');
	},
	makeSad: function(hamster) {
		hamster.set('firstName', 'Sad');
	}

});

App.IndexRoute = Ember.Route.extend({
	actions: {
		hamsterClick: function(context){
			this.transitionTo('hamster', context);
		}
	}
});

App.HamsterRoute = Ember.Route.extend({
	model: function(params){
		// var model = this.controllerFor('index').get('names').filterBy('id',params.hamster_id)[0];
		var model = this.controllerFor('index').get('names').findBy('id',params.hamster_id);
		return model;
	}
});

App.HamsterController = Ember.ObjectController.extend({
	actions:{
		makeSad: function(hamster){
			hamster.set('firstName', 'Sad');
		},
		edit: function(){
			this.transitionToRoute('hamster.edit');
		}
	}
});

App.CreateRoute = Ember.Route.extend({

	model: function(){
		return App.Hamster.create({});
	},

	actions:{
		hamsterDone: function(){
			this.transitionTo('index');
		}
	}
});

App.HamsterEditRoute = Ember.Route.extend({

	model: function(){
		return this.modelFor('hamster');
	},

	renderTemplate: function(){
		this.render('create', {controller:'hamsterEdit'});
	}
});

App.HamsterEditController = Ember.Controller.extend({
	actions:{
		hamsterDone: function(){
			this.transitionToRoute('hamster', this.get('model'));
		}
	}
})

App.CreateController = Ember.Controller.extend({
	needs: ['index'],
	actions:{
		hamsterDone: function(){
			var index = this.get('controllers.index');
			this.get('content').set('id',index.get('names.content.length')+1);
			var newHamster = this.get('content');
			index.get('names').addObject(newHamster);

			this.transitionToRoute('hamster', this.get('content'));
		}
	}

});

Ember.Handlebars.registerBoundHelper('uppercase', function(value, options) {
	var escaped = Handlebars.Utils.escapeExpression(value.toUpperCase());
	return new Handlebars.SafeString(escaped);
});

App.PokeClickView = Ember.View.extend({
	classNames: ['button-view'],
	template: Ember.Handlebars.compile('<button class="btn btn-danger">Poke</button>'),
	click: function(evt) {
		this.get('controller').send('makeSad', this.get('context.content'));
		return true;
	}
});
