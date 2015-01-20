define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/news_special/share_tools/controller',
    'text!templates/shirts.html',
    'models/calculator',
    'models/textFormat'
], function (news, Backbone, ShareTools, htmlTemplate, Calculator, TextFormat) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.userModel = options.userModel;
            this.player = this.userModel.player();

            this.setElement(this.template());
        },
        render: function () {
            this.textEl = this.$el.find('.shirts--text');
            this.graphicEl = this.$el.find('.shirts--graphic');
            this.shareToolsEl = this.$el.find('.share-tools-holder');

            this.updateText();
            this.loadGraphic();

            return this.$el;
        },
        updateText: function () {
            var text = '{PLAYER_NAME}\'s annual wage is equivalent to the cost of <strong>{SHIRT_COUNT} {PLAYER_TEAM} replica shirts</strong> with ‘{PLAYER_SURNAME}’ printed on the back.',
                shareText = '{PLAYER_NAME}\'s annual wage is equivalent to the cost of {SHIRT_COUNT} {PLAYER_TEAM} replica shirts with ‘{PLAYER_SURNAME}’ printed on the back.';
            
            var shirtCount = Calculator.numberOfShirts(this.player.get('annual_wage'), this.player.get('shirt_price'));

            var replacements = {
                '{PLAYER_NAME}': this.player.get('name'),
                '{PLAYER_TEAM}': this.player.get('club'),
                '{SHIRT_COUNT}': TextFormat.formatNumber(shirtCount),
                '{PLAYER_SURNAME}': this.player.get('surname')
            };

            this.textEl.html(TextFormat.processText(text, replacements));
            this.updateShareTools(TextFormat.processText(shareText, replacements));
        },
        updateShareTools: function (shareMessage) {
            new ShareTools(this.shareToolsEl, {
                message: shareMessage,
                hashtag: 'BBCNewsGraphics',
                template: 'dropdown'
            }, 'shirts');
        },
        loadGraphic: function () {
            this.graphicEl.load('img/svg/tshirts-' + this.player.get('id') + '.svg', null);
        }
    });
});