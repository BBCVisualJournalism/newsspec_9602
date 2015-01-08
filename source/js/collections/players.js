define([
    'backbone',
    'models/player',
], function (Backbone, Player) {

    return Backbone.Collection.extend({
        model: Player
    });

});