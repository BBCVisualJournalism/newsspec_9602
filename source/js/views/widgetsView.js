define([
    'lib/news_special/bootstrap',
    'backbone',
    'views/worldAvgMessage',
    'views/minutesToEarn',
    'views/yearlySalary',
    'views/avgComparisons',
    'views/shirts',
    'views/femaleComparison',
    'views/liveTicker',
    'views/compareAgain'
], function (news, Backbone, WorldAvgMessage, MinutesToEarn, YearlySalaryView, AvgComparisons, Shirts, FemaleComparison, LiveTickerView, CompareAgainView) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.container = options.container;
            this.userModel = options.userModel;
        },
        render: function () {
            this.container.empty();

            this.addWorldAvgMessage();
            this.addMinutesToEarn();
            this.addYearlySalary();
            this.addAvgComparisons();
            this.addShirts();
            this.addFemaleComparison();
            this.addLiveTicker();
            this.addCompareAgain();

            this.container.html(this.$el);
        },
        addWorldAvgMessage: function () {
            if (this.userModel.get('usingWorldAvg')) {
                var worldAvgMessage = new WorldAvgMessage();
                this.$el.append(worldAvgMessage.render());
            }
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
            if (!this.userModel.get('usingWorldAvg')) {
                var avgComparisonsView = new AvgComparisons({userModel: this.userModel});
                this.$el.append(avgComparisonsView.render());
            }
        },
        addShirts: function () {
            var shirtsView = new Shirts({userModel: this.userModel});
            this.$el.append(shirtsView.render());
        },
        addFemaleComparison: function () {
            var femaleComparisonView = new FemaleComparison({userModel: this.userModel});
            this.$el.append(femaleComparisonView.render());
        },
        addLiveTicker: function () {
            if (!this.userModel.get('usingWorldAvg')) {
                this.liveTickerView = new LiveTickerView({userModel: this.userModel});
                this.$el.append(this.liveTickerView.render());
            }
        },
        addCompareAgain: function () {
            var compareAgainView = new CompareAgainView({userModel: this.userModel});
            this.$el.append(compareAgainView.render());
        },
        destroyAll: function () {
            news.pubsub.emit('sharetools:unbind');
            if (this.liveTickerView) {
                this.liveTickerView.destroy();
                delete this.liveTickerView;
            }
            this.unbind();
            this.remove();
        }

    });
});