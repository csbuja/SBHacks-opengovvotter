//given a city budget
//returns a list of objects {y,label}
var votebudget = [];
var budgetModel = new BudgetModel(CITYBUDGET[0],votebudget,CITYNAME,ENCODEDCITYNAME);

var transformModelToGraph = function(citybudget){
	return _.map(citybudget,function(val,key){
		return {"label": key, "y":val};
	});
}

//pass in object with key of label and value of money
//return an encoded string for the mysql interaction
encodeVote = function(obj){
	var voteStr = ""
	var i=0
	var objLength = Object.keys(obj).length;

	_.each(obj,function(v,key){
		voteStr += ( key + '####' + v )
		if (i !== objLength -1) voteStr += '##??##'
		i+=1
	});
	return voteStr;
}

//returns an object describing the vote
var gatherVote = function(){
	var titleList = [];
	$('.element span.title').each(function(){
		titleList.push($(this).text());
	});

	valueList = [];
	$(".element .input input").each(function(){
			v = $(this).val();
			v = parseFloat(v);
			(v===0 || v) ? valueList.push(v) : valueList.push(0);
	});
	//it's guaranteed that len(titleList)===len(valueList)
	vote = {};
	for(var i=0; i<valueList.length;++i)
	{
		vote[titleList[i]] = valueList[i];
	}
	return vote;
}

var updateProposedBudget = function(val){
	$("#budgetDisplay").children().remove()
	var borderColor = "green"
	if (val < 0) {
		borderColor = "red";
	}
	$("#proposeBudget").off();
 	$("#budgetDisplay").append("<div style=\"border: 2px solid " + borderColor + ";\">$" + val +"</div>");

 	if (borderColor === "green") {
	 	$("#proposeBudget").click(function(){
	 		var vote = encodeVote(gatherVote());
	 		var cityname = budgetModel.getEncodedCityName()
	 		$.post('/vote',{'vote':vote, 'cityname':cityname},function(){
	 			window.location=("http://"+document.domain+"/voteresults/palo-alto");
	 		});	
	 	});

 	}
 	else {
 		$("#proposeBudget").click(function(){
	 		$(".submitButton").append("<p>You have overspent the budget.</p>")
	 		window.setTimeout(function(){
		 		$("#proposeBudget").siblings().remove();
		 	},3000);
	 	}); 		
 	}
}

var reCalcBudget = function(){
	total = 0
	$(".element .input input").each(function(){
		v = $(this).val();
		v = parseFloat(v);
		if (v) total+=v;
	});
	return total;
}

var calculateBudget = function(budgetModel){
	var budgetSpent = reCalcBudget();
	var budgetRemaining = budgetModel.totalBudget - budgetSpent;
	updateProposedBudget(budgetRemaining);
}

var addNLabelsForVote = function(transformedBudgetModel,colors,budgetModel){
      var idHeader = "#userInput .elements"
      _.each(transformedBudgetModel, function(v,i){
          $(idHeader).append("<div class='element'> <div class='circle'style='background-color:"+ colors[i]+"'></div>" +  
          "<div class='input'><input type='text' onchange=\"calculateBudget(budgetModel);\" class=\"selectedAmount\" value='0'></input></div><span class=\"title\">" +
          v['label'] + "</span></div>");
      });
}

$(document).ready(function(){
	var transformedCityBudget = transformModelToGraph(budgetModel.getCityBudget());

	CanvasJS.addColorSet("SpencersColors", budgetModel.getBudgetColors());
	addNLabelsForVote(transformedCityBudget,budgetModel.getBudgetColors());
	calculateBudget(budgetModel);

	var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "Last Year's Spending by " +budgetModel.getCityName(),
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
    chart.render();
});
