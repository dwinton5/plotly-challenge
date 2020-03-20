// Creating functions to Plot Data (Bar, gauge, bubble)
// 
// Code written during homework review in Boot Camp class 3/12.
// Function for sampling the Metadata.
function buildMetadata(sample) {
  d3.json("samples.json").then(data => {
    var metadata = data.metadata;
    var resultList = metadata.filter(selection => selection.id == sample);
    var result = resultList[0];
    console.log("metadata", result);
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(function([key, value]) {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to build charts.
function buildCharts(sample) {
  d3.json("samples.json").then(data => {
    var samples = data.samples;
    var resultList = samples.filter(selection => selection.id == sample);
    var result = resultList[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    console.log("chart data", result);
    var yticks = otu_ids
      .slice(0, 10)
      .map(id => `OTU ${id}`)
      .reverse();

// Bar chart code
    var barChart = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    var barLayout = {
      title: "Bacteria Cultures Found"
    };
    Plotly.newPlot("bar", barChart, barLayout);

// Bubble chart code
    var bubbleChart = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    var bubbleLayout = {
      title: "Bacteria per Sample",
      xaxis: { title: "OTU ID" }
    };
    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
  });
}

// Funciton for sampling the necessary data.
function init() {
  var dropDown = d3.select("#selDataset");
  d3.json("samples.json").then(data => {
    var sampleNames = data.names;
    console.log(sampleNames);
    sampleNames.forEach(function(sample) {
      dropDown
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

//  Function for the change event.
function optionChanged(sample) {
  buildCharts(sample);
  buildMetadata(sample);
}
init();