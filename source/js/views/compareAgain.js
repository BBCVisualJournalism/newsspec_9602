define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/compareAgain.html',
    'views/playerStand',
    'vocabs'
], function (news, Backbone, htmlTemplate, PlayerStandView, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.options = options;

            this.userModel = options.userModel;
            this.players = this.userModel.players;

            _.bindAll(this, 'submit', 'changePlayer');
        },
        render: function () {
            this.$el.html(this.template({vocabs: vocabs}));

            /* INIT VARS */
            this.playerEl = this.$el.find('.compare-again--input__player');
            this.populatePlayers();

            var playerOrder = this.getPlayerOrder();
            this.playerEl.val(playerOrder[0]);
            this.playerStandView = new PlayerStandView({order: playerOrder});
            this.$el.find('.player-stand').html(this.playerStandView.render());

            return this.$el;
        },
        events: {
            'change .compare-again--input__player': 'changePlayer',
            'submit .compare-again': 'submit'
        },
        populatePlayers: function () {
            var self = this;

            var premierGroup = self.playerEl.find('.compare-again--player__premier'),
                intGroup = self.playerEl.find('.compare-again--player__int');

            premierGroup.empty();
            intGroup.empty();

            this.players.each(function (player) {
                if (player.get('id') !== null) {
                    var managerText = player.isManager() ? vocabs.label_select_manager + ' - ' : '',
                        clubText =  ' (' + managerText + player.get('club') + ')';

                    var groupEl = (player.get('league') === 'Premier League') ? premierGroup : intGroup;
                    groupEl.append($('<option value="' + player.get('id') + '">' + player.get('name') + clubText + '</option>'));
                }
            });
        },
        getPlayerOrder: function () {
            var playerOrder = [16, 14, 11, 7, 24, 1, 5, 18, 22];

            /* If user has selected the player that is shown, randomly choose a diffrent one */
            if (this.userModel.player().get('id') === playerOrder[0]) {
                var altPlayers = [2, 3, 4, 6, 8, 9, 10],
                    randomIndex = Math.floor(Math.random() * altPlayers.length + 1);
                playerOrder[0] = altPlayers[randomIndex];

            }

            return playerOrder;
        },
        changePlayer: function () {
            this.playerStandView.updatePlayer(this.playerEl.val());
        },
        submit: function (e) {
            e.preventDefault();
            var self = this;
            
            /*  Change top player and scroll to top */
            news.pubsub.emit('compareAgain', self.playerEl.val());
        }
    });
});