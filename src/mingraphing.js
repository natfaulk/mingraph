Mingraphing = function(canvasID, options) {
  var DEFAULT_CHART_WIDTH = 800;
  var DEFAULT_CHART_HEIGHT = 600;
  var DEFAULT_CHART_MARGIN = 10;
  var DEFAULT_N_CHARTS = 1;
  var DEFAULT_DRAW_MARGINS = true;
  var DEFAULT_TYPE = 'line'; // line or bar
  var DEFAULT_BIPOLAR = false;

  this._options = {
    chartWidth: DEFAULT_CHART_WIDTH,
    chartHeight: DEFAULT_CHART_HEIGHT,
    chartMargin: DEFAULT_CHART_MARGIN,
    numberOfCharts: DEFAULT_N_CHARTS,
    drawMargins: DEFAULT_DRAW_MARGINS,
    type: DEFAULT_TYPE,
    bipolar: DEFAULT_BIPOLAR
  };

  for (var opt in options) {
    this._options[opt] = options[opt];
  }

  this.d = new Mindrawingjs();
  var tHeight = this._options.numberOfCharts * (this._options.chartHeight + this._options.chartMargin) + this._options.chartMargin;
  this.d.setup(canvasID, this._options.chartWidth, tHeight);
  this.d.background('#000');

  if (this._options.drawMargins) this._drawMargins();
};

(function(){
  Mingraphing.prototype._drawMargins = function () {
    this.d.stroke('#FFFFFF');
    var t_y = 0;
    for (var i = 0; i < this._options.numberOfCharts; i++) {
      t_y += this._options.chartMargin;
      this.d.line(0, t_y, this.d.width, t_y);
      t_y += this._options.chartHeight;
      this.d.line(0, t_y, this.d.width, t_y);
    }
  };

  Mingraphing.prototype.addData = function(dataset, selector, colour, chartNumber, maxValue) {
    if (this._options.type == 'line') {
      this._drawLine(dataset, selector, colour, chartNumber, maxValue);
    } else if (this._options.type == 'bar') {
      this._drawBar(dataset, selector, colour, chartNumber, maxValue);
    }
  };

  Mingraphing.prototype._drawLine = function(dataset, selector, colour, chartNumber, maxValue) {
    var t_x1 = 0;
    var t_x2 = 0;
    var t_y1 = 0;
    var t_y2 = 0;
    var o = this._options;
    this.d.stroke(colour);
    for (var i = 1; i < dataset.length; i++) {
      t_ycom = chartNumber * (o.chartHeight + o.chartMargin) + o.chartMargin + o.chartHeight / 2;
      if (!o.bipolar) t_ycom += o.chartHeight / 2;
      t_x1 = o.chartWidth * (i - 1) / dataset.length;
      t_x2 = o.chartWidth * (i) / dataset.length;
      t_y1 = t_ycom - (dataset[i - 1][selector] / maxValue) * o.chartHeight;
      t_y2 = t_ycom - (dataset[i][selector] / maxValue) * o.chartHeight;
      this.d.line(t_x1, t_y1, t_x2, t_y2);
    }
  };

  Mingraphing.prototype._drawBar = function(dataset, selector, colour, chartNumber, maxValue) {
    var t_x = 0;
    var t_y1 = 0;
    var t_y2 = 0;
    var o = this._options;
    this.d.stroke(colour);
    for (var i = 0; i < dataset.length; i++) {
      t_ycom = chartNumber * (o.chartHeight + o.chartMargin) + o.chartMargin + o.chartHeight / 2;
      if (!o.bipolar) t_ycom += o.chartHeight / 2;
      t_x = o.chartWidth * (i) / dataset.length;
      t_y1 = t_ycom - (dataset[i][selector] / maxValue) * o.chartHeight;
      t_y2 = t_ycom;
      this.d.line(t_x, t_y1, t_x, t_y2);
    }
  };


  Mingraphing.prototype.clear = function() {
    this.d.background('#000');
    if (this._options.drawMargins) this._drawMargins();
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Mingraphing;
  }
})();
