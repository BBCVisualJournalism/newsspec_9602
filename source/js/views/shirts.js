define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/shirts.html',
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

            this.graphicEl = this.$el.find('.shirts--graphic');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.loadGraphic();
            this.updateShareTools(viewData.shareText);

            return this.$el;
        },
        getViewData: function () {
            var shirtCount = Calculator.numberOfShirts(this.player.get('annual_wage'), this.player.get('shirt_price'));
            
            var textObj = this.getText();
            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{CLUB_NAME}': this.player.get('club'),
                '{NUM_SHIRTS}': TextFormat.formatNumber(shirtCount),
                '{PLAYER_SURNAME}': vocabs['shortname_' + this.player.get('surname').replace(' ', '_').toLowerCase()]
            };

            return {
                textMarkup: TextFormat.processText(textObj.text, replacements),
                shareText: TextFormat.processText(textObj.shareText, replacements)
            };
            
        },
        getText: function () {
            var mainText = '',
                shareText = '';

            if (this.player.isManager()) {
                mainText = vocabs.shirt_manager;
                shareText = vocabs.shirt_manager;
            } else {
                mainText = vocabs.shirt_player;
                shareText = vocabs.shirt_player;
            }
            return {
                text: mainText,
                shareText: shareText
            };
        },
        updateShareTools: function (shareMessage) {
            // new ShareTools(this.shareToolsEl, {
            //     message: shareMessage,
            //     hashtag: 'BBCNewsGraphics',
            //     template: 'dropdown'
            // }, 'shirts');
            this.shareToolsEl.hide();
        },
        loadGraphic: function () {
            var playerId = this.player.get('id');
            var playerName = this.player.get('name');
            this.graphicEl.html('<img src="' + TextFormat.staticURL + '/footballers/tshirts-' + playerId + '.png" alt="Illustration of ' + playerName + '\'s shirt" />');
        }
    });
});