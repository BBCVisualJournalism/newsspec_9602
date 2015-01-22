define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/femaleComparison.html',
    'views/barChart',
    'models/calculator',
    'models/textFormat',
    'vocabs'
], function (news, Backbone, ShareTools, htmlTemplate, BarChart, Calculator, TextFormat, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;

            this.userPlayer = this.userModel.player();

            var femalePlayerName = (this.userPlayer.isInternational()) ? vocabs.player_alex_morgan : vocabs.player_steph_houghton;
            this.femalePlayer = this.userModel.players.findWhere({name: femalePlayerName});
        },
        render: function () {
            var viewData = this.getViewData();
            this.setElement(this.template(viewData));

            this.barChartEl = this.$el.find('.female-comparison--chart');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.addBarChart();
            this.updateShareTools(viewData.shareText);

            return this.$el;
        },
        addBarChart: function () {
            this.barChartEl.empty();

            var barChart = new BarChart({data: [
                {label: this.femalePlayer.get('name'), color: '#40408c', value: this.femalePlayer.get('annual_wage')},
                {label: this.userPlayer.get('name'), color: '#e53442', value: this.userPlayer.get('annual_wage')}
            ]});
            this.barChartEl.append(barChart.render());
        },
        getViewData: function () {
            var timesMore = Calculator.timesMore(this.userPlayer.get('annual_wage'), this.femalePlayer.get('annual_wage'));

            var textObj = this.getText();
            var replacements = {
                '{PLAYER_NAME}': this.userPlayer.get('name'),
                '{TIMES_FEMALE_PLAYER}': timesMore
            };
            return {
                textMarkup: TextFormat.processText(textObj.text, replacements),
                shareText: TextFormat.processText(textObj.shareText, replacements)
            };
        },
        getText: function () {
            var mainText = '',
                shareText = '';

            if (this.userPlayer.isInternational()) {
                mainText = vocabs.female_compare_alex;
                shareText = vocabs.female_compare_alex;

            } else {
                mainText = vocabs.female_compare_steph;
                shareText = vocabs.female_compare_steph;
            }
            return {
                text: mainText,
                shareText: shareText
            };
        },
        updateShareTools: function (shareMessage) {
            new ShareTools(this.shareToolsEl, {
                message: shareMessage,
                hashtag: 'BBCNewsGraphics',
                template: 'dropdown'
            }, 'female-compare');
        }
    });
});