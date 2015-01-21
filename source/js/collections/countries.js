define([
    'backbone',
    'models/country',
    'vocabs'
], function (Backbone, Country, vocabs) {

    return Backbone.Collection.extend({
        model: Country,
        parse: function (countrie) {
			_.each(countrie, function (country) {
				country.name = vocabs['country_' + country.code];
			});

			return countrie;
		},
		comparator: 'name'
    });

});