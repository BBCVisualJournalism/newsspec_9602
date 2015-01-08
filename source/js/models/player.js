define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            'name': null,
            'code': null,
            'currency_symbol': null,
            'ppp': 0,
            'annual_wage_ppp': 0
        }
    });
});