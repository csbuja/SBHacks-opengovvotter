# from dataBaseInteraction import getEngine, encryptCampaignId,decryptCampaignId, decryptCompanyname, encryptCompanyname, getDataSource, rowExists
# from sqlalchemy import engine, create_engine
from flask import Flask, request, render_template
from databaseinteraction import getEngine
import json
app = Flask(__name__)
engine = getEngine()

def splitStringByUpperCase(s):
	arr = []
	for i,val in enumerate(s):
		if val.upper() == val and i!=0:
			arr.append(' ')
		arr.append(val)
	return ''.join(arr)


@app.route('/vote/<cityname>')
def vote(cityname=None):
	if cityname == None:
		return json.dumps([])
	connection = engine.connect()
	result = engine.execute('SELECT * FROM Budget b WHERE b.cityname=\'%s\' AND b.fromCity=1' % cityname) 
	connection.close()
	toReturn = []
	for row in result:
		toReturn.append(row['spenndingvariables'])
	return render_template('vote.html',citybudget=toReturn)

@app.route('/voteresults/<cityname>')
def voteresults(cityname=None):
	if cityname == None:
		return json.dumps([])
	connection = engine.connect()
	result = engine.execute('SELECT * FROM Budget b WHERE b.cityname=\'%s\'' % cityname) 
	connection.close()
	cityBudget = []
	voteBudget = []
	for row in result:
		if row['fromCity']:
			cityBudget.append(row['spenndingvariables'])
		else:
			voteBudget.append(row['spenndingvariables'])
	return render_template('voteresults.html',citybudget=cityBudget,voteBudget=voteBudget)

if __name__ == '__main__':
    app.run(debug=True)

