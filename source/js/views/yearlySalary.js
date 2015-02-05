define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/yearlySalary.html',
    'models/calculator',
    'models/textFormat',
    'vocabs'
], function (news, Backbone, ShareTools, htmlTemplate, Calculator, TextFormat, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();
        },
        render: function () {
            var viewData = this.getViewData();
            this.setElement(this.template(viewData));

            this.graphicStartDateEl = this.$el.find('.timeline--date__start');
            this.graphicEndDateEl = this.$el.find('.timeline--date__end');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.graphicStartDateEl.text(new Date().getFullYear());
            this.updateGraphicText(viewData.startYear);

            this.updateShareTools(viewData.shareText);


            return this.$el;
        },
        getViewData: function () {
            var years = Calculator.userYearsToEarn(this.userModel.incomePPP(), this.player.get('annual_wage')),
                startYear = Calculator.startYearWith(years);

            var textObj = this.getText(startYear);
            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{YEARS}': years,
                '{START_YEAR}': startYear.year
            };
            
            return {
                topTextMarkup: TextFormat.processText(textObj.topText, replacements),
                bottomTextMarkup: TextFormat.processText(textObj.bottomText, replacements),
                shareText: TextFormat.processText(textObj.shareText, replacements),
                startYear: startYear
            };
        },
        getText: function (startYear) {
            var topText = '',
                bottomText = '',
                shareText = '';

            if (this.userModel.get('usingWorldAvg')) {
                topText = vocabs.yearly_salary_gobal_avg_top;
                bottomText = vocabs.yearly_salary_gobal_avg_bottom;
                shareText = vocabs.share_yearly_world_avg;

            } else if (startYear.isBC) {
                topText = vocabs.yearly_salary_top;
                bottomText = vocabs.yearly_salary_bottom_bc;
                shareText = vocabs.share_yearly_salary;
                
            } else {
                topText = vocabs.yearly_salary_top;
                bottomText = vocabs.yearly_salary_bottom;
                shareText = vocabs.share_yearly_salary;
            }

            return {
                topText: topText,
                bottomText: bottomText,
                shareText: shareText
            };
        },
        updateShareTools: function (shareMessage) {
            new ShareTools(this.shareToolsEl, {
                message: shareMessage,
                hashtag: 'BBCFootballWages',
                image: 'http://news.bbcimg.co.uk/media/images/80750000/gif/_80750012__promo624x351.gif',
                template: 'dropdown'
            }, 'yearly-salary');
        },
        updateGraphicText: function (startYear) {
            var text = startYear.year;
            if (startYear.isBC) {
                text = TextFormat.processText(vocabs.year_bc, {'{YEAR}': startYear.year});
            }
            this.graphicEndDateEl.text(text);
        }
    });
});