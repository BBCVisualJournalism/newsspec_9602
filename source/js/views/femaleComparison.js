define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/femaleComparison.html',
    'views/barChart',
    'models/calculator',
    'models/textFormat'
], function (news, Backbone, htmlTemplate, BarChart, Calculator, TextFormat) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;

            this.userPlayer = this.userModel.player();
            this.femalePlayer = this.userModel.players.findWhere({name: 'Casey Stoney'});
            
            this.setElement(this.template());
        },
        render: function () {
            this.textEl = this.$el.find('.female-comparison--text');
            this.barChartEl = this.$el.find('.female-comparison--chart');

            this.updateText();
            this.addBarChart();
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
        updateText: function () {
            var text = '{PLAYER_NAME} earns <strong>{AMOUNT}</strong> than the former England ladies captain Casey Stone, who is on a reported £25,000 a year.';
            
            var amount = Calculator.compareWage(this.userPlayer.get('annual_wage'), this.femalePlayer.get('annual_wage'));
            var replacements = {
                '{PLAYER_NAME}': this.userPlayer.get('name'),
                '{AMOUNT}': amount
            };
            this.textEl.html(TextFormat.processText(text, replacements));
        }
    });
});