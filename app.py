# from dataBaseInteraction import getEngine, encryptCampaignId,decryptCampaignId, decryptCompanyname, encryptCompanyname, getDataSource, rowExists
# from sqlalchemy import engine, create_engine
from flask import Flask, request, render_template
from databaseinteraction import getEngine, rowExists
import json



app = Flask(__name__)
engine = getEngine()
engine.connect()

import logging
from logging import FileHandler
file_handler = FileHandler("log.txt")
file_handler.setLevel(logging.WARNING)
app.logger.addHandler(file_handler)

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

def decode(s):
    o = {}
    arr = s.split('##??##')
    i=0
    while i < len(arr):
        labelValTuple = arr[i].split('####')
        o[labelValTuple[0]] = int(labelValTuple[1])
        i+=1
    return o


@app.route('/')
def root():
    cities = []
    result = engine.execute('SELECT cityname FROM City') 
    for row in result:
        budresult = engine.execute('SELECT spenndingvariables FROM Budget WHERE cityname=\'%s\' AND fromCity=1' % row['cityname'])
        spendingString = ""
        for bRow in budresult:
            spendingString =  bRow['spenndingvariables']

        spending = decode(spendingString)
        total = 0
        maxSpenderVal = -1
        maxSpenderLabel = ""
        for key in spending:
            total+=spending[key]
            if spending[key] > maxSpenderVal:
                maxSpenderVal = spending[key]
                maxSpenderLabel = key

        cities.append({'cityname' : splitStringByUpperCase( row['cityname']),
                       'encodedcityname' :row['cityname'],
                       'total' : total,
                       'top_cat' : maxSpenderLabel
        });
    return render_template('root.html',cities=cities)

# @app.route('/static/FEScript/<file_name>.js')
# def send_text_file(file_name):
#     """Send your static text file."""
#     file_dot_jayess= file_name + '.js'
#     return app.send_static_file(file_dot_jayess)


@app.route('/vote/<cityname>')
def vote(cityname=None):
    if cityname == None:
        return render_template('404.html'), 404
    result = engine.execute('SELECT * FROM Budget b WHERE b.cityname=\'%s\' AND b.fromCity=1' % cityname) 
    toReturn = []
    for row in result:
        toReturn.append(row['spenndingvariables'])
    encodedcityname = cityname
    cityname = splitStringByUpperCase(cityname)
    return render_template('vote.html',citybudget=toReturn, cityname=cityname, encodedcityname=encodedcityname)

@app.route('/vote',methods=['POST'])
def postVote():
    vote =  request.form['vote']
    cityname = request.form['cityname']
    if rowExists(engine,cityname,"City","cityname"):
        engine.execute('INSERT Budget(cityname,fromCity,spenndingvariables) VALUES (\'%s\',0,\'%s\')' % (cityname,vote))
    return json.dumps({})


@app.route('/voteresults/<cityname>')
def voteresults(cityname=None):
    if cityname == None:
        return render_template('404.html'), 404
    result = engine.execute('SELECT * FROM Budget b WHERE b.cityname=\'%s\'' % cityname) 
    cityBudget = []
    voteBudget = []
    for row in result:
        if row['fromCity']:
            cityBudget.append(row['spenndingvariables'])
        else:
            voteBudget.append(row['spenndingvariables'])
    encodedcityname = cityname
    cityname = splitStringByUpperCase(cityname)
    return render_template('voteresults.html',citybudget=cityBudget,voteBudget=voteBudget, cityname=cityname, encodedcityname=encodedcityname)

if __name__ == '__main__':
    app.run(port=80)

