define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/minutesToEarn.html',
    'models/calculator',
    'models/textFormat'
], function (news, Backbone, htmlTemplate, Calculator, TextFormat) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();

            this.setElement(this.template());
        },
        render: function () {
            this.textEl = this.$el.find('.minutes-to-earn--text');
            this.pitchTextEl = this.$el.find('.minutes-to-earn--football-pitch-text');
            this.updateText();

            return this.$el;
        },
        updateText: function () {
            var topText = '{PLAYER_NAME} earns <strong>{PLAYER_WAGE} per year</strong>. It would only take him <strong>{MINUTES_TO_EARN} minutes</strong> on the pitch to earn your weekly salary.';
            
            var minutesToEarn = Calculator.playerMinutesToEarn(this.userModel.incomePPP(), this.player.get('annual_wage'));

            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{PLAYER_WAGE}': this.player.getRoundedWage(),
                '{MINUTES_TO_EARN}': TextFormat.formatNumber(minutesToEarn)
            };

            this.textEl.html(TextFormat.processText(topText, replacements));

            this.animateMinutes(minutesToEarn);
        },
        animateMinutes: function (minutes) {
            var self = this;

            this.pitchTextEl.hide();
            this.pitchTextEl.fadeIn(1000, function () {

                /* Speedbar determines how often the number increases */
                var speedVar = (minutes < 50) ? minutes : 50;

                var numberRollTime = 2000,
                    fadeInTime = this.statAnimationTime - numberRollTime;

                var count = 0,
                    refreshTime = numberRollTime / speedVar,
                    incrementValue = minutes / speedVar;
                
                var timeInterval = setInterval(function () {
                    count++;
                    var numberValue = Math.floor(incrementValue * count);
                    if (numberValue - incrementValue < minutes) {
                        self.pitchTextEl.text(TextFormat.formatNumber(numberValue) + ' MINUTES');
                    } else {
                        self.pitchTextEl.text(TextFormat.formatNumber(minutes) + ' MINUTES');
                        clearInterval(timeInterval);
                    }
                }, refreshTime);
            });
        }
    });
});