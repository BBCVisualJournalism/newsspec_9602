define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/playerStand.html',
    'views/widgetsView'
], function (news, Backbone, htmlTemplate, WidgetsView) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.setElement(this.template());

            this.selectedPlayer = options.selectedPlayer;
        },
        render: function () {
            this.preloadedPlayers = this.$el.find('.preload .footballer');
            this.updatePlayer(this.selectedPlayer);

            return this.$el;
        },
        updatePlayer: function (selectedPlayer) {
            var newClass = 'footballer footballer-' + selectedPlayer;
        
            if ((this.preloadedPlayers.length) > 1) {
                var i = this.preloadedPlayers.length;
                while (i--) {
                    var thisPlayer = i;
                    if (this.$el.find('.footballer-' + thisPlayer).length === 1) {
                        console.log(this.$el.find('.players-wrapper .footballer-' + selectedPlayer));
                        var subClass = this.$el.find('.players-wrapper .footballer-' + selectedPlayer).attr('class');
                        subClass = subClass.replace('footballer-' + selectedPlayer, 'footballer-' + thisPlayer);
                        this.$el.find('.players-wrapper .footballer-' + selectedPlayer).attr('class', subClass);

                        break;
                    }
                }
            
            }
        
            var special = this.$el.find('.the-special-one div');
            special
                .css('opacity', 0)
                .attr('class', '')
                .attr('class', newClass);


            special.animate({
                opacity: 1
            }, 250);
        }
    });
});