//given a city budget
//returns a list of objects {y,label}
var transformModelToGraph = function(citybudget){
	return _.map(citybudget,function(val,key){
		return {"label": key, "y":val};
	});
}

//assumes at least one voted Budget
var calcAverageLabels = function(votedBudgets){
	voteAggregate = {};
	_.extend(voteAggregate,votedBudgets[0]);

	for(var i=1; i<votedBudgets.length; ++i)
	{
		_.each(votedBudgets[i],function(v,key){
			voteAggregate[key]+=v
		})
	}

	voteAggregate = _.each(voteAggregate,function(val,key){
		voteAggregate[key] = val/votedBudgets.length
	})

	return voteAggregate
}


$(document).ready(function(){
	var budgetModel = new BudgetModel(CITYBUDGET[0],VOTEBUDGET);
	var transformedCityBudget = transformModelToGraph(budgetModel.getCityBudget());
	var transformedVoteAggregateBudget = transformModelToGraph( calcAverageLabels( budgetModel.getVotedBudgets()));
	var cityChart = new CanvasJS.Chart("chartContainer1",
    {
      title:{
        text: "City Spending",
        horizontalAlign: "center",    
      },
      width: 600,
      animationEnabled: true,
      axisY: {
        title: "Dollars",
        labelFontSize: 10,
        titleFontSize: 20
      },

      axisX: {
        title: "Departments",
        labelFontSize: 10
      },

      legend: {
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      theme: "theme1",
      data: [

      {        
        type: "column",  
        // showInLegend: true, 
        // legendMarkerColor: "grey",
        // legendText: "MMbbl = one million barrels",
        dataPoints: transformedCityBudget
      }   
      ]
    });
	debugger;
    cityChart.render();
  var voteChart = new CanvasJS.Chart("chartContainer2",
    {
      title:{
        text: "Community Proposed Budget",
        horizontalAlign: "center",    
      },
      width: 600,
      animationEnabled: true,
      axisY: {
        title: "Dollars",
        labelFontSize: 10,
        titleFontSize: 20
      },

      axisX: {
        title: "Departments",
        labelFontSize: 10
      },

      legend: {
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      theme: "theme1",
      data: [

      {        
        type: "column",  
        // showInLegend: true, 
        // legendMarkerColor: "grey",
        // legendText: "MMbbl = one million barrels",
        dataPoints: transformedVoteAggregateBudget
      }   
      ]
    });

    voteChart.render();
});