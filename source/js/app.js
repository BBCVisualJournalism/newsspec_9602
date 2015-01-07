define(['lib/news_special/bootstrap', 'backbone', 'models/user', 'views/userForm'], function (news, Backbone, UserModel, UserForm) {

    var mainEl = news.$('.main');

    var userModel = new UserModel();

    var AppRouter = Backbone.Router.extend({
        routes: {
            'results/:player': 'results',
            '*path': 'home'
        },
        home: function () {
            var userForm = new UserForm({
                container: mainEl,
                model: userModel
            });
            userForm.render();
        },
        results: function (player) {
            console.log('Showing results for player ID: ' + player);
        }
    });

    new AppRouter();
    Backbone.history.start();

    news.sendMessageToremoveLoadingImage();
});