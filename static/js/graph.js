queue()
    .defer(d3.csv,"data/Open_Tickets.csv")
     .await(makeGraphs);
    
function makeGraphs(error, ticketsData) {

    
}