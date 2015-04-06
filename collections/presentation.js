

var canEditPresentation = function(userId){
    return Roles.userIsInRole(Meteor.user(), ['editor']);
};
var canInteract = function(userId){
    return Roles.userIsInRole(Meteor.user(), ['speaker']);
};


modules.collections.Presentations = new Mongo.Collection('presentations');
modules.collections.Presentations.allow({
    insert: function(userId, doc) {
        return canEditPresentation(userId);
    },
    update: function(userId, doc, fieldNames, modifier) {
        return canEditPresentation(userId);
    },
    remove: function() {
        return canEditPresentation(userId);
    }
});

modules.collections.Presentations.deny({
    insert: function(userId, doc) {
        return !canEditPresentation(userId);
    },
    update: function(userId, doc, fieldNames, modifier) {
        return !canEditPresentation(userId);
    },
    remove: function() {
        return !canEditPresentation(userId);
    }
});


modules.collections.Sessions = new Mongo.Collection('sessions');
modules.collections.Sessions.allow({
    insert: function(userId, doc) {
        return canInteract(userId);
    },
    update: function(userId, doc, fieldNames, modifier) {
        return canInteract(userId);
    },
    remove: function() {
        return canInteract(userId);
    }
});

modules.collections.Sessions.deny({
    insert: function(userId, doc) {
        return !canInteract(userId);
    },
    update: function(userId, doc, fieldNames, modifier) {
        return !canInteract(userId);
    },
    remove: function() {
        return !canInteract(userId);
    }
});

modules.collections.Sessions.before.insert(function (userId, doc) {
    doc.createdAt = Date.now();
    doc.speaker = userId;
});