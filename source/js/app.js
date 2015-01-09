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

    var countries = new CountriesCollection(countriesData),
        players = new PlayersCollection(playersData),
        userModel = new UserModel({countries: countries});

    var userForm = new UserForm({
        container: mainEl,
        model: userModel,
        countries: countries
    });
    userForm.render();

    news.sendMessageToremoveLoadingImage();
});