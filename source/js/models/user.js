define([
    'backbone',
    'collections/countries',
    'data/countries'
], function (Backbone, CountriesCollection, countriesData) {
    return Backbone.Model.extend({
        defaults: {
            'country': null,
            'income': 0
        },
        initialize: function () {
            this.countries = new CountriesCollection(countriesData);
        },
        country: function () {
            return this.countries.findWhere({code: this.get('country')});
        },
        incomePPP: function () {
            return this.get('income') * this.country().get('ppp');
        },
        validate: function (attrs) {
            var errors = [];

            if (!attrs.country) {
                errors.push({name: 'country'});
            }
            if (!attrs.income || !$.isNumeric(attrs.income) || attrs.income <= 0) {
                errors.push({name: 'income'});
            }

            return (errors.length > 0) ? errors : false;
        }
    });
});