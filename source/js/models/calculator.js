define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function () {
            throw new Error('This model should not be initialised, as all methods are class methods.');
        }
    }, {
        playerMinutesToEarn: function (userYearIncomePPP, playerYearIncomePPP) {
            return Math.round(userYearIncomePPP / playerYearIncomePPP * 10080);
        },
        userYearsToEarn: function (userYearIncomePPP, playerYearIncomePPP) {
            return Math.round(playerYearIncomePPP / userYearIncomePPP);
        },
        startYearWith: function (yearsAgo) {
            var currentYear = new Date().getFullYear(),
                startYear = currentYear - yearsAgo;

            return (startYear >= 0) ? startYear : Math.abs(startYear) + ' BC';
        },
        compareWage: function (compareWageX, compareWageY) {
            var comparison = compareWageX / compareWageY,
                roundedComparison = parseFloat(comparison.toFixed(1), 10);
            if (roundedComparison === 1) {
                return 'about the same as';
            } else if (comparison > 1) {
                /* If number after decimal point is 0, show the whole number instead */
                var wholeNumber = Math.round(roundedComparison);
                roundedComparison = (wholeNumber === roundedComparison || roundedComparison > 30) ? wholeNumber : roundedComparison;
                return roundedComparison + ' times';
            } else {
                return Math.round(comparison * 100) + '% of';
            }
        },
        numberOfShirts: function (playerYearlyWages, costOfShirt) {
            return Math.round(playerYearlyWages / costOfShirt);
        },
        /* 
            @param startTime time in milliseconds that the counter started
            @param endTime time in milliseconds (now)
        */
        amountEarned: function (annualWage, startTime, endTime) {
            var runtime = endTime - startTime;
            var amountEarnedPerMS = annualWage / 31557600000;
            return (runtime * amountEarnedPerMS).toFixed(2);
        },
        pppToLocal: function (pppConv, pppValue) {
            return pppConv * pppValue;
        },
        formatNumber: function (num) {
            if (true) {
                return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            } else {
                return num;
            }
        }
    });
});