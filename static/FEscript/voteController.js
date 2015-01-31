//given a city budget
//returns a list of objects {y,label}
var transformModelToGraph = function(citybudget){
	return _.map(citybudget,function(val,key){
		return {"label": key, "y":val};
	});
}

$(document).ready(function(){
	var votebudget = [];
	var budgetModel = new BudgetModel(CITYBUDGET[0],votebudget);
	var transformedCityBudget = transformModelToGraph(budgetModel.getCityBudget());

	var chart = new CanvasJS.Chart("chartContainer",
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
    chart.render();
});
