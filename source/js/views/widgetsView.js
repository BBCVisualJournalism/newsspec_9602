define([
    'lib/news_special/bootstrap',
    'backbone',
    'views/minutesToEarn',
    'views/yearlySalary',
    'views/avgComparisons',
    'views/femaleComparison',
    'views/liveTicker'
], function (news, Backbone, MinutesToEarn, YearlySalaryView, AvgComparisons, FemaleComparison, LiveTickerView) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.container = options.container;
            this.userModel = options.userModel;
        },
        render: function () {
            this.container.empty();

            this.addMinutesToEarn();
            this.addYearlySalary();
            this.addAvgComparisons();
            this.addFemaleComparison();
            this.addLiveTicker();

            this.container.html(this.$el);
        },
        addMinutesToEarn: function () {
            var minutesToEarn = new MinutesToEarn({userModel: this.userModel});
            this.$el.append(minutesToEarn.render());
        },
        addYearlySalary: function () {
            var yearlySalaryView = new YearlySalaryView({userModel: this.userModel});
            this.$el.append(yearlySalaryView.render());
        },
        addAvgComparisons: function () {
            var avgComparisonsView = new AvgComparisons({userModel: this.userModel});
            this.$el.append(avgComparisonsView.render());
        },
        addFemaleComparison: function () {
            var femaleComparisonView = new FemaleComparison({userModel: this.userModel});
            this.$el.append(femaleComparisonView.render());
        },
        addLiveTicker: function () {
            var liveTickerView = new LiveTickerView({userModel: this.userModel});
            this.$el.append(liveTickerView.render());
        }

    });
});