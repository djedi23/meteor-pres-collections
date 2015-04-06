Meteor.publish("presentationsByName", function (presentation) {
    check(presentation, String);

    var presentations = modules.collections.Presentations.find({name:presentation});
    var prids = presentations.map(function(p) {return p.session;});
    var sessions = modules.collections.Sessions.find({_id: {$in: prids}});
    
//    console.log(prids);
    return [
	presentations,
	sessions
    ];
});
