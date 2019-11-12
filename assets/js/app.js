var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
/// ****Chart ***//////
var chosenXAxis = 'poverty',
    chosenYAxis = 'healthcare';
// Import Data
d3.csv("../assets/data/data.csv").then( data =>{
	data.forEach( d =>{
		d.poverty = +d.poverty;
		d.age = +d.age;
		d.income = +d.income;
		d.obesity = +d.obesity;
		d.smokes = +d.smokes;
		d.healthcare = +d.healthcare;
	});

    var xScale = xlinearScale(data,chosenXAxis);
    var yScale = ylinearScale(data,chosenYAxis);

    //  Append Axes to the chart
    // ==============================   
    var xAxis = d3.axisBottom(xScale);
    var	yAxis = d3.axisLeft(yScale);
    
    var xAxis = chartGroup.append('g')
		.attr('transform',`translate(0,${height})`)
		.call(xAxis);
	var yAxis = chartGroup.append('g')
        .call(yAxis);
     

    chartGroup.append("text")
        .attr("transform", `translate(${width - 60},${height - 5})`)
        .attr("class", "axis-text-main")
        .text("Demographics")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")

    chartGroup.append("text")
        .attr("transform", `translate(15,90 )rotate(270)`)
        .attr("class", "axis-text-main")
        .text("Behavioral Risk Factors")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")

    // append initial circles    
    var circlesGroup = chartGroup.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('circlesGroup',true)
		.attr('cx', d => xScale(d[chosenXAxis]))
		.attr('cy', d => yScale(d[chosenYAxis]))
        .attr('r' , 10)
        .attr("fill", "#87cefa") 
        .attr("opacity", "0.5");

	
	var circlesText = chartGroup.append('g').selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.classed('circlesText',true)
		.attr('x', d => xScale(d[chosenXAxis]))
		.attr('y', d => yScale(d[chosenYAxis]))
		.attr('transform','translate(0,4.5)')
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "7px")
        .attr("fill", "white");
    var xLabelsGroup = chartGroup.append('g')
		.attr('transform', `translate(${width / 2}, ${height + 20})`);

	var povertyLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 20)
	    .attr('value', 'poverty')
	    .classed('aText active', true)
	    .text('In Poverty (%)');

	var ageLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 40)
	    .attr('value', 'age')
	    .classed('aText inactive', true)
	    .text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 60)
	    .attr('value', 'income')
	    .classed('aText inactive', true)
	    .text('Household Income (Median)');

    var yLabelsGroup = chartGroup.append('g')

	var HealthLabel = yLabelsGroup.append('text')
	    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	    .attr('value', 'healthcare')
	    .classed('aText active', true)
	    .text('Lacks Healthcare (%)');

	var smokesLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	    .attr('value', 'smokes')
	    .classed('aText inactive', true)
	    .text('Smokes (%)');

    var obesityLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	    .attr('value', 'obesity')
	    .classed('aText inactive', true)
	    .text('Obesse (%)');
    
    var circlesGroup = updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText);
    var	circlesText = updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText); 
    
    xLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== chosenXAxis) {
			    chosenXAxis = value;

		        xScale = xlinearScale(data, chosenXAxis);

		        xAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisBottom(xScale));

                circlesGroup.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cx', d => xScale(d[chosenXAxis]));

			    d3.selectAll('.circlesText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('x', d => xScale(d[chosenXAxis]));

                circlesGroup = updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText);
				circlesText = updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText);

		        if (chosenXAxis === 'poverty') {
				    povertyLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        incomeLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (chosenXAxis === 'age'){
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeLabel
			            .classed('active', true)
			            .classed('inactive', false);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
        });
    yLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== chosenYAxis) {
			    chosenYAxis = value;

		        yScale = ylinearScale(data, chosenYAxis);

		        yAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisLeft(yScale));

		        circlesGroup.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cy', d => yScale(d[chosenYAxis]));

			    d3.selectAll('.circlesText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('y', d => yScale(d[chosenYAxis]));

	        	circlesGroup = updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText),
				circlesText = updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText);

		        if (chosenYAxis === 'healthcare') {
				    HealthLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        smokesLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (chosenYAxis === 'obesity'){
		        	HealthLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	HealthLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesLabel
			            .classed('active', true)
			            .classed('inactive', false);
		            obesityLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
	    });

});

//  Create scale functions
function xlinearScale(data,chosenXAxis) {
	var xScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[chosenXAxis])*.9, 
	    		d3.max(data, d => d[chosenXAxis])*1.1])
	    .range([0, width]);
    
    return xScale;
}

function ylinearScale(data,chosenYAxis) {
	var yScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[chosenYAxis])*.9, 
	    		d3.max(data, d => d[chosenYAxis])*1.1])
	    .range([height, 0]);

    return yScale;
}

//  Create tooltip functions
function updateToolTip(chosenYAxis,chosenXAxis,circlesGroup,circlesText) {
    var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([80, -60])
        .html( d => {
        	if(chosenXAxis === "poverty")
	            return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:${d[chosenXAxis]}%`)
        	else if (chosenXAxis === 'income')
	            return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:$${d[chosenXAxis]}`)
	        else
	        	return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:${d[chosenXAxis]}`)
	    });

	circlesGroup.call(toolTip);
	circlesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	d3.selectAll('.circlesText').call(toolTip);
	d3.selectAll('.circlesText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	return circlesGroup;
	return circlesText;
}
       

          