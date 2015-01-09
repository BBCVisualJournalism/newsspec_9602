define(['models/calculator'],  function (Calculator) {

    describe('Calculator', function () {
        it('should throw an error if initilized', function () {
            expect(function () { new Calculator(); }).toThrow();
        });
    });

});