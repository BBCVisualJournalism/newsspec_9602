define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/vendors/jquery.autocomplete',
    'text!templates/userForm.html',
    'views/playerStand',
    'views/widgetsView',
    'vocabs'
], function (news, Backbone, AutoComplete, htmlTemplate, PlayerStandView, WidgetsView, vocabs) {
    return Backbone.View.extend({
        template: _.template(htmlTemplate),

        initialize: function (options) {
            this.options = options;

            this.model = options.model;
            this.countries = this.model.countries;
            this.players = this.model.players;

            this.widgetsView = null;

            _.bindAll(this, 'submit', 'changePlayer', 'compareAgain');

            news.pubsub.on('compareAgain', this.compareAgain);
        },
        render: function () {
            this.$el.html(this.template({vocabs: vocabs}));

            /* INIT VARS */
            this.selectedCountry = null;
            this.formEl = this.$el.find('.user-form');
            this.countryEl = this.$el.find('.user-form--input__country');
            this.playerEl = this.$el.find('.user-form--input__player');
            this.incomeEl = this.$el.find('.user-form--input__income');
            this.currencySymbolEl = this.$el.find('.user-form--currency-symbol');
            this.noPPPEl = this.$el.find('.input-section__no-income');
            this.disclaimerEl = this.$el.find('.input-section__disclaimer');
            this.incomeWrapperEl = this.$el.find('.income-section-wrapper');

            this.populateCountries();
            this.populatePlayers();

            var playerOrder = [13, 12, 15, 22, 9, 2, 17, 20, 6];

            this.playerStandView = new PlayerStandView({order: playerOrder});
            this.$el.find('.player-stand').html(this.playerStandView.render());

            this.changePlayer();

            this.options.container.html(this.$el);
        },
        events: {
            'change .user-form--input__player': 'changePlayer',
            'submit .user-form': 'submit',
            'click .user-form--input__country': 'selectCountryText'
        },
        populateCountries: function () {
            var self = this;
            var searchSuggestionArray = [];
            this.countries.each(function (country) {
                if (country.get('code') !== 'WRL_AVG') {
                    var suggestion = {
                        value: country.get('name'),
                        country: country
                    };
                    searchSuggestionArray.push(suggestion);

                    if (country.get('name') === vocabs[vocabs.default_country]) {
                        self.countryChange({country: country, initialLoad: true});
                    }
                }
            });

            this.countryEl.autocomplete({
                lookup: searchSuggestionArray,
                autoSelectFirst: true,
                lookupLimit: 10,
                onSelect: self.countryChange.bind(this)
            });
        },
        populatePlayers: function () {
            var self = this;
            var defaultPlayer = vocabs[this.playerEl.data('selectedPlayer')] || vocabs.player_wayne_rooney;

            var premierGroup = self.playerEl.find('.user-form--player__premier'),
                intGroup = self.playerEl.find('.user-form--player__int');

            premierGroup.empty();
            intGroup.empty();

            this.players.each(function (player) {
                if (player.get('id') !== null) {
                    var selectedText = (defaultPlayer === player.get('name')) ? ' selected="selected"' : '';

                    var managerText = player.isManager() ? vocabs.label_select_manager + ' - ' : '',
                        clubText =  ' (' + managerText + player.get('club') + ')';

                    var groupEl = (player.isInternational()) ? intGroup : premierGroup;
                    groupEl.append($('<option value="' + player.get('id') + '"' + selectedText + '>' + player.get('name') + clubText + '</option>'));
                }
            });
        },
        countryChange: function (selectedCountry) {
            this.selectedCountry = selectedCountry.country;
            this.countryEl.val(this.selectedCountry.get('name'));

            var currencySymbol = this.selectedCountry.get('currency_symbol');

            if (this.selectedCountry.get('ppp')) {
                this.noPPPEl.hide();
                this.disclaimerEl.show();
                this.incomeWrapperEl.show();

                if (currencySymbol) {
                    this.currencySymbolEl.text(this.selectedCountry.get('currency_symbol'));
                } else {
                    this.currencySymbolEl.text('');
                }
                
            } else {
                this.noPPPEl.show();
                this.disclaimerEl.hide();
                this.incomeWrapperEl.hide();
            }

            /* If this wasn't called by the page load, iStats the users country */
            if (!selectedCountry.initialLoad) {
                news.pubsub.emit('istats', ['country-change', 'newsspec-interaction', this.selectedCountry.get('code')]);
            }
        },
        changePlayer: function () {
            this.playerStandView.updatePlayer(this.playerEl.val());
        },
        getUserInput: function () {
            var worldAvg = this.countries.findWhere({code: 'WRL_AVG'}),
                incomeInputVal = this.incomeEl.val();

            /* Check if second to last character is a comma or fullstop - to signify a decimal point, replace decimal point with {DEC} */
            var income = incomeInputVal.replace(/(.*)[,\.](\d{2})\b/g, '$1{DEC}$2');
            /* Remove commas and spaces from user input, then add decimal point back in*/
            income = income.replace(/[, \.]/g, '').replace('{DEC}', '.');

            var isWorldAverage = (!this.selectedCountry.get('ppp') || ((income < 1) && $.isNumeric(income)));
            income = (!isWorldAverage) ? income : worldAvg.get('annual_wage');

            if (!isWorldAverage) {
                this.incomeEl.val(income);
            }

            return {
                'country': this.selectedCountry,
                'countryInput': this.countryEl.val(),
                'income': income,
                'playerId': parseInt(this.playerEl.val(), 10),
                'usingWorldAvg': isWorldAverage
            };
        },
        submit: function (e) {
            this.resetValidationErrors();

            this.model.set(this.getUserInput(), {validate : true});
            if (this.model.validationError) {
                this.showValidationErrors(this.model.validationError);
            } else {
                /* Remove previous view from memory */
                if (this.widgetsView !== null)  {
                    this.widgetsView.destroyAll();
                }

                this.widgetsView = new WidgetsView({
                    userModel: this.model,
                    container: $('.results-widgets')
                });
                this.widgetsView.render();

                _.defer(function () {
                    news.pubsub.emit('window:scrollTo', [$('.results-widgets').offset().top - 20, 600]);
                });

                if (!e.compareAgain) {
                    news.pubsub.emit('istats', ['compare-player', 'newsspec-interaction', this.model.player().get('id')]);
                }
            }
            return false;
        },
        showValidationErrors: function (errors) {
            var self = this;

            _.each(errors, function (error) {
                self.$el.find('.user-form--input__' + error.name).addClass('user-form--input__error');
            });
        },
        resetValidationErrors: function () {
            this.countryEl.removeClass('user-form--input__error');
            this.incomeEl.removeClass('user-form--input__error');
        },
        compareAgain: function (player) {
            this.playerEl.val(player).change();
            this.submit({compareAgain: true});
        },
        selectCountryText: function () {

        }
    });
});