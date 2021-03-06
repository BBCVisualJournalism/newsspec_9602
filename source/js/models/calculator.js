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

            return {
                year: Math.floor(Math.abs(startYear)),
                isBC: (startYear < 0)
            };
        },
        compareWage: function (compareWageX, compareWageY, isEnglish) {
            var comparison = compareWageX / compareWageY,
                roundedComparison = parseFloat(comparison.toFixed(1), 10);

            /* If languages return just the percent */
            if (!isEnglish) {
                return Math.round(comparison * 100);

           /* If difference small, return about the same as */
            } else if (roundedComparison === 1) {
                return 'about the same as';

            /* If greater than 0, return amount of times greater */
            } else if (comparison > 1) {
                return this.timesMore(compareWageX, compareWageY) + ' times';

            /* If less than 0, return amount of percentage */
            } else {
                return Math.round(comparison * 100) + '% of';
            }
        },
        timesMore: function (compareWageX, compareWageY) {
            var comparison = compareWageX / compareWageY,
                timesMore = parseFloat(comparison.toFixed(1), 10);
 
            /* If number after decimal point is 0, show the whole number instead */
            var wholeNumber = Math.round(timesMore);
            timesMore = (wholeNumber === timesMore || timesMore > 30) ? wholeNumber : timesMore;

            return timesMore;
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
        }
    });
});