MinGraphing - Minimal Graphing JS
=================================

This package is a very minimal graphing library. There are many other graphing libraries out there but most of them seemed too heavyweight, especially when trying to display several 1000 data points. This library is not necessarily as good as any of these other libraries but was written to suit my own needs.

The module depends on my [MinDrawingJS module](https://github.com/natfaulk/mindrawingjs) which needs to be included.

The library is very basic. Currently there are no axis markings or scale. There is also no auto scaling. The line graph type is a linear interpolation between each of the points. The bar graph is similar to the line graph but is vertical lines for each point. When large numbers of points are used, it is basically the same as filling the area under the line graph. It does however work quite well to display large numbers of data points efficiently.

There is also now a tooltip which displays the Y values of each point. It is currently not overly efficient as it redraws the graph each time the mouse moves.

API Reference
-------------
Version: 0.3.0  

### `Mingraphing(canvasID, options)`
Initialisation function which takes the drawing canvas and chart options  

**canvasID**: HTML canvas tag id  
**options**:

Option | Description | Default
------ | ----------- | -------:
chartWidth | Width of chart (px) | `800`
chartHeight | Height of chart (px) | `600`
chartMargin | Size of margin at top and bottom of chart and between charts if there are multiple on the same canvas | `10`
numberOfCharts | The number of charts on the same canvas. Charts are stacked vertically | `1`
drawMargins | Draws white lines along the edge of the margins | `true`
type | Type of graph. Either `bar` or `line` | `line`
bipolar | Allows for data that goes negative | `false`
tooltip | Shows y values for each data series at mouse x position | `true`
xMax | The Maximum x value - used to display the correct x value on the tooltip (rather than just the sample number). Disabled if < 0 | `-1`

### `Mingraphing.addData(dataset, selector, colour, chartNumber, maxValue, label)`
Adds a dataset to the graph. Data will be added as a new series.

**dataset**: JS list holding a JS object for each data point. e.g: `[{a: 10, b: 5}, {a: 15, b: 6}, ... ]`  
**selector**: Selector to be applied to each object in the dataset list.   
**colour**: The colour to set the line / bars to. CSS style color e.g. `#FF0000`  
**chartNumber**: Number of the chart to draw to if multiple charts are on the same canvas. Numbered from 0 to N-1  
**maxValue**: The maximum y-value of the graph. Used to scale the data when drawing to the graph.  
**label**: Series label to display on tooltip

### `Mingraphing.updateData(dataset, selector)`
Updates the dataset currently displayed on the graph.

**dataset**: JS list holding a JS object for each data point. e.g: `[{a: 10, b: 5}, {a: 15, b: 6}, ... ]`  
**selector**: Selector to be applied to each object in the dataset list.   

### `Mingraphing.clear()`
Clears charts by setting whole canvas to black.

Example
-------

```
<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>MinGraphing Example</title>
  <script src="../node_modules/mindrawingjs/build/mindrawing.min.js"></script>
  <script src="../build/mingraphing.min.js"></script>
</head>
<body>
  <canvas id="myGraph"></canvas>
  <script type="text/javascript">

  var graph = new Mingraphing('myGraph', {
    chartHeight: 200,
    chartMargin: 10,
    numberOfCharts: 2,
    chartWidth: 1200,
    type: 'line',
    bipolar: true,
    drawMargins: true,
    tooltip: true
  });


  const RED = '#FF0000';
  const GREEN = '#00FF00';
  const BLUE = '#0000FF';

  var dataset = [];

  for (var i = 0; i < 2000; i++) {
    dataset.push({
      'rand': 2 * (Math.random() - 0.5),
      'sin': Math.sin(i / 20),
      'saw': ((i % 50) / 25) - 1
    });
  }

  graph.addData(dataset, 'rand', RED, 0, 5, 'Random');
  graph.addData(dataset, 'sin', GREEN, 0, 2, 'Sine');
  graph.addData(dataset, 'rand', RED, 1, 5, 'Random');
  graph.addData(dataset, 'saw', BLUE, 1, 2, 'Saw');

  </script>
</body>
</html>


```
