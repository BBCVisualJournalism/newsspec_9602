define([
    'lib/news_special/bootstrap',
    'backbone',
    'views/liveTicker'
], function (news, Backbone, LiveTickerView) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.container = options.container;
            this.userModel = options.userModel;
        },
        render: function () {
            this.container.empty();
            this.addLiveTicker();
            this.container.html(this.$el);
        },
        addLiveTicker: function () {
            var liveTickerView = new LiveTickerView({userModel: this.userModel});
            this.$el.append(liveTickerView.render());
        }

    });
});