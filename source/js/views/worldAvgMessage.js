define([
    'backbone',
    'text!templates/worldAvgMessage.html',
    'vocabs'
], function (Backbone, htmlTemplate, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        render: function () {
            this.setElement(this.template({vocabs: vocabs}));
            return this.$el;
        }
    });
});