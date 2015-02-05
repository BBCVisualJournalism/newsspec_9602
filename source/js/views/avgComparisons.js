define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/avgComparisons.html',
    'views/barChart',
    'models/calculator',
    'models/textFormat',
    'vocabs'
], function (news, Backbone, ShareTools, htmlTemplate, BarChart, Calculator, TextFormat, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.userCountry = this.userModel.country();
            this.worldAverage = this.userModel.countries.findWhere({code: 'WRL_AVG'});
        },
        render: function () {
            var viewData = this.getViewData();
            this.setElement(this.template(viewData));

            this.barChartEl = this.$el.find('.avg-comparisons--chart');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.updateShareTools(viewData.shareText);
            this.addBarChart();

            return this.$el;
        },
        addBarChart: function () {
            this.barChartEl.empty();

            var barChart = new BarChart({data: [
                {label: vocabs.chart_you, color: '#feb258', value: this.userModel.incomePPP()},
                {label: vocabs.chart_countrys, color: '#e53442', value: this.userCountry.get('annual_wage')},
                {label: vocabs.chart_world, color: '#40408c', value: this.worldAverage.get('annual_wage')}
            ]});
            this.barChartEl.append(barChart.render());
        },
        getViewData: function () {
            var isEnglish = this.isEnglish();

            var countryAmount = Calculator.compareWage(this.userModel.incomePPP(), this.userCountry.get('annual_wage'), isEnglish),
                worldAmount = Calculator.compareWage(this.userModel.incomePPP(), this.worldAverage.get('annual_wage'), isEnglish),
                countryAvgWage = Math.round(Calculator.pppToLocal(this.userCountry.get('ppp'), this.userCountry.get('annual_wage'))),
                countryAvgWageRounder = Math.round(countryAvgWage / 100) * 100;

            var textObj = this.getText();
            var replacements = {
                '{COUNTRY_VALUE}': countryAmount,
                '{COUNTRY}': this.userCountry.get('name'),
                '{WORLD_VALUE}': worldAmount,
                '{CURRENCY_SYMBOL}': this.userCountry.get('currency_symbol'),
                '{COUNTRY_ANNUAL_AVG_WAGE}': TextFormat.formatNumber(countryAvgWageRounder)
            };

            return {
                topTextMarkup: TextFormat.processText(textObj.topText, replacements),
                bottomTextMarkup: TextFormat.processText(textObj.bottomText, replacements),
                shareText: TextFormat.processText(textObj.shareText, replacements)
            };

        },
        getText: function () {
            var topText = '',
                bottomText = vocabs.avg_compare_bottom,
                shareText = vocabs.share_avg_compare;

            /* If english, use complex text */
            if (this.isEnglish()) {
                topText = vocabs.avg_compare_english;
            } else {
                topText = vocabs.avg_compare_languages;
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
            }, 'avg-compare');
        },
        isEnglish: function () {
            return ($('.lang_english').length !== 0);
        }
    });
});