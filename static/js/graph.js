queue()
    .defer(d3.csv,"data/Open_Tickets.csv")
     .await(makeGraphs);
    
function makeGraphs(error, ticketsData) {
    var ndx = crossfilter(ticketsData);
    
    ticketsData.forEach(function(d){
        d.DaysOld = parseInt(d.DaysOld);
        d.CaseNumber = parseInt(d.CaseNumber);
    })

    show_status_selector(ndx);
    show_case_owner(ndx);
    show_case_owner_selector(ndx);
    show_sla_status(ndx);
    show_case_country(ndx);
    show_days_old(ndx);
/*    show_days_old_to_status_correlation(ndx);  */
    
    dc.renderAll();
    
}

function show_status_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Status'));
    var group = dim.group();
    
    dc.selectMenu("#status-selector")
        .dimension(dim)
        .group(group);
}
function show_case_owner(ndx) {
    var dim = ndx.dimension(dc.pluck('CaseOwner'));
    var group = dim.group();
    
    dc.barChart("#case-owner")
        .width(500)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50}) 
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Case Owner")
        .yAxis().ticks(20) ; 
}

function show_case_owner_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('CaseOwner'));
    var group = dim.group();
    
    dc.selectMenu("#case-owner-selector")
        .dimension(dim)
        .group(group);
}


function show_case_country(ndx) {
    var dim = ndx.dimension(dc.pluck('CaseCountry'));
    var group = dim.group();
    
    dc.pieChart("#case-country")
        .width(550)
        .height(350)
        .dimension(dim)
        .group(group)
        .transitionDuration(500);
}

function show_sla_status(ndx) {
	    var dim = ndx.dimension(dc.pluck('SLAstatus'));
	    var group = dim.group();
	    
	    dc.pieChart("#sla-status")
        .width(550)
        .height(350)
        .dimension(dim)
        .group(group)
        .transitionDuration(500);

/*	    
	    dc.barChart("#sla-status")
	        .width(400)
	        .height(300)
	        .margins({top: 10, right: 50, bottom: 30, left: 50})
	        .dimension(dim)
	        .group(group)
	        .transitionDuration(500)
	        .x(d3.scale.ordinal())
	        .xUnits(dc.units.ordinal)
	        .xAxisLabel("SLA Status")
	        .yAxis().ticks(20);
*/	        
	}



function show_days_old(ndx) {
    var dim = ndx.dimension(dc.pluck('CaseCountry'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.DaysOld;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
            p.total -= v.DaysOld;
            p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
  var averageDaysOld = dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#average-days-old")
        .width(600)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(averageDaysOld)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Average Age Of Tickets Per Country")
        .yAxis().ticks(20);
}

function show_days_old_to_status_correlation(ndx) {
	    
	    var genderColors = d3.scale.ordinal()
	        .domain(["outside SLA", "Within SLA"])
	        .range(["red", "green"]);
	    
	    var eDim = ndx.dimension(dc.pluck("CaseNumber"));
	    var experienceDim = ndx.dimension(function(d) {
	       return [d.CaseNumber, d.DaysOld, d.CaseOwner, d.Status, d.SLAstatus];
	    });
	    var daysOldGroup = daysOldDim.group();
	    
	    var minDaysOld = eDim.bottom(1)[0].DaysOld;
	    var maxDaysOld = eDim.top(1)[0].DaysOld;
	    
	    dc.scatterPlot("#daysOld")
	        .width(800)
	        .height(400)
	        .x(d3.scale.linear().domain([minDaysOld, maxDaysOld]))
	        .brushOn(false)
	        .symbolSize(8)
	        .clipPadding(10)
	        .xAxisLabel("Age Of Case")
	        .title(function(d) {
	            return d.key[2] + " earned " + d.key[1];
	        })
	        .colorAccessor(function (d) {
	            return d.key[3];
	        })
	        .colors(genderColors)
	        .dimension(experienceDim)
	        .group(daysOldGroup)
	        .margins({top: 10, right: 50, bottom: 75, left: 75});
	}