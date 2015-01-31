CREATE TABLE City(
	cityname VARCHAR(255),
	PRIMARY KEY (cityname)
);
#The campaignid is formatted as companyname#####campaignid
CREATE TABLE Budget(
	budgetid INT AUTO_INCREMENT,
	spenndingvariables VARCHAR(2000),
	PRIMARY KEY (Budgetid),
	FOREIGN KEY(cityname) REFERENCES City(cityname) ON DELETE CASCADE
);
CREATE TABLE Post(
	postid VARCHAR(50),
	message VARCHAR(1600),
	shares INT,
	campaignid VARCHAR(400),
	isLatest BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (postid),
	FOREIGN KEY(campaignid) REFERENCES Campaign(campaignid)
);