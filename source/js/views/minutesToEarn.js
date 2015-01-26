define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/minutesToEarn.html',
    'models/calculator',
    'models/textFormat',
    'vocabs'
], function (news, Backbone, ShareTools, htmlTemplate, Calculator, TextFormat, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();
        },
        render: function () {
            var viewData = this.getViewData();
            this.setElement(this.template(viewData));

            this.pitchTextEl = this.$el.find('.minutes-to-earn--football-pitch-text');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.animateMinutes(viewData.minutesToEarn);
            this.updateShareTools(viewData.shareText);

            return this.$el;
        },
        getViewData: function () {
            var minutesToEarn = Calculator.playerMinutesToEarn(this.userModel.incomePPP(), this.player.get('annual_wage'));

            var textObj = this.getText(minutesToEarn);
            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{ANNUAL_SALARY}': this.player.getRoundedWage(),
                '{NUM_MINUTES}': TextFormat.formatNumber(minutesToEarn)
            };

            return {
                textMarkup: TextFormat.processText(textObj.text, replacements),
                shareText: TextFormat.processText(textObj.shareText, replacements),
                minutesToEarn: minutesToEarn
            };
        },
        getText: function (minutesToEarn) {
            var mainText = '',
                shareText = '';

            if (this.userModel.get('usingWorldAvg') && this.player.isManager()) {
                mainText = vocabs.minutes_earn_world_avg_manager;
                shareText = vocabs.share_minutes_earn_world_Avg;

            } else if (this.userModel.get('usingWorldAvg')) {
                mainText = vocabs.minutes_earn_world_avg;
                shareText = vocabs.share_minutes_earn_world_Avg;
                
            } else if (this.player.isManager()) {
                mainText = vocabs.minutes_earn_manager;
                shareText = vocabs.share_minutes_earn;
                
            } else if (minutesToEarn <= 1) {
                mainText = vocabs.minutes_earn_less_than_min;
                shareText = vocabs.share_minutes_earn_less_than_min;
            } else {
                mainText = vocabs.minutes_earn;
                shareText = vocabs.share_minutes_earn;
            }
            return {
                text: mainText,
                shareText: shareText
            };
        },
        updateShareTools: function (shareMessage) {
            new ShareTools(this.shareToolsEl, {
                message: shareMessage,
                hashtag: 'BBCNewsGraphics',
                template: 'dropdown'
            }, 'minutes-to-earn');

        },
        getMinuteText: function (minutes) {
            // if (minutes === 1) {
            //     return vocabs.time_minute;
            // } else {
            return TextFormat.processText(vocabs.time_x_minutes, {'{NUM_MINUTES}': TextFormat.formatNumber(minutes)});
            // }
        },
        animateMinutes: function (minutes) {
            var self = this;
            this.pitchTextEl.hide();

            /* Only animate if we have minutes to show */
            if (minutes >= 2) {
                this.pitchTextEl.text(self.getMinuteText(0));
                this.pitchTextEl.fadeIn(1500, function () {

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
                            self.pitchTextEl.text(self.getMinuteText(numberValue));
                        } else {
                            self.pitchTextEl.text(self.getMinuteText(minutes));
                            clearInterval(timeInterval);
                        }
                    }, refreshTime);
                });
            }
        }
    });
});