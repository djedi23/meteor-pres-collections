Package.describe({
    name: 'djedi:pres-collections',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Define your jmpress presentation in a collection',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/djedi23/meteor-pres-collections',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.3.2');

    api.use(['mongo',
        'alanning:roles@1.2.13',
        'matb33:collection-hooks@0.7.11',
        'djedi:modules@0.1.0'],
        ['client', 'server']);
    api.use(['templating', 'jquery',
        'djedi:pres-jmpress@0.0.1',
	'session',
        'tracker',
        'perak:markdown@1.0.4'],
        ['client']);

    api.addFiles('collections/presentation.js', ['client', 'server']);
    api.addFiles(['client/presentation.html',
        'client/presentation.js'
    ], ['client']);
    api.addFiles('server/publish.js', ['server']);
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('djedi:pres-collections');
    api.addFiles('pres-collections-tests.js');
});
