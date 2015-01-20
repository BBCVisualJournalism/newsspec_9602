define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/avgComparisons.html',
    'views/barChart',
    'models/calculator',
    'models/textFormat'
], function (news, Backbone, ShareTools, htmlTemplate, BarChart, Calculator, TextFormat) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.userCountry = this.userModel.country();
            this.worldAverage = this.userModel.countries.findWhere({name: 'World average '});
            this.setElement(this.template());
        },
        render: function () {
            this.textEl = this.$el.find('.avg-comparisons--text');
            this.barChartEl = this.$el.find('.avg-comparisons--chart');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.updateText();
            this.addBarChart();
            return this.$el;
        },
        addBarChart: function () {
            this.barChartEl.empty();

            var barChart = new BarChart({data: [
                {label: 'You', color: '#feb258', value: this.userModel.incomePPP()},
                {label: 'Your country\'s average', color: '#e53442', value: this.userCountry.get('annual_wage')},
                {label: 'World Average', color: '#40408c', value: this.worldAverage.get('annual_wage')}
            ]});
            this.barChartEl.append(barChart.render());
        },
        updateText: function () {
            var text = 'You earn <strong>{COUNTRY_AMOUNT}</strong> the {COUNTRY}\'s average wage and <strong>{WORLD_AMOUNT}</strong> the world average wage.',
                shareText = 'I earn {COUNTRY_AMOUNT} the {COUNTRY}\'s average wage and {WORLD_AMOUNT} the world average wage.';
            
            var countryAmount = Calculator.compareWage(this.userModel.incomePPP(), this.userCountry.get('annual_wage')),
                worldAmount = Calculator.compareWage(this.userModel.incomePPP(), this.worldAverage.get('annual_wage'));

            var replacements = {
                '{COUNTRY_AMOUNT}': countryAmount,
                '{COUNTRY}': this.userCountry.get('name'),
                '{WORLD_AMOUNT}': worldAmount
            };
            this.textEl.html(TextFormat.processText(text, replacements));
            this.updateShareTools(TextFormat.processText(shareText, replacements));
        },
        updateShareTools: function (shareMessage) {
            new ShareTools(this.shareToolsEl, {
                message: shareMessage,
                hashtag: 'BBCNewsGraphics',
                template: 'dropdown'
            }, 'avg-compare');
        }
    });
});