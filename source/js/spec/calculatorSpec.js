define(['models/calculator'],  function (Calculator) {

    describe('Calculator', function () {
        it('should throw an error if initilized', function () {
            expect(function () { new Calculator(); }).toThrow();
        });
        it('should calculate the time it would take for a footballer to earn a user salary', function () {
            expect(Calculator.playerMinutesToEarn(20000, 20000000)).toEqual(10.08);
            expect(Calculator.playerMinutesToEarn(5000, 5200000)).toEqual(9.692307692307693);
        });
        it('should calculate the years it would take for a user to earn a players salary', function () {
            expect(Calculator.userYearsToEarn(20000, 20000000)).toEqual(1000);
            expect(Calculator.userYearsToEarn(5000, 5200000)).toEqual(1040);
            expect(Calculator.userYearsToEarn(200, 5200000)).toEqual(26000);
        });
        it('should calculate the year the user wouldve had to start earning to earn the player wage', function () {
            expect(Calculator.startYearWith(1000)).toEqual(1015);
            expect(Calculator.startYearWith(1040)).toEqual(975);
            expect(Calculator.startYearWith(2015)).toEqual(0);
            expect(Calculator.startYearWith(2016)).toEqual('1 BC');
            expect(Calculator.startYearWith(3000)).toEqual('985 BC');
        });
        it('should compare a the users wage with a given wage', function () {
            expect(Calculator.compareWage(20000, 10000)).toEqual('2 times');
            expect(Calculator.compareWage(25000, 10000)).toEqual('2.5 times');
            expect(Calculator.compareWage(10000, 20000)).toEqual('50% of');
            expect(Calculator.compareWage(15001, 15000)).toEqual('about the same as');
            expect(Calculator.compareWage(5200000, 50000)).toEqual('104 times');
        });
        it('should calculate the number of shirts needed to be sold, to pay the footballers wages', function () {
            expect(Calculator.numberOfShirts(20000000, 50)).toEqual(400000);
            expect(Calculator.numberOfShirts(44000000, 35)).toEqual(1257143);
        });
        it('should calculate the amount earned by a within a given time span', function () {
            /* 5 minute time difference */
            expect(Calculator.amountEarned(40000, 1420817173750, 1420817473750)).toEqual('0.38');
        });
        it('should convert PPP into a user local currency', function () {
            expect(Calculator.pppToLocal(1.2, 5)).toEqual(6);
            expect(Calculator.pppToLocal(0.8, 10)).toEqual(8);
        });
    });

});