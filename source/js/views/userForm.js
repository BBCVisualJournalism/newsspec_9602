define([
    'lib/news_special/bootstrap',
    'backbone',
    'text!templates/userForm.html',
    'views/playerStand',
    'views/widgetsView',
    'vocabs'
], function (news, Backbone, htmlTemplate, PlayerStandView, WidgetsView, vocabs) {
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
            this.formEl = this.$el.find('.user-form');
            this.countryEl = this.$el.find('.user-form--input__country');
            this.playerEl = this.$el.find('.user-form--input__player');
            this.incomeEl = this.$el.find('.user-form--input__income');
            this.currencySymbolEl = this.$el.find('.user-form--currency-symbol');
            this.noPPPEl = this.$el.find('.input-section__no-income');
            this.incomeWrapperEl = this.$el.find('.income-section-wrapper');

            this.populateCountries();
            this.populatePlayers();

            var playerOrder = [9, 12, 13, 6, 2, 17, 15, 20, 23];

            this.playerStandView = new PlayerStandView({order: playerOrder});
            this.$el.find('.player-stand').html(this.playerStandView.render());

            this.changePlayer();

            this.options.container.html(this.$el);
        },
        events: {
            'change .user-form--input__country': 'countryChange',
            'change .user-form--input__player': 'changePlayer',
            'submit .user-form': 'submit'
        },
        populateCountries: function () {
            var self = this;

            var defaultCountryKey = this.countryEl.data('selectedCountry') || 'country_GBR',
                defaultCountryName = vocabs[defaultCountryKey];

            this.countryEl.empty();

            this.countries.each(function (country) {
                if (country.get('code') !== 'WRL_AVG') {
                    var selectedText = (defaultCountryName === country.get('name')) ? ' selected="selected"' : '',
                        countryToAdd = $('<option value="' + country.get('code') + '"' + selectedText + '>' + country.get('name') + '</option>');

                    self.countryEl.append(countryToAdd);
                }
            });

            this.countryChange();
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
        countryChange: function () {
            var country = this.countries.findWhere({code: this.countryEl.val()}),
                currencySymbol = country.get('currency_symbol');

            if (country.get('ppp')) {
                this.noPPPEl.hide();
                this.incomeWrapperEl.show();

                if (currencySymbol) {
                    this.currencySymbolEl.text(country.get('currency_symbol'));
                } else {
                    this.currencySymbolEl.text('');
                }
                
            } else {
                this.noPPPEl.show();
                this.incomeWrapperEl.hide();
            }
        },
        changePlayer: function () {
            this.playerStandView.updatePlayer(this.playerEl.val());
        },
        getUserInput: function () {
            var country = this.countries.findWhere({code: this.countryEl.val()}),
                worldAvg = this.countries.findWhere({code: 'WRL_AVG'}),
                incomeInputVal = this.incomeEl.val();

            /* If the we don't have wage data for the users country, or they enter a value less than 1, use the world avg */
            var isWorldAverage = (incomeInputVal < 1 || !country.get('ppp')),
                income = (!isWorldAverage) ? incomeInputVal : worldAvg.get('annual_wage');

            income = parseFloat(income, 10);

            return {
                'countryCode': this.countryEl.val(),
                'income': income,
                'playerId': parseInt(this.playerEl.val(), 10),
                'usingWorldAvg': isWorldAverage
            };
        },
        submit: function (e) {
            e.preventDefault();
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
            this.formEl.submit();
        }
    });
});