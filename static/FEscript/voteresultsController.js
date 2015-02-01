//given a city budget
//returns a list of objects {y,label}
var transformModelToGraph = function(citybudget){
	return _.map(citybudget,function(val,key){
		return {"label": key, "y":val};
	});
}
//cut the aveBudget off and count the number of extras
var cutOffandCalcExtra = function(aveBudget, realBudget){
	var MARGIN = .1;
	var numExtra = 0;
	var numExtra = 0;
	_.each(realBudget,function(v){
		numExtra+=v;
	});

	_.each(aveBudget,function(v,key){
		var upperBound = realBudget[key] + MARGIN*realBudget[key];
 		var lowerBound = realBudget[key] - MARGIN*realBudget[key];

 		if ( v > upperBound) {
 			aveBudget[key] = upperBound;
 		}
 		else if (v < lowerBound) {
 			aveBudget[key] = lowerBound;
 		}
 		numExtra-=aveBudget[key];
	});
	return [numExtra,realBudget,aveBudget];
}


//assumes that the aveBudget has already been cut off at cutoff points
//returns a redistrubted object
var reDistributeExtras = function(numExtra, realBudget, aveBudget){
	var total = 0;
	_.each(realBudget,function(v){
		total+=v;
	});
	proportionMap = {}
	_.each(realBudget,function(v,key){
		proportionMap[key] = v/total;
	});
	_.each(aveBudget, function(v,key){
		aveBudget[key] += ( proportionMap[key] * numExtra)
	});
	return aveBudget
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
	var budgetModel = new BudgetModel(CITYBUDGET[0],VOTEBUDGET,CITYNAME,ENCODEDCITYNAME);
	var transformedCityBudget = transformModelToGraph(budgetModel.getCityBudget());
	var aveBudget = calcAverageLabels( budgetModel.getVotedBudgets())
	var transformedVoteAggregateBudget = transformModelToGraph(reDistributeExtras.apply(null,cutOffandCalcExtra(aveBudget,budgetModel.getCityBudget()) ) );
	CanvasJS.addColorSet("SpencersColors", budgetModel.getBudgetColors());
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
      colorSet: "SpencersColors",
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
      colorSet: "SpencersColors",
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