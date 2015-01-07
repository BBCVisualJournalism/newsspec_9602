define([
    'lib/news_special/bootstrap', 
    'backbone', 
    'text!templates/userForm.html', 
], function (news, Backbone, htmlTemplate){
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.model = options.model;
            this.options = options;

            _.bindAll(this, 'submit');
        },
        render: function () {
            this.$el.html(this.template());

            this.countryEl = this.$el.find('.user-form--country');
            this.incomeEl = this.$el.find('.user-form--income');

            this.populateCountries();
            this.options.container.html(this.$el);


        },
        populateCountries: function() {

        },
        events: {
            'submit .user-form': 'submit'
        },
        submit: function (e) {
            e.preventDefault();
            var userInput = {
                'country': this.countryEl.val(),
                'income': this.incomeEl.val()
            };

            this.model.set(userInput, {validate : true});
            if (this.model.validationError) {
                console.log(this.model.validationError);
            }else{
                console.log('Pass');
            }
        },
        submitSuccess: function () {
            alert('Success');
        },
        submitError: function () {
            alert('Error');
        }
    });
});