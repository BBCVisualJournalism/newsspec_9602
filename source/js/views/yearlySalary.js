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

        },
        render: function () {
            this.$el.html(this.template());

            this.textEl = this.$el.find('.yearly-salary--text');
            this.updateText();

            return this.$el;
        },
        updateText: function () {
            var years = Calculator.userYearsToEarn(this.userModel.incomePPP(), this.player.get('annual_wage')),
                startYear = Calculator.startYearWith(years);

            var dynText = 'On your current salary, it would take you <strong>{YEARS} years</strong> to earn {PLAYER_NAME}\'s annual wage (if you started in {START_YEAR}, you\'d be almost finished).';
            
            var processText = dynText.replace('{PLAYER_NAME}', this.player.get('name'));
            processText = processText.replace('{YEARS}', years);
            processText = processText.replace('{START_YEAR}', startYear);

            this.textEl.html(processText);
        }
    });
});