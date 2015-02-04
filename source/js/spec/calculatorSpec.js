define(['models/calculator', 'spec/features/fixtureData'],  function (Calculator, fixtureData) {
    function asNumber(val) {
        return parseFloat(val);
    }

    describe('Calculator', function () {

        it('should throw an error if initilized', function () {
            expect(function () { new Calculator(); }).toThrow();
        });

        describe('playerMinutesToEarn()', function () {
            it('should calculate the time it would take for a footballer to earn a user salary', function () {
                expect(Calculator.playerMinutesToEarn(20000, 20000000)).toEqual(10);
                expect(Calculator.playerMinutesToEarn(5000, 5200000)).toEqual(10);
            });
            it('should return a result close to the spreadsheet model result', function () {
                for (var scenario in fixtureData) {
                    var o = fixtureData[scenario],
                        expected = Math.round(asNumber(o.Minutes_for_player_to_earn_your_weekly_salary)),
                        userSalaryPPP = asNumber(o.User_annual_salary_in_ppp),
                        playerSalaryPPP = asNumber(o.Player_annual_salary_in_ppp);
                    
                    expect(Calculator.playerMinutesToEarn(userSalaryPPP, playerSalaryPPP)).toEqual(expected);
                }
            });
        });
        
        describe('userYearsToEarn()', function () {
            it('should calculate the years it would take for a user to earn a players salary', function () {
                expect(Calculator.userYearsToEarn(20000, 20000000)).toEqual(1000);
                expect(Calculator.userYearsToEarn(5000, 5200000)).toEqual(1040);
                expect(Calculator.userYearsToEarn(200, 5200000)).toEqual(26000);
            });
            it('should return a result close to the spreadsheet model result', function () {
                for (var scenario in fixtureData) {
                    var o = fixtureData[scenario],
                        expected = Math.round(asNumber(o.User_years_to_earn_player_salary)),
                        userSalaryPPP = asNumber(o.User_annual_salary_in_ppp),
                        playerSalaryPPP = asNumber(o.Player_annual_salary_in_ppp);
                    
                    expect(Calculator.userYearsToEarn(userSalaryPPP, playerSalaryPPP)).toEqual(expected);
                }
            });
        });

        describe('startYearWith()', function () {
            it('should calculate the year the user wouldve had to start earning to earn the player wage', function () {
                expect(Calculator.startYearWith(1000)).toEqual({year: 1015, isBC: false});
                expect(Calculator.startYearWith(1040)).toEqual({year: 975, isBC: false});
                expect(Calculator.startYearWith(2015)).toEqual({year: 0, isBC: false});
                expect(Calculator.startYearWith(2016)).toEqual({year: 1, isBC: true});
                expect(Calculator.startYearWith(3000)).toEqual({year: 985, isBC: true});
            });
            it('should return a result close to the spreadsheet model result', function () {
                for (var scenario in fixtureData) {
                    var o = fixtureData[scenario],
                        expected = Math.floor(asNumber(o.When_user_would_have_to_start)),
                        yearsAgo = asNumber(o.User_years_to_earn_player_salary),
                        result = Calculator.startYearWith(yearsAgo);

                    expect(result.year).toEqual(expected);
                }
            });
        });

        describe('compareWage()', function () {
            it('should compare a the users wage with a given wage', function () {
                expect(Calculator.compareWage(20000, 10000, true)).toEqual('2 times');
                expect(Calculator.compareWage(25000, 10000, true)).toEqual('2.5 times');
                expect(Calculator.compareWage(5200000, 50000, true)).toEqual('104 times');
            });
            it('should compare return 50% of when user salary is half a player salary??', function () {
                expect(Calculator.compareWage(10000, 20000, true)).toEqual('50% of');
            });
            it('should flag appropriately when salary is closer to player wage', function () {
                expect(Calculator.compareWage(15001, 15000, true)).toEqual('about the same as');
            });
            it('should return the quotient of player wage and user salary??', function () {
                expect(Calculator.compareWage(5200000, 50000, false)).toEqual(10400);
            });

            it('should return a result close to the spreadsheet model result...world average', function () {
                for (var scenario in fixtureData) {
                    var o = fixtureData[scenario],
                        expected = Math.round(asNumber(o.How_many_times_the_world_avg_wage_you_earn) * 10) / 10,
                        userSalaryPPP = asNumber(o.User_annual_salary_in_ppp),
                        playerSalaryPPP = asNumber(o.Player_annual_salary_in_ppp),

                    result = Calculator.compareWage(userSalaryPPP, 19200, true);
                    expect(result).toBe(expected + ' times');
                }
            });

            it('should return a result close to the spreadsheet model result...country average', function () {
                for (var scenario in fixtureData) {
                    var o = fixtureData[scenario],
                        userSalaryPPP = asNumber(o.User_annual_salary_in_ppp),
                        countryAvg = asNumber(o.Country_average_salary),

                        result = Calculator.compareWage(userSalaryPPP, countryAvg, true);
                    if (countryAvg) {
                        if (userSalaryPPP > countryAvg) {
                            expected = Math.round(asNumber(o.How_many_times_the_country_avg_wage_you_earn) * 10) / 10;
                            expect(result).toBe(expected + ' times');
                        } else if (userSalaryPPP < countryAvg) {
                            expected = Math.round(asNumber(o.How_many_times_the_country_avg_wage_you_earn) * 100) / 100;
                            expect(result).toBe((expected * 100) + '% of');
                        }
                        
                    }
                }
            });
        });

        describe('numberOfShirts()', function () {
            it('should calculate the number of shirts needed to be sold, to pay the footballers wages', function () {
                expect(Calculator.numberOfShirts(20000000, 50)).toEqual(400000);
                expect(Calculator.numberOfShirts(44000000, 35)).toEqual(1257143);
            });
        });

        describe('amountEarned()', function () {
            it('should calculate the amount earned for a given time span', function () {
                /* 5 minute time difference */
                expect(Calculator.amountEarned(40000, 1420817173750, 1420817473750)).toEqual('0.38');
            });
            it('should calculate the amount earned within a minute time span ', function () {
                expect(Calculator.amountEarned(25413041, 60000, 120000)).toBeCloseTo(48.48337, 0);
                
            });
        });

        describe('pppToLocal()', function () {
            it('should convert PPP into a user local currency', function () {
                expect(Calculator.pppToLocal(1.2, 5)).toEqual(6);
                expect(Calculator.pppToLocal(0.8, 10)).toEqual(8);
            });
        });
    });

});