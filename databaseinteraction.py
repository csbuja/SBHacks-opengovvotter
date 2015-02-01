import os
import sys
from sqlalchemy import engine, create_engine
def getEngine():
    dbUri =  os.environ.get('CLEARDB_DATABASE_URL')
    if dbUri == None:
        dbUri = 'mysql://b9b617c5f3c635:f030fb09@us-cdbr-iron-east-01.cleardb.net/heroku_a54387a05f0302c'
    return create_engine(dbUri, pool_recycle=3600) 

def batchInsert(engine):
    connection = engine.connect()
    fd = open('sampledata.sql', 'r')
    sqlFile = fd.read()
    fd.close()

    # all SQL commands (split on ';')
    sqlCommands = sqlFile.split(';')

    # Execute every command from the input file
    for command in sqlCommands:
        # This will skip and report errors
        # For example, if the tables do not yet exist, this will skip over
        # the DROP TABLE commands
        try:
            engine.execute(command)
        except:
            print "error"
    connection.close()

def rowExists(engine,primKey,tableName, primColName):
    primKey = str(primKey)
    query = "SELECT * FROM %s WHERE %s=\'%s\'" % (tableName,primColName,primKey)
    result = engine.execute(query)
    count = 0
    for row in result:
        count+=1
    return bool(count)