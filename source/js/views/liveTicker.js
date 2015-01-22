define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/liveTicker.html',
    'models/calculator',
    'models/textFormat',
    'vocabs'
], function (news, Backbone, htmlTemplate, Calculator, TextFormat, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();
            this.startTime = Date.now();
            
            _.bindAll(this, 'updateTicker');
        },
        render: function () {
            var viewData = this.getViewData();
            this.setElement(this.template(viewData));

            this.yourselfEl = this.$el.find('.earned__yourself');
            this.nationalAvgEl = this.$el.find('.earned__national-avg');
            this.playerAvgEl = this.$el.find('.earned__player');
            this.playerIconEl = this.$el.find('.icon__player');

            this.updateTicker();
            this.updateInterval = setInterval(this.updateTicker, 500);

            this.loadPlayerCircleImage();

            return this.$el;
        },
        getViewData: function () {
            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{COUNTRY_NAME}': this.userModel.country().get('name')
            };

            return {
                country_earned_label: TextFormat.processText(vocabs.ticker_country_earned, replacements),
                player_earned_label: TextFormat.processText(vocabs.ticker_player_earned, replacements),
                vocabs: vocabs
            };
        },
        loadPlayerCircleImage: function () {
            var playerId = this.player.get('id');
            this.playerIconEl.attr('src', 'img/footballers/footballers_circle-' + playerId + '.png');
            this.playerIconEl.css('display', 'block');
        },
        updateTicker: function () {
            var now = Date.now();
            this.updateValue(this.yourselfEl, this.userModel.incomePPP(), now);
            this.updateValue(this.nationalAvgEl, this.userModel.country().get('annual_wage'), now);
            this.updateValue(this.playerAvgEl, this.player.get('annual_wage'), now);
        },
        updateValue: function (element, annualSalary, nowTime) {
            var pppEarned = Calculator.amountEarned(annualSalary, this.startTime, nowTime),
                localEarned = Calculator.pppToLocal(this.userModel.country().get('ppp'), pppEarned),
                currencySymbol = this.userModel.country().get('currency_symbol');
            element.text(currencySymbol + '' + TextFormat.formatNumber(localEarned.toFixed(2)));
        },
        destroy: function () {
            clearInterval(this.updateInterval);
            this.unbind();
            this.remove();
        }
    });
});