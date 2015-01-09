define([
    'backbone',
    'collections/countries',
    'collections/players',
    'data/countries',
    'data/players'
], function (Backbone, CountriesCollection, PlayersCollection, countriesData, playersData) {
    return Backbone.Model.extend({
        defaults: {
            'country': null,
            'player': null,
            'income': 0
        },
        initialize: function () {
            this.countries = new CountriesCollection(countriesData);
            this.players = new PlayersCollection(playersData);
        },
        country: function () {
            return this.countries.findWhere({code: this.get('country')});
        },
        player: function () {
            return this.players.findWhere({name: this.get('player')});
        },
        incomePPP: function () {
            return this.get('income') * this.country().get('ppp');
        },
        validate: function (attrs) {
            var errors = [];

            if (!attrs.country) {
                errors.push({name: 'country'});
            }
            if (!attrs.player) {
                errors.push({name: 'player'});
            }
            if (!attrs.income || !$.isNumeric(attrs.income) || attrs.income <= 0) {
                errors.push({name: 'income'});
            }

            return (errors.length > 0) ? errors : false;
        }
    });
});