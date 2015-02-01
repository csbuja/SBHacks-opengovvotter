//object, array of objects
var BudgetModel = function(realBudget,votedBudgets,cityname, encodedcityname){
	this.cityname = cityname;
	this.encodedcityname = encodedcityname;
	this.realBudget = realBudget;
	var totalBudget = 0;
	_.each(realBudget,function(v){
		totalBudget+=parseFloat(v);
	});
	this.totalBudget = totalBudget;
	this.votedBudgets = votedBudgets;
	var colors1 = "#369EAD #C24642 #7F6084 #86B402 #A2D1CF #C8B631 #6DBCEB #52514E #4F81BC #A064A1 #F79647".split(" ");
	var colors2 = "#4F81BC #C0504E #9BBB58 #23BFAA #8064A1 #4AACC5 #F79647 #33558B".split(" ");
	var colors3 = "#8CA1BC #36845C #017E82 #8CB9D0 #708C98 #94838D #F08891 #0366A7 #008276 #EE7757 #E5BA3A #F2990B #03557B #782970".split(" ");
	this.budgetColors = colors1.concat(colors2).concat(colors3);
}

BudgetModel.prototype.getCityBudget = function(){
	return this.realBudget;
}

BudgetModel.prototype.getVotedBudgets = function(){
	return this.votedBudgets;
}

BudgetModel.prototype.getBudgetColors = function(){
	return this.budgetColors;
}

BudgetModel.prototype.getCityName= function(){
	return this.cityname;
}

BudgetModel.prototype.getEncodedCityName= function(){
	return this.encodedcityname;
}
