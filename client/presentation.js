Tracker.autorun(function () {
  // The speaker controls the presentation flow.
  var currentStep = modules.presentation.currentStep.get();
  var presId = Session.get('currentPresentation');
  if (Roles.userIsInRole(Meteor.user(), ['speaker']) && presId){
    var session = modules.collections.Presentations.findOne({_id:presId},{fields: {session: 1}});
    if (session) 
      modules.collections.Sessions.update({_id:session.session},{$set: {currentStep:currentStep}});
  }
});


Tracker.autorun(function(){
  // Move to current Step.

  if (modules.calls('avoidGoToCurrentStep'))
    return;
  
  var presId = Session.get('currentPresentation');
  var presentation = modules.collections.Presentations.findOne({_id:presId},{fields: {session: 1, steps:1}});
  if (presentation){
    var session = modules.collections.Sessions.findOne({_id:presentation.session},{fields: {currentStep: 1}});
    if (session && session.currentStep && $('.jmpress').jmpress('initialized')){
      var current = $($('.jmpress').jmpress('active')).attr('id');
      if (current !== session.currentStep) {
	modules.jmpress.goTo('#'+session.currentStep);
	Session.set('currentPresentationStep', session.currentStep);
      }

      var step = _.findWhere(presentation.steps, {id: session.currentStep} );
      //console.log(step);
      $('body').removeClass();
      if (step && step.worldStyle){
	//console.log(step.worldStyle);
	$('body').addClass(step.worldStyle);
      }
    }
  }
});

Tracker.autorun(function(){
  // Create the presentation session
  var presId = Session.get('currentPresentation');
  var self = modules.collections.Presentations.findOne({_id:presId});
  
  if (self && Roles.userIsInRole(Meteor.user(), ['speaker']) && !( self.session && Session.equals('currentSession', self.session))){
    var session = modules.collections.Sessions.findOne({p: self._id, speaker: Meteor.userId()}, {sort: {createdAt: -1}});
    if (!session){
      //console.log(session,{p: self._id, speaker: Meteor.userId()});
      session = {p: self._id};
      modules.collections.Sessions.insert(session);
      session = modules.collections.Sessions.findOne({p: self._id, speaker: Meteor.userId()}, {sort: {createdAt: -1}});
    }
    modules.collections.Presentations.update({_id:self._id}, {$set: {session: session._id}});
    Session.set('currentSession', session._id);
    //console.log(session._id);
  } 

  var canInteract = (Roles.userIsInRole(Meteor.user(), ['speaker']) || Roles.userIsInRole(Meteor.user(), ['editor']));
  modules.presentation.settings = {keyboard:{use: canInteract},
    mouse: {clickSelects: canInteract}};
});


Tracker.autorun(function(){
  // Recompute the (current) slide when modified
  var presId = Session.get('currentPresentation');
  var self = modules.collections.Presentations.findOne({_id:presId});
  var step_ = self && modules.collections.Sessions.findOne({_id:self.session},{fields: {currentStep: 1}});
  if ($('.jmpress').jmpress('initialized')){
    if (step_ && step_.currentStep){
      _.each(self.steps, function(step){
	var $step = $('#'+step.id);
	if ((modules.calls('refreshAllStepViewAfterModifcation') || step.id === step_.currentStep) && $step.data('stepData')) {
	  _.extend($step.data('stepData'), step);
	  modules.jmpress.reapply($step);
	  if (! modules.calls('refreshAllStepViewAfterModifcation'))
	    modules.jmpress.goTo($step); // force to 'redraw' the step if modified
	}
      });
    }
  }
});


Template.Presentation.helpers({
  action: function(){
    var step_ = modules.collections.Sessions.findOne({_id:this.session},{fields: {currentStep: 1}});
    if (step_ && step_.currentStep){
      var step = _.findWhere(this.steps, {id: step_.currentStep} );

      if (step && step.interaction){
	return step.interaction.type;
      }
    }
    return null;
  },
  context: function(){
      var step_ = modules.collections.Sessions.findOne({_id:this.session},{fields: {currentStep: 1}});
      if (step_ && step_.currentStep){
	var step = _.findWhere(this.steps, {id: step_.currentStep} );

	if (step && step.interaction){
	  return step.interaction.data;
	}
      }
      return null;
    }
});


