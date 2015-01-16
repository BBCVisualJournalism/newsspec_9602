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