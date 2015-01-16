(function () {

	var excelParser = require('excel-parser'), 
		fs = require('fs');

	var parentProjectDirectoryPath = __dirname.split('/');
	parentProjectDirectoryPath.pop();
	parentProjectDirectoryPath = parentProjectDirectoryPath.join('/');

	/**********************
		* Check the excel file path has been passed
	**********************/
	if (process.argv[2]) {
		parseRegions(process.argv[2], function () {
			parsePlayers(process.argv[2]);
		});
	}
	else {
		console.error('Error:\n-----\nTo use this task parse the path to the csv file as an argument.\n\nExample:\n-------\nnode jihadiMonthDataTask.js ~/Desktop/data.csv');
		return 1;
	}

	function parseRegions(spreadsheet, doneCallback) {
		excelParser.parse({
			inFile: spreadsheet,
			worksheet: 1,
			skipEmpty: false
		},
		function(err, regions){
			if(err) {
				console.error(err);
				return 1;
			}

			var regionsArray = [];

			for (var i = 1; i < regions.length; i++) {
				var region = regions[i];
				regionsArray.push({
					'name': region[0],
					'code': region[1],
					'currency_symbol': region[2],
					'ppp': region[3],
					'annual_wage': region[9]
				});

			}
			writeToDataFolder('countries.js', regionsArray);
			
			doneCallback();
		});
	}

	function parsePlayers(spreadsheet) {
		excelParser.parse({
			inFile: spreadsheet,
			worksheet: 2,
			skipEmpty: false
		},
		function(err, players){
			if(err) {
				console.error(err);
				return 1;
			}

			var playersArray = [];

			for (var i = 1; i < players.length; i++) {
				var player = players[i];
				playersArray.push({
					'id': parseInt(player[0], 10),
					'name': player[1],
					'club': player[2],
					'country': player[5],
					'league': player[4],
					'annual_wage': player[10],
					'shirt_price': player[15],
					'surname': player[17]
				});

			}
			writeToDataFolder('players.js', playersArray);
		});
	}

	function writeToDataFolder(filename, object) {
		var path = 'source/js/data/' + filename;

		var outputString = 'define(function(){return ';
		outputString = outputString + JSON.stringify(object);
		outputString = outputString + ';});';

		fs.writeFile(parentProjectDirectoryPath + '/'+ path, outputString, {encoding:'utf8'}, function (err) {
			if (err) {
				throw err;
			}
			console.info('saved the ' + filename + ' data file');
		});

	}
		
}());