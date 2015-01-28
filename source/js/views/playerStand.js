define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/playerStand.html',
    'models/textFormat'
], function (news, Backbone, htmlTemplate, TextFormat) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {

            this.order = options.order;
            this.players = options.userModel.players;

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
            var self = this;
            var playerOrder = _.clone(this.order);

            var playerNumber = playerOrder.shift();
            this.selectedPlayerEl.addClass('footballer-' + playerNumber);
            this.loadPlayer(this.selectedPlayerEl, playerNumber);

            this.frontRowPlayers.each(function () {
                var playerEl = $(this);
                playerNumber = playerOrder.shift();
                playerEl.addClass('footballer-' + playerNumber);
                self.loadPlayer(playerEl, playerNumber);
            });
            this.backRowPlayers.each(function () {
                var backPlayerEl = $(this);
                playerNumber = playerOrder.shift();
                backPlayerEl.addClass('footballer-' + playerNumber);
                self.loadPlayer(backPlayerEl, playerNumber);
            });

        },
        loadPlayer: function (elm, playerId) {
            var image = elm.find('.footballer-image');
            var player = this.players.get(playerId);
            image.attr('src', TextFormat.staticURL + '/footballers/footballers-' + playerId + '.png');
            image.attr('alt', 'Illustration of ' + player.get('name'));
            image.show();
        },
        updatePlayer: function (selectedPlayer) {
            var self = this;

            var special = this.$el.find('.the-special-one .footballer');
            var newClass = 'footballer-' + selectedPlayer;

            var playerWrapper = this.$el.find('.players-wrapper');

            var playerAlreadyInStand = playerWrapper.find('.' + newClass);
            /* Check player isnt already in the stand */
            if (playerAlreadyInStand.length > 0) {


                /* Loop over every footballer to find one that isn't in the stand */
                _.every(this.allPlayers, function (replacementFootballer) {
                    /* Find a player thats not in the stand */
                    var replacementFootballerClass = 'footballer-' + replacementFootballer;
                    if (playerWrapper.find('.' + replacementFootballerClass).length === 0) {
                        playerAlreadyInStand.removeClass(newClass);
                        playerAlreadyInStand.addClass(replacementFootballerClass);

                        self.loadPlayer(playerAlreadyInStand, replacementFootballer);
                        /* Break loop */
                        return false;
                    } else {
                        /* Continue looping */
                        return true;
                    }
                });


            }

            special
                .css('opacity', 0)
                .attr('class', 'footballer ' + newClass);

            this.loadPlayer(special, selectedPlayer);

            special.animate({
                opacity: 1
            }, 250);
        }
    });
});