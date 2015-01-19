define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/playerStand.html'
], function (news, Backbone, htmlTemplate) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {

            this.order = options.order;
        },
        render: function () {
            this.$el.html(this.template());
            this.preloadedPlayers = this.$el.find('.preload .footballer');
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
                this.preloadedPlayers.each(function () {
                    var replacementFootballer = $(this).attr('class').split(' ').pop();
                    /* Find a player thats not in the stand */
                    //console.log(playerWrapper.find('.' + replacementFootballer));
                    if (playerWrapper.find('.' + replacementFootballer).length === 0) {
                        playerAlreadyInStand.removeClass(newClass);
                        playerAlreadyInStand.addClass(replacementFootballer);
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