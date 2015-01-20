define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/liveTicker.html',
    'models/calculator'
], function (news, Backbone, htmlTemplate, Calculator) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();
            this.startTime = Date.now();
            _.bindAll(this, 'updateTicker');

            this.setElement(this.template());
        },
        render: function () {
            this.yourselfEl = this.$el.find('.earned__yourself');
            this.nationalAvgEl = this.$el.find('.earned__national-avg');
            this.playerAvgEl = this.$el.find('.earned__player');
            this.playerIconEl = this.$el.find('.icon__player');
            this.playerTextEl = this.$el.find('.player_earned_text');

            this.updateTicker();
            setInterval(this.updateTicker, 500);

            this.updatePlayerText();
            this.loadPlayerSVG();


            return this.$el;
        },
        updatePlayerText: function () {
            var playerText = '{PLAYER_NAME} has earned',
                processText = playerText.replace('{PLAYER_NAME}', this.player.get('name'));
            this.playerTextEl.text(processText);
        },
        loadPlayerSVG: function () {
            var self = this;

            var playerId = this.player.get('id');
            self.playerIconEl.load('img/svg/footballers-' + playerId + '.svg', null);
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
            element.text(currencySymbol + '' + localEarned.toFixed(2));
        }
    });
});