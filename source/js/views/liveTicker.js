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
            this.startTime = Date.now();
            _.bindAll(this, 'updateTicker');
        },
        render: function () {
            this.$el.html(this.template());

            this.yourselfEl = this.$el.find('.earned__yourself');
            this.nationalAvgEl = this.$el.find('.earned__national-avg');
            this.playerAvgEl = this.$el.find('.earned__player');

            this.updateTicker();
            setInterval(this.updateTicker, 500);
            return this.$el;
        },
        updateTicker: function () {
            this.updateValue(this.yourselfEl, this.userModel.incomePPP());
            this.updateValue(this.nationalAvgEl, this.userModel.country().get('annual_wage'));
            this.updateValue(this.playerAvgEl, this.userModel.player().get('annual_wage'));
        },
        updateValue: function (element, annualSalary) {
            element.text(Calculator.amountEarned(annualSalary, this.startTime, Date.now()));
        }
    });
});