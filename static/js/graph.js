queue()
    .defer(d3.csv,"data/Open_Tickets.csv")
     .await(makeGraphs);
    
function makeGraphs(error, ticketsData) {
    var ndx = crossfilter(ticketsData);
    
    show_case_owner(ndx);
    
    dc.renderAll();
    
}

function show_case_owner(ndx) {
    var dim = ndx.dimension(dc.pluck('CaseOwner'));
    var group = dim.group();
    
    dc.barChart("#case-owner")
        .width(650)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Case Owner")
        .yAxis().ticks(20);
}