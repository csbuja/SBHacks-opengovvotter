CREATE TABLE City(
	cityname VARCHAR(255),
	PRIMARY KEY (cityname)
);
#The campaignid is formatted as companyname#####campaignid
CREATE TABLE Budget(
	budgetid INT AUTO_INCREMENT,
	spenndingvariables VARCHAR(2000),
	cityname VARCHAR(255),
	fromCity Boolean,
	PRIMARY KEY (Budgetid),
	FOREIGN KEY(cityname) REFERENCES City(cityname) ON DELETE CASCADE
);