define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/barChart.html'
], function (news, Backbone, htmlTemplate) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.data = options.data;
            this.addBarWidths();
            this.setElement(this.template({data: this.data}));
            _.bindAll(this, 'setLabelWidth');
        },
        addBarWidths: function () {
            /* Find max value */
            var maxValue = 0;
            for (var dataItem in this.data) {
                var bar = this.data[dataItem];
                if (bar.value > maxValue) {
                    maxValue = bar.value;
                }
            }

            /* Calcualte bar width percentages from max value */
            for (var item in this.data) {
                this.data[item].barWidth = Math.round(this.data[item].value / maxValue * 100);
            }
        },
        render: function () {
            this.chartLabelsEl = this.$el.find('.bar-chart--labels');
            this.chartAxisEl = this.$el.find('.bar-chart--axis');
            this.chartBarsEl = this.$el.find('.bar-chart--bars');
            this.chartLabelEls = this.$el.find('.bar-chart--label');

            /* Defer to allow drawing to DOM, before we check the widths */
            _.defer(this.setLabelWidth);

            return this.$el;
        },
        setLabelWidth: function () {
            var maxElWidth = 0;
            this.chartLabelEls.each(function () {
                var elWidth = $(this).width();
                if (elWidth > maxElWidth) {
                    maxElWidth = elWidth;
                }
            });

            var labelsWidth = maxElWidth + 30;
            this.chartLabelsEl.css('width', (labelsWidth)  + 'px');
            this.chartAxisEl.css('left', (labelsWidth - 3) + 'px');
            this.chartBarsEl.css('margin-left', (labelsWidth) + 'px');
        }
    });
});