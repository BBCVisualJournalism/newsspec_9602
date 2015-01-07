define(['lib/news_special/bootstrap', 'backbone'], function (news) {

    var userModel = {};

    var AppRouter = Backbone.Router.extend({
        routes: {
            'results/:player': 'results',
            '*path': 'home'
        },
        home: function (path) {
            console.log('Hello world');
        },
        results: function (player) {
            console.log('Showing results for player ID: ' + player);
        }
    });

    new AppRouter();
    Backbone.history.start();

    news.sendMessageToremoveLoadingImage();
});