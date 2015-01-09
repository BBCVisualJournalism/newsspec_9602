define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            'country': null,
            'income': 0
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