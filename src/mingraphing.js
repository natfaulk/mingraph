var Mindrawingjs = require('mindrawingjs');

Mingraphing = function(canvasID, options) {
  var DEFAULT_CHART_WIDTH = 800;
  var DEFAULT_CHART_HEIGHT = 600;
  var DEFAULT_CHART_MARGIN = 10;
  var DEFAULT_N_CHARTS = 1;
  var DEFAULT_DRAW_MARGINS = true;
  var DEFAULT_TYPE = 'line'; // line or bar
  var DEFAULT_BIPOLAR = false;
  var DEFAULT_TOOLTIP = true;
  var _COL_WHITE = '#FFFFFF';

  this._options = {
    chartWidth: DEFAULT_CHART_WIDTH,
    chartHeight: DEFAULT_CHART_HEIGHT,
    chartMargin: DEFAULT_CHART_MARGIN,
    numberOfCharts: DEFAULT_N_CHARTS,
    drawMargins: DEFAULT_DRAW_MARGINS,
    type: DEFAULT_TYPE,
    bipolar: DEFAULT_BIPOLAR,
    tooltip: DEFAULT_TOOLTIP,
    xMax: -1
  };

  for (var opt in options) {
    this._options[opt] = options[opt];
  }

  this.graphs = {
    'dataset': [],
    'colors': [],
    'keys': [],
    'labels': [],
    'chartNumbers': [],
    'maxVals': []
  }

  this.lastMouse = {
    x: -1,
    y: -1
  }

  this.d = new Mindrawingjs();
  var tHeight = this._options.numberOfCharts * (this._options.chartHeight + this._options.chartMargin) + this._options.chartMargin;
  this.d.setup(canvasID, this._options.chartWidth, tHeight);
  this.d.background('#000');

  if (this._options.drawMargins) this._drawMargins();
  if (this._options.tooltip) {
    var _this = this;
    document.onmousemove = function(event) {
      if (_this.graphs.dataset.length > 0) {
        _this.draw();
        _this.drawTooltip(event.pageX, event.pageY);
        _this.lastMouse.x = event.pageX;
        _this.lastMouse.y = event.pageY;
      }
    };
  }
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

  Mingraphing.prototype.addData = function(dataset, series, colour, chartNumber, maxValue, label) {
    this.graphs.colors.push(colour);
    this.graphs.keys.push(series);
    this.graphs.labels.push(label);
    this.graphs.chartNumbers.push(chartNumber);
    this.graphs.maxVals.push(maxValue);
    for (var i = 0; i < dataset.length; i++) {
      if (i >= this.graphs.dataset.length) {
        this.graphs.dataset.push({});
      }
      this.graphs.dataset[i][series] = dataset[i][series];
    }

    this.draw();
  };

  Mingraphing.prototype.updateData = function(dataset, series) {
    for (var i = 0; i < dataset.length; i++) {
      if (i >= this.graphs.dataset.length) {
        this.graphs.dataset.push({});
      }
      this.graphs.dataset[i][series] = dataset[i][series];
    }

    this.draw();
    if (this.lastMouse.x >= 0 && this.lastMouse.y >= 0) this.drawTooltip(this.lastMouse.x, this.lastMouse.y);
  };

  Mingraphing.prototype.draw = function() {
    this.clear();
    for (var i = 0; i < this.graphs.keys.length; i++) {
      if (this._options.type == 'line') {
        this._drawLine(this.graphs.dataset, this.graphs.keys[i], this.graphs.colors[i], this.graphs.chartNumbers[i], this.graphs.maxVals[i]);
      } else if (this._options.type == 'bar') {
        this._drawBar(this.graphs.dataset, this.graphs.keys[i], this.graphs.colors[i], this.graphs.chartNumbers[i], this.graphs.maxVals[i]);        
      }      
    }
  }

  Mingraphing.prototype.drawTooltip = function(_mouseX, _mouseY) {
    var bounding = this.d.c.getBoundingClientRect();
    // _mouseX -= bounding.left;
    // _mouseY -= bounding.top;
    var mouseXadj = _mouseX - bounding.left;
    if (mouseXadj > 1000) mouseXadj -= 150;
    
    var xint = Math.round((this.graphs.dataset.length / this._options.chartWidth) * (_mouseX - bounding.left));
    if (xint >= this.graphs.dataset.length) xint = this.graphs.dataset.length - 1;
    if (xint < 0) xint = 0;

    this.d.stroke('#FFFFFF');
    this.d.line(_mouseX - bounding.left, 0, _mouseX - bounding.left, this._options.numberOfCharts * (this._options.chartHeight + this._options.chartMargin) + this._options.chartMargin);
    // graph.d.rect(event.pageX, event.pageY, 100, 100);
    this.d.textSize(20);
    this.d.fill('#FFFFFF');
    var xLab = xint;
    if (this._options.xMax > 0) xLab = xint / this.graphs.dataset.length * this._options.xMax;
    this.d.text('X: '+ xLab, mouseXadj + 5, _mouseY + 25 - bounding.top);
    for (var i = 0; i < this.graphs.keys.length; i++) {
      this.d.fill(this.graphs.colors[i]);     
      this.d.text(this.graphs.labels[i] + ': ' + this.graphs.dataset[xint][this.graphs.keys[i]], mouseXadj + 5, _mouseY + 55 + i * 30 - bounding.top);
    }
  }

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

  Mingraphing.prototype.tooltipEnabled = function(_tooltip) {
    this._options.tooltip = _tooltip;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Mingraphing;
  }
})();
