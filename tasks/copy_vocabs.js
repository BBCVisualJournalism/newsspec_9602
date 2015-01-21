module.exports = function (grunt) {
    grunt.registerTask('copyVocabs', 'Copies each service into the "tmp" directory, making it ready to be deployed', function () {
        
        var env    = grunt.config.get('env'),
            config = grunt.config.get('config'),
            fs     = require('fs'),
            vocabs = [].concat(config.services.others).concat(config.services.default);

        vocabs.forEach(function (vocab) {
            var vocabsJson = grunt.file.read('source/vocabs/' + vocab +'.json', {encoding:'utf8'}),
                vocabsAMD = 'define(function(){ return ' + vocabsJson + '});';
            grunt.file.write('content/' + config.services.default + '/js/vocabs/' + vocab + '.js', vocabsAMD, {encoding:'utf8'});
        });
    });
};