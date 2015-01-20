define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/playerStand.html'
], function (news, Backbone, htmlTemplate) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {

            this.order = options.order;

            this.allPlayers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        },
        render: function () {
            this.$el.html(this.template());
            this.selectedPlayerEl = this.$el.find('.the-special-one .footballer');
            this.frontRowPlayers = this.$el.find('.front-row .footballer');
            this.backRowPlayers = this.$el.find('.back-row .footballer');
            this.orderPlayers();

            return this.$el;
        },
        orderPlayers: function () {
            var playerOrder = _.clone(this.order);

            var playerNumber = playerOrder.shift();
            this.selectedPlayerEl.addClass('footballer-' + playerNumber);

            this.frontRowPlayers.each(function () {
                playerNumber = playerOrder.shift();
                $(this).addClass('footballer-' + playerNumber);
            });
            this.backRowPlayers.each(function () {
                playerNumber = playerOrder.shift();
                $(this).addClass('footballer-' + playerNumber);
            });

        },
        updatePlayer: function (selectedPlayer) {
            var self = this;

            var special = this.$el.find('.the-special-one .footballer');
            var newClass = 'footballer-' + selectedPlayer;

            var playerWrapper = this.$el.find('.players-wrapper');

            var playerAlreadyInStand = playerWrapper.find('.' + newClass);
            /* Check player isnt already in the stand */
            if (playerAlreadyInStand.length > 0) {
                _.each(this.allPlayers, function (replacementFootballer) {
                    /* Find a player thats not in the stand */
                    var replacementFootballerClass = 'footballer-' + replacementFootballer;
                    if (playerWrapper.find('.' + replacementFootballerClass).length === 0) {
                        playerAlreadyInStand.removeClass(newClass);
                        playerAlreadyInStand.addClass(replacementFootballerClass);
                        return false;
                    }
                });
            }

            special
                .css('opacity', 0)
                .attr('class', 'footballer ' + newClass);

            special.animate({
                opacity: 1
            }, 250);
        }
    });
});