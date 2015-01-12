define([
    'lib/news_special/bootstrap',
    'backbone',
    'views/yearlySalary',
    'views/liveTicker'
], function (news, Backbone, YearlySalaryView, LiveTickerView) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.container = options.container;
            this.userModel = options.userModel;
        },
        render: function () {
            this.container.empty();
            this.addYearlySalary();
            this.addLiveTicker();
            this.container.html(this.$el.html());
        },
        addYearlySalary: function () {
            var yearlySalaryView = new YearlySalaryView({userModel: this.userModel});
            console.log(yearlySalaryView.render());
            this.$el.append(yearlySalaryView.render().html());
        },
        addLiveTicker: function () {
            var liveTickerView = new LiveTickerView({userModel: this.userModel});
            this.$el.append(liveTickerView.render().html());
        }

    });
});