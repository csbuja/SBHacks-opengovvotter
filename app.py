# from dataBaseInteraction import getEngine, encryptCampaignId,decryptCampaignId, decryptCompanyname, encryptCompanyname, getDataSource, rowExists
# from sqlalchemy import engine, create_engine
from flask import Flask, request, render_template
from databaseinteraction import getEngine, rowExists
import json
app = Flask(__name__)
engine = getEngine()

def splitStringByUpperCase(s):
    arr = []
    if not len(s):
        return s

    for i,val in enumerate(s):
        if i==0 or s[i-1] == "-":
            arr.append(val.upper())
        elif val == "-":
            arr.append(" ")
        else:
            arr.append(val)
    return ''.join(arr)


@app.route('/')
def root():
    connection = engine.connect()
    cities = []
    result = engine.execute('SELECT cityname FROM City') 
    for row in result:
        cities.append({'cityname' : splitStringByUpperCase( row['cityname']),
                       'encodedcityname' :row['cityname']
        });
    connection.close()
    return render_template('root.html',cities=cities)

@app.route('/vote/<cityname>')
def vote(cityname=None):
    if cityname == None:
        return render_template('404.html'), 404
    connection = engine.connect()
    result = engine.execute('SELECT * FROM Budget b WHERE b.cityname=\'%s\' AND b.fromCity=1' % cityname) 
    toReturn = []
    for row in result:
        toReturn.append(row['spenndingvariables'])
    connection.close()
    encodedcityname = cityname
    cityname = splitStringByUpperCase(cityname)
    return render_template('vote.html',citybudget=toReturn, cityname=cityname, encodedcityname=encodedcityname)

@app.route('/vote',methods=['POST'])
def postVote():
    vote =  request.form['vote']
    cityname = request.form['cityname']
    connection = engine.connect()
    if rowExists(engine,cityname,"City","cityname"):
        engine.execute('INSERT Budget(cityname,fromCity,spenndingvariables) VALUES (\'%s\',0,\'%s\')' % (cityname,vote))
    connection.close()
    return json.dumps({})


@app.route('/voteresults/<cityname>')
def voteresults(cityname=None):
    if cityname == None:
        return render_template('404.html'), 404
    connection = engine.connect()
    result = engine.execute('SELECT * FROM Budget b WHERE b.cityname=\'%s\'' % cityname) 
    cityBudget = []
    voteBudget = []
    for row in result:
        if row['fromCity']:
            cityBudget.append(row['spenndingvariables'])
        else:
            voteBudget.append(row['spenndingvariables'])
    connection.close()
    encodedcityname = cityname
    cityname = splitStringByUpperCase(cityname)
    return render_template('voteresults.html',citybudget=cityBudget,voteBudget=voteBudget, cityname=cityname, encodedcityname=encodedcityname)

if __name__ == '__main__':
    app.run(debug=True,port=80)

