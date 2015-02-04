define(['backbone', 'vocabs'], function (Backbone, vocabs) {
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
            var thousandSeparator = vocabs.thousand_separator.replace('{SPACE}', ' ');

            var formattedNumber = num.toString();
            formattedNumber = formattedNumber.replace('.', vocabs.decimal_separator);
            formattedNumber = formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
            return formattedNumber;
        },
        isRtl: function () {
            return $('.lang_arabic, .lang_persian').length > 0;
        },
        // staticURL: 'http://news.bbcimg.co.uk/news/special/2015/newsspec_9602/content/english/img'
        staticURL: 'http://newsimg.bbc.co.uk/news/special/2015/newsspec_9602/content/english/img'
        // staticURL: 'img'
    });
});