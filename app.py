# from dataBaseInteraction import getEngine, encryptCampaignId,decryptCampaignId, decryptCompanyname, encryptCompanyname, getDataSource, rowExists
# from sqlalchemy import engine, create_engine
import Flask


@app.route('/')
def root():
	return 'world'



if __name__ == '__main__':
    app.run(debug=True)

