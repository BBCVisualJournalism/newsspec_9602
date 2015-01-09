define([
    'backbone',
    'models/country'
], function (Backbone, Country) {

    return Backbone.Collection.extend({
        model: Country
    });

});