define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/yearlySalary.html',
    'models/calculator',
    'models/textFormat'
], function (news, Backbone, ShareTools, htmlTemplate, Calculator, TextFormat) {
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
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.graphicStartDateEl.text(new Date().getFullYear());
            this.updateText();

            return this.$el;
        },
        updateText: function () {
            var years = Calculator.userYearsToEarn(this.userModel.incomePPP(), this.player.get('annual_wage')),
                startYear = Calculator.startYearWith(years);

            var topText = 'On your current salary, it would take you <strong>{YEARS} years</strong> to earn {PLAYER_NAME}\'s annual wage.',
                bottomText = 'If you started in the year <strong>{START_YEAR}</strong>, you\'d be almost finished.',
                shareText = 'On my current salary, it would take me {YEARS} years to earn {PLAYER_NAME}\'s annual wage.';
            
            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{YEARS}': years,
                '{START_YEAR}': startYear
            };

            this.topTextEl.html(TextFormat.processText(topText, replacements));
            this.bottomTextEl.html(TextFormat.processText(bottomText, replacements));
            this.updateGraphicText(startYear);

            this.updateShareTools(TextFormat.processText(shareText, replacements));
        },
        updateShareTools: function (shareMessage) {
            new ShareTools(this.shareToolsEl, {
                message: shareMessage,
                hashtag: 'BBCNewsGraphics',
                template: 'dropdown'
            }, 'yearly-salary');
        },
        updateGraphicText: function (startYear) {
            this.graphicEndDateEl.text(startYear);
        }
    });
});