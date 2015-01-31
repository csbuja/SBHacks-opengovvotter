import os
from sqlalchemy import engine, create_engine
def getEngine():
    dbUri =  os.environ.get('CLEARDB_DATABASE_URL')
    if dbUri == None:
        dbUri = 'mysql://b9b617c5f3c635:f030fb09@us-cdbr-iron-east-01.cleardb.net/heroku_a54387a05f0302c?reconnect=true'
    return create_engine(dbUri, pool_recycle=3600) 