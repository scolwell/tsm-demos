// slider.js
function Slider(options){
    var min = ("min" in options ? options.min : 0);
    var max = ("max" in options ? options.max: 1);
    var step = ("step" in options ? options.step : 0.01);
    var value = ("value" in options ? options.value: min);
    var callback = ("callback" in options ? options.callback : function(){});
    var id = options.id;
    var html = HtmlGen.div("", {id: id});
    this.html = html;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
    this.callback = callback;
    this.id = id;
    this.active = false;
}
Slider.prototype.backgroundColor = "rgb(230, 230, 230)";
Slider.prototype.sliderHandleWidth = 33;
Slider.prototype.sliderHandleHeight = 22;
Slider.prototype.sliderBackgroundHeight = 13;
Slider.prototype.init = function(){
    this.elt = $("#" + this.id);
    var THIS = this;
    this.elt.slider({
        min: this.min,
        max: this.max,
        step: this.step,
        value: this.value,
        slide: function(event, ui){
            THIS.active = true;
            var value = ui.value;
            THIS.callback(value, "slide");
        },
        stop: function(event, ui){
            THIS.active = false;
            var value = ui.value;
            THIS.callback(value, "stop");
        }
    });
    this.handleElt = this.elt.find("a");
    // Apply TSM slider classes and rely on CSS for styling
    this.elt.addClass("tsm-slider");
    this.handleElt.addClass("tsm-slider-handle");
}
Slider.prototype.adjustTableCss = function(tableElt){
    if (Options.removeGreyBackgroundInSliderTables){
        return;
    }
    var bgColor = this.backgroundColor;
    var hBorder = "1px solid " + bgColor;
    tableElt.css({
        "background-color": bgColor,
        "border-left": hBorder,
        "border-right": hBorder
    });
}
Slider.prototype.get = function(){
    return this.elt.slider("value");
}
Slider.prototype.set = function(value){
    return this.elt.slider("value", value);
}
/************************************************************************************************/

function MultiSlider(options){
    var min = ("min" in options ? options.min : 0);
    var max = ("max" in options ? options.max: 1);
    var step = ("step" in options ? options.step : 0.01);
    var values = options.values;
    var callback = ("callback" in options ? options.callback : function(){});
    var id = options.id;
    var html = HtmlGen.div("", {id: id});
    this.html = html;
    this.min = min;
    this.max = max;
    this.step = step;
    this.values = values;
    this.callback = callback;
    this.id = id;
}
MultiSlider.prototype.backgroundColor = "rgb(230, 230, 230)";
MultiSlider.prototype.sliderHandleWidth = 33;
MultiSlider.prototype.sliderHandleHeight = 22;
MultiSlider.prototype.sliderBackgroundHeight = 13;
MultiSlider.prototype.init = function(){
    this.elt = $("#" + this.id);
    var THIS = this;
    this.elt.slider({
        min: this.min,
        max: this.max,
        step: this.step,
        values: this.values,
        slide: function(event, ui){
            THIS.callback(ui.values);
        },
        stop: function(event, ui){
            THIS.callback(ui.values);
        }
    });
    this.handleElt = this.elt.find("a");
    // Apply TSM slider classes and rely on CSS for styling
    this.elt.addClass("tsm-slider");
    this.handleElt.addClass("tsm-slider-handle");
}
MultiSlider.prototype.adjustTableCss = function(tableElt){
    if (Options.removeGreyBackgroundInSliderTables){
        return;
    }
    var bgColor = this.backgroundColor;
    var hBorder = "1px solid " + bgColor;
    tableElt.css({
        "background-color": bgColor,
        "border-left": hBorder,
        "border-right": hBorder
    });
}
MultiSlider.prototype.get = function(){
    return this.elt.slider("value");
}
MultiSlider.prototype.set = function(value){
    return this.elt.slider("value", value);
}
/************************************************************************************************/

function DoubleSlider(options){
    var min = ("min" in options ? options.min : 0);
    var max = ("max" in options ? options.max: 1);
    var step = ("step" in options ? options.step : 0.01);
    var values = options.values;
    var callback = ("callback" in options ? options.callback : function(){});
    var id = ("id" in options ? options.id : UTIL.randomIdentifier());
    var leftBackgroundColor = ("leftBackgroundColor" in options ? options.leftBackgroundColor : "green");
    var rightBackgroundColor = ("rightBackgroundColor" in options ? options.rightBackgroundColor : "blue");
    var html = HtmlGen.div("", {id: id});
    this.html = html;
    this.min = min;
    this.max = max;
    this.step = step;
    this.values = values;
    this.callback = callback;
    this.id = id;
    this.rightBackgroundColor = rightBackgroundColor;
    this.leftBackgroundColor = leftBackgroundColor;
}
DoubleSlider.prototype.backgroundColor = "rgb(230, 230, 230)";
DoubleSlider.prototype.sliderHandleWidth = 33;
DoubleSlider.prototype.sliderHandleHeight = 22;
DoubleSlider.prototype.sliderBackgroundHeight = 13;
DoubleSlider.prototype.fixColors = function(){
    var THIS = this;
    var portions = this.handles.map(function(item) { return parseInt(item.css("left")) / THIS.elt.width(); }).sortASC();
    this.leftBack.css("background-color", this.leftBackgroundColor);
    this.leftBack.css("width", (100*portions[0]) + "%");
    this.rightBack.css("background-color", this.rightBackgroundColor);
    this.rightBack.css("left", (100*portions[1]) + "%");
    this.rightBack.css("width", (100*(1-portions[1])) + "%");
}
DoubleSlider.prototype.snapToGrid = function(value){
    return this.step * Math.round(value/this.step);
},
DoubleSlider.prototype.init = function(){
    this.elt = $("#" + this.id);
    var THIS = this;
    this.elt.slider({
        min: this.min,
        max: this.max,
        step: this.step,
        values: this.values,
        slide: function(event, ui){
            THIS.fixColors();
            var small = ui.values.min();
            var big = ui.values.max();
            THIS.callback(small, big);
        },
        stop: function(event, ui){
            THIS.fixColors();
            var small = ui.values.min();
            var big = ui.values.max();
            THIS.callback(small, big);
        }
    });
    this.handleElt = this.elt.find("a");
    // Apply TSM slider classes and rely on CSS for styling
    this.elt.addClass("tsm-slider");
    this.handleElt.addClass("tsm-slider-handle");
    this.handles = UTIL.range(0, this.handleElt.length-1).map(function(index){ return $(THIS.handleElt[index]); });
    var lb = HtmlGen.div("", {id: this.id + "LeftBackground", "class": "ui-slider-range", "background-color": this.leftBackgroundColor});
    var rb = HtmlGen.div("", {id: this.id + "RightBackground", "class": "ui-slider-range", "background-color": this.rightBackgroundColor});
    this.elt.prepend($(rb));
    this.elt.prepend($(lb));
    this.leftBack = this.elt.find("#" + this.id + "LeftBackground");
    this.rightBack = this.elt.find("#" + this.id + "RightBackground");
    THIS.fixColors();
}
DoubleSlider.prototype.adjustTableCss = function(tableElt){
    if (Options.removeGreyBackgroundInSliderTables){
        return;
    }
    var bgColor = this.backgroundColor;
    var hBorder = "1px solid " + bgColor;
    tableElt.css({
        "background-color": bgColor,
        "border-left": hBorder,
        "border-right": hBorder
    });
}
DoubleSlider.prototype.get = function(){
    return this.elt.slider("values").sortASC();
}
DoubleSlider.prototype.setLower = function(valueExact, snap){
    var value = valueExact;
    if (snap){
        value = this.snapToGrid(valueExact);
    }
    var current = this.elt.slider("values");
    var val0 = current[0];
    var val1 = current[1];
    if (val0 < val1){
        if (value > val1){
            //console.log("illegal operation: right handle must be greater than left handle");
            return "ERROR";
        }
        this.elt.slider("values", 0, value);
    } else {
        if (value > val0){
            //console.log("illegal operation: right handle must be greater than left handle");
            return "ERROR";
        }
        this.elt.slider("values", 1, value);
    }
    this.fixColors();
    return "OK";
}
DoubleSlider.prototype.setUpper = function(valueExact, snap){
    var value = valueExact;
    if (snap){
        value = this.snapToGrid(valueExact);
    }
    var current = this.elt.slider("values");
    var val0 = current[0];
    var val1 = current[1];
    if (val0 < val1){
        if (value < val0){
            //console.log("illegal operation: right handle must be greater than left handle");
            return "ERROR";
        }
        this.elt.slider("values", 1, value);
    } else {
        if (value < val1){
            //console.log("illegal operation: right handle must be greater than left handle");
            return "ERROR";
        }
        this.elt.slider("values", 0, value);
    }
    this.fixColors();
    return "OK";
}
