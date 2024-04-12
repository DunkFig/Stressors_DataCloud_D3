let sheetData, length
let stressorsArray = []

//This is the array of colors that we will use in the wordcloud
var myColors = ['#e6194b', '#3cb44b', '#ffe119'];


function setup() {
    noCanvas()

    loadJSON(appURL, function (data) {
        sheetData = data;
        length = sheetData.length

        console.log(sheetData)
        for (let i = 0; i < length; i++) {
            stressorsArray.push(sheetData[i].Stressors)
        }

        const wordCloudContainer = document.getElementById('my_dataviz');
        console.log(stressorsArray)

        // Width and height of the D3 canvas that holds the word cloud.
        var margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = 1000 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // appends the svg object to the the my_dataviz element
        var svg = d3.select("#my_dataviz").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Changes the background of the D3 data cloud, I set this to be the same color as the Page.
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#98D1F2");

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        var layout = d3.layout.cloud()
            .size([width, height])
            .words(stressorsArray.map(function (d) { return { text: d }; }))
            .padding(10)
            .fontSize(40)
            .on("end", draw);
        layout.start();

        function draw(words) {


            // Applies the color scale from our array.
            var colorScale = d3.scaleOrdinal(myColors); // This uses a set of 10 categorical colors.

            var wordGroup = svg.append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) { return d.size + "px"; })
                

                
                /////////////////////////
                //Set Font-Family Here!!!
                .style("font-family", "Times New Roman") // Optional: set font family
                .attr("text-anchor", "middle")
                .attr("fill", function (d, i) { return colorScale(i); }) // Assign a color from the scale
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; });
        }

    });
}

