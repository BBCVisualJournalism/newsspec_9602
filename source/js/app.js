define([
    'lib/news_special/bootstrap',
    'backbone',
    'models/user',
    'collections/countries',
    'collections/players',
    'views/userForm',
    'data/countries',
    'data/players'
], function (news, Backbone, UserModel, CountriesCollection, PlayersCollection, UserForm, countriesData, playersData) {

    var mainEl = news.$('.main');

    var userModel = new UserModel(),
        countries = new CountriesCollection(countriesData),
        players = new PlayersCollection(playersData);

    var AppRouter = Backbone.Router.extend({
        routes: {
            'results/:player': 'results',
            '': 'home'
        },
        home: function () {
            var userForm = new UserForm({
                container: mainEl,
                model: userModel,
                countries: countries
            });
            userForm.render();
        },
        results: function (player) {
            // Ensure the user hasn't arrived at route, without completing form
            if(mainEl.find('.user-form').length === 0){
                this.navigate('', {trigger: true, replace: true});
            } else {
                console.log('Showing results for player ID: ' + player);
            }
        }
    });

    new AppRouter();
    Backbone.history.start();

    news.sendMessageToremoveLoadingImage();
});