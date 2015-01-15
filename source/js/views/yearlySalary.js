define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/yearlySalary.html',
    'models/calculator'
], function (news, Backbone, htmlTemplate, Calculator) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();

            this.setElement(this.template());
        },
        render: function () {
            this.topTextEl = this.$el.find('.yearly-salary--text__top');
            this.bottomTextEl = this.$el.find('.yearly-salary--text__bottom');
            this.graphicStartDateEl = this.$el.find('.timeline--date__start');
            this.graphicEndDateEl = this.$el.find('.timeline--date__end');

            this.graphicStartDateEl.text(new Date().getFullYear());
            this.updateText();

            return this.$el;
        },
        updateText: function () {
            var years = Calculator.userYearsToEarn(this.userModel.incomePPP(), this.player.get('annual_wage')),
                startYear = Calculator.startYearWith(years);

            var topText = 'On your current salary, it would take you <strong>{YEARS} years</strong> to earn {PLAYER_NAME}\'s annual wage.',
                bottomText = 'If you started in the year <strong>{START_YEAR}</strong>, you\'d be almost finished.';
            
            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{YEARS}': years,
                '{START_YEAR}': startYear
            };

            this.topTextEl.html(this.processText(topText, replacements));
            this.bottomTextEl.html(this.processText(bottomText, replacements));
            this.updateGraphicText(startYear);
        },
        updateGraphicText: function (startYear) {
            this.graphicEndDateEl.text(startYear);
        },
        processText: function (text, replacements) {
            var returnText = text;
            for (var replacement in replacements) {
                console.log(replacement);
                returnText = returnText.replace(replacement, replacements[replacement]);
            }
            return returnText;
        }
    });
});