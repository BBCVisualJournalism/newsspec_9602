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
            'playerId': null,
            'income': 0,
            'usingWorldAvg': false
        },
        initialize: function () {
            this.countries = new CountriesCollection(countriesData, {parse: true});
            this.countries.sort();
            this.players = new PlayersCollection(playersData, {parse: true});
            this.players.sort();
        },
        country: function () {
            return this.get('country');
        },
        player: function () {
            var playerId = parseInt(this.get('playerId'), 10);
            return this.players.findWhere({id: playerId});
        },
        incomePPP: function () {
            if (!this.get('usingWorldAvg')) {
                return this.get('income') / this.country().get('ppp');
            } else {
                return this.get('income');
            }
            
        },
        validate: function (attrs) {
            var errors = [];

            if (attrs.country.get('name').toLowerCase() !== attrs.countryInput.toLowerCase()) {
                errors.push({name: 'country'});
            }
            if (!attrs.playerId) {
                errors.push({name: 'player'});
            }
            if (!attrs.income || !$.isNumeric(attrs.income) || attrs.income < 0) {
                errors.push({name: 'income'});
            }

            return (errors.length > 0) ? errors : false;
        }
    });
});