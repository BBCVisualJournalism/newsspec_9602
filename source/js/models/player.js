define([
    'backbone',
    'data/countries',
    'collections/countries',
    'models/calculator',
    'models/textFormat'
], function (Backbone, countriesData, CountriesCollection, Calculator, TextFormat) {
    return Backbone.Model.extend({
        defaults: {
            'id': null,
            'name': '',
            'club': '',
            'country': '',
            'league': '',
            'annual_wage': 0,
            'shirt_price': 0,
            'surname': ''
        },
        loadCountries: function () {
            if (!this.countries) {
                this.countries = new CountriesCollection(countriesData);
            }
        },
        country: function () {
            this.loadCountries();
            return this.countries.findWhere({code: this.get('country')});
        },
        getRoundedWage: function () {
            var country = this.country(),
                localWage = Calculator.pppToLocal(country.get('ppp'), this.get('annual_wage')),
                roundedWage = Math.round(localWage / 100000) * 100000;

            if (!TextFormat.isRtl()) {
                return country.get('currency_symbol') + '' + TextFormat.formatNumber(roundedWage);
            } else {
                return TextFormat.formatNumber(roundedWage) + '' + country.get('currency_symbol');
            }

            
        },
        isManager: function () {
            /* If Jose or Pep, then they're managers */
            return this.get('id') === 6 || this.get('id') === 11;
        },
        isInternational: function () {
            return (this.get('league') !== 'Premier League');
        }
    });
});