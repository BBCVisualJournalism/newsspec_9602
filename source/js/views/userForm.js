define([
    'lib/news_special/bootstrap', 
    'backbone', 
    'text!templates/userForm.html'
], function (news, Backbone, htmlTemplate){
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.options = options;

            this.model = options.model;
            this.countries = options.countries;

            _.bindAll(this, 'submit');
        },
        render: function () {
            this.$el.html(this.template());

            /* INIT VARS */
            this.countryEl = this.$el.find('.user-form--country');
            this.incomeEl = this.$el.find('.user-form--income');
            this.currencySymbolEl = this.$el.find('.user-form--currency-symbol');

            this.populateCountries();
            this.options.container.html(this.$el);
        },
        populateCountries: function() {
            var self = this;

            var defaultCountry = this.countryEl.data('selectedCountry') || 'UK';
            this.countryEl.empty();

            this.countries.each(function (country) {
                var selectedText = (defaultCountry === country.get('code')) ? ' selected="selected"' : '',
                    countryToAdd = $('<option value="' + country.get('code') + '"' + selectedText + '>' + country.get('name') + '</option>');

                self.countryEl.append(countryToAdd);
            });

            this.updateCurrencySymbol();
        },
        events: {
            'change .user-form--country': 'updateCurrencySymbol',
            'submit .user-form': 'submit',
        },
        updateCurrencySymbol: function () {
            var country = this.countries.findWhere({code: this.countryEl.val()}),
                currencySymbol = country.get('currency_symbol');

            if (currencySymbol) {
                this.currencySymbolEl.text(country.get('currency_symbol'));
            } else {
                this.currencySymbolEl.text('');
            }
        },
        submit: function (e) {
            e.preventDefault();
            this.resetValidationErrors();

            var userInput = {
                'country': this.countryEl.val(),
                'income': this.incomeEl.val()
            };

            this.model.set(userInput, {validate : true});
            if (this.model.validationError) {
                this.showValidationErrors(this.model.validationError);
            }else{
                console.log('Pass');
            }
            console.log(this.model);
        },
        showValidationErrors: function (errors) {
            var self = this;

            _.each(errors, function (error) {
                self.$el.find('.user-form--' + error.name).addClass('user-form--input__error');
            });
        },
        resetValidationErrors: function () {
            this.countryEl.removeClass('user-form--input__error');
            this.incomeEl.removeClass('user-form--input__error');
        }
    });
});