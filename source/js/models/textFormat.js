define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function () {
            throw new Error('This model should not be initialised, as all methods are class methods.');
        }
    }, {
        processText: function (text, replacements) {
            var returnText = text;
            for (var replacement in replacements) {
                returnText = returnText.replace(replacement, replacements[replacement]);
            }
            /* BB CODE: Replace {B} with <strong> tags */
            returnText = returnText.replace(/\{B\}/gi, '<strong>').replace(/\{\/B\}/gi, '</strong>');
            return returnText;
        },
        formatNumber: function (num) {
            if (true) {
                return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            } else {
                return num;
            }
        }
    });
});