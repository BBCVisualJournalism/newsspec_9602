define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            name: null,
            code: null,
            currency_symbol: '£'
        }
    });
});