//object, array of objects
var BudgetModel = function(realBudget,votedBudgets){
	this.realBudget = realBudget;
	this.votedBudgets = votedBudgets;
}

BudgetModel.prototype.getCityBudget = function(){
	return this.realBudget;
}

BudgetModel.prototype.getVotedBudgets = function(){
	return this.votedBudgets;
}
