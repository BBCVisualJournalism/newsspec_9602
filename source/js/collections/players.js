define([
    'backbone',
    'models/player',
    'vocabs'
], function (Backbone, Player, vocabs) {
	return Backbone.Collection.extend({
		model: Player,
		parse: function (players) {
			_.each(players, function (player) {
				player.name = vocabs[player.name];
				player.club = vocabs[player.club];
			});

			return players;
		},
		comparator: function (player) {
            return player.get('club') + player.get('name');
        }
    });
});