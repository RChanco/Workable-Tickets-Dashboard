queue()
    .defer(d3.csv,"data/Open_Tickets.csv")
     .await(makeGraphs);
    
function makeGraphs(error, ticketsData) {
    var ndx = crossfilter(ticketsData);
    
    show_status_selector(ndx);
    show_case_owner(ndx);
    show_case_country(ndx);
    
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
        .width(650)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Case Owner")
        .yAxis().ticks(20);
}

function show_case_country(ndx) {
    var dim = ndx.dimension(dc.pluck('CaseCountry'));
    var group = dim.group();
    
    dc.barChart("#case-country")
        .width(650)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Case Country")
        .yAxis().ticks(20);
}