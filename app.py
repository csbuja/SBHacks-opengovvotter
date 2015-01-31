# from dataBaseInteraction import getEngine, encryptCampaignId,decryptCampaignId, decryptCompanyname, encryptCompanyname, getDataSource, rowExists
# from sqlalchemy import engine, create_engine
from flask import Flask, request, render_template
from databaseinteraction import getEngine
app = Flask(__name__)

import os
# os.environ['DATABASE_URL'] = 'mysql://baeac49ec6a15d:dc6cdfb5@us-cdbr-iron-east-01.cleardb.net/heroku_f725046b88179c9?reconnect=true'

engine = getEngine()
print 1
connection = engine.connect()
print 2
engine.execute('CREATE TABLE City(cityname VARCHAR(255),PRIMARY KEY (cityname))')
engine.execute('CREATE TABLE Budget(budgetid INT AUTO_INCREMENT,spenndingvariables VARCHAR(2000),PRIMARY KEY (Budgetid),FOREIGN KEY(cityname) REFERENCES City(cityname) ON DELETE CASCADE)')

connection.close()


@app.route('/vote/<city>')
def vote():
	return {}

@app.route('/voteresults/<city>')
def voteresults():
	return {}

if __name__ == '__main__':
    app.run(debug=True)

