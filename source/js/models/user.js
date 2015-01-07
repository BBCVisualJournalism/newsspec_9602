define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.Model.extend({
        defaults: {
            country: null,
            income: 0
        },

        validate: function (attrs) {
            console.log(attrs);
            var errors = [];

            if (!attrs.country) {
                errors.push({name: 'country', message: 'Please enter a valid country'});
            }
            if (!attrs.income) {
                errors.push({name: 'income', message: 'Please enter a valid income'});
            }

            return errors.length > 0 ? errors : false;
        }
    });
});