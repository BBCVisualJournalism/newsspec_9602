#Data translator

This task translates data from excel spreadsheets, into JSON so that it can be used by the web app.

The data generated is automatically placed into the data folder in the app (**source/js/data/**)

#Setup

The excel-parse node module requires python and a couple of python modules. To install these run the following commands

````
brew install python
pip install argparse
pip install xlrd
````