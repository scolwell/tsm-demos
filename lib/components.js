// components.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICE

var H = HtmlGen;
/*************************************************************************************************
 Button
*************************************************************************************************/
function Button(options){
    if (arguments.length < 1){
        console.log("Button: error: options missing");
        return;
    }
    var label = "label" in options ? options.label : this.defaults.label;
    var id = "id" in options ? options.id : UTIL.randomIdentifier(20);
    var atts = {id: id};
    if ("className" in options){
        atts = jQuery.extend(atts, {"class": options.className});
    }
    if ("style" in options){
        atts = Style.attachToAtts(atts, options.style);
    }
    this.html = H.btn(label, atts);
    var error = false;
    for (var i=0; i<this.mandatoryOptions.length; i++){
        var optionName = this.mandatoryOptions[i];
        if (!(optionName in options)){
            console.log("Button: error: mandatory argument " + optionName + " missing.");
            error = true;
        }
    }
    if (error){
        return;
    }
    this.app = options.app;
    var name = options.name;
    this.name = name;
    if (!("components" in this.app)){
        this.app.components = {};
    }
    this.app.components[name] = this;
    this.id = id;
    this.parentComponent = null;
}
Button.prototype.defaults = {
    label: "click me"
};
Button.prototype.mandatoryOptions = ["app", "name"];
Button.prototype.optionalOptions = ["label", "id", "className", "style"];

Button.prototype.init = function(){
    this.elt = $("#" + this.id);
    if (!("callbacks" in this.app)){
        console.log("Button: error: app object does't have field callbacks");
        return;
    }
    if (!(this.name in this.app.callbacks)){
        console.log("Button: error: app.callbacks does't have method " + this.name);
        return;        
    }
    this.elt.click(this.makeClickHandler());
}
Button.prototype.makeClickHandler = function(){
    var myName = this.name;
    var B = this;
    return function(evt){
        B.app.callbacks[myName](evt, B, B.app, this);
    }
}
/*************************************************************************************************
 SliderTable2
*************************************************************************************************/
function SliderTable2(size, app, name, options){
    if (!("style" in Slidr.prototype.defaults)){
        Slidr.prototype.defaults.style = new SliderStyle.triangle();
    }
    SliderTable2.prototype.defaults = Slidr.prototype.defaults;
    SliderTable2.prototype.defaults.xtra = {};
    var id = "id" in options ? options.id : UTIL.randomIdentifier(20);
    var THIS = this;
    this.app = app;
    this.name = name;
    if (!("components" in this.app)){
        this.app.components = {};
    }
    this.app.components[name] = this;
    this.id = id;
    this.parentComponent = null;
    function get(optionName, index){
        if (optionName in options){
            var value = options[optionName];
            var type = typeof value;
            if (type == "string" || type == "number"){
                return value;
            }
            if (type == "object"){
                if (value.constructor == Array){
                    return value[index];
                }
                return value;
            }
            if (type == "function"){
                return value(index);
            }
            return value;
        }
        return THIS.defaults[optionName];
    }
    var optsArr = new Array(size);
    for (var i=0; i<size; i++){
        optsArr[i] = {};
        optsArr[i].id    = id + i;
        optsArr[i].label = get("label", i);
        optsArr[i].min   = get("min", i);
        optsArr[i].max   = get("max", i);
        optsArr[i].value = get("value", i);
        optsArr[i].step  = get("step", i);
        optsArr[i].style = get("style", i);
        optsArr[i].xtra  = get("xtra", i);
        optsArr[i].app = app;
        optsArr[i].name = name + i;
    }
    var sliders = new Array(size);
    var trs = "";
    for (var i=0; i<size; i++){
        var sli = new SliderPlus(optsArr[i], i);
        sliders[i] = sli;
        trs += H.tr(H.thLeft(optsArr[i].label, {"class": "lineBreakDisabled"}) + sli.sliderHtml + sli.valueHtml);
        sli.parentComponent = this;
    }
    var html = H.table(trs, {"class": "fullWidth"});
    this.html = html;
    this.sliders = sliders;
}
SliderTable2.prototype.init = function(){
    var sliders = this.sliders;
    for (var i=0; i<sliders.length; i++){
        var sli = sliders[i];
        sli.initIndexed(this.name);
    }
}

/*************************************************************************************************
 Slider
*************************************************************************************************/
function Slidr(options){
    if (!("style" in Slidr.prototype.defaults)){
        Slidr.prototype.defaults.style = new SliderStyle.triangle();
    }
    if (arguments.length < 1){
        console.log("Slider: error: options missing");
        return;
    }
    var id = "id" in options ? options.id : UTIL.randomIdentifier(20);
    var xtraCallback = "xtraCallback" in options ? options.xtraCallback : null;
    var THIS = this;
    function get(optionName){
        if (optionName in options) return options[optionName];
        return THIS.defaults[optionName];
    }
    var min = get("min");
    var max = get("max");
    var step = get("step");
    var value = get("value");
    var style = get("style");
    var get2 = (typeof style == "object") ?
        function(optionName){
            if (!(optionName in style)){
                console.log("Slidr: error: missing style option: " + optionName);
                return THIS.defaults.otherStyle[optionName];
            }
            return style[optionName]
        } :
        function(optionName){
            if (optionName in options) return options[optionName];
            return style == "jQuery" ? null : THIS.defaults[style][optionName];
        }
    var backgroundColor = get2("backgroundColor");
    var backgroundImageURL = get2("backgroundImageURL");
    var border = get2("border");
    var handleWidth = get2("handleWidth");
    var handleHeight = get2("handleHeight");
    var backgroundHeight = get2("backgroundHeight");
    var handleBorder = get2("handleBorder");
    //var handleBackgroundImageURL = get2("handleBackgroundImageURL");
    var handleMarginTop = get2("handleMarginTop");
    var handleInactive = get2("handleInactive");
    var handleActive = get2("handleActive");
    var handleHovered = get2("handleHovered");
    var html = H.div("", {id: id});
    var error = false;
    for (var i=0; i<this.mandatoryOptions.length; i++){
        var optionName = this.mandatoryOptions[i];
        if (!(optionName in options)){
            console.log("Slider: error: mandatory argument " + optionName + " missing.");
            error = true;
        }
    }
    if (error){
        return;
    }
    this.app = options.app;
    var name = options.name;
    this.name = name;
    if (!("components" in this.app)){
        this.app.components = {};
    }
    this.app.components[name] = this;
    
    this.html = html;
    this.id = id;
    this.xtraCallback = xtraCallback;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
    this.backgroundColor = backgroundColor;
    this.backgroundImageURL = backgroundImageURL;
    this.border = border;
    this.handleWidth = handleWidth;
    this.handleHeight = handleHeight;
    this.backgroundHeight = backgroundHeight;
    this.handleBorder = handleBorder;
    //this.handleBackgroundImageURL = handleBackgroundImageURL;
    this.handleMarginTop = handleMarginTop;
    this.handleInactive = handleInactive;
    this.handleActive = handleActive;
    this.handleHovered = handleHovered;
    this.style = style;
    this.parentComponent = null;
}
SliderStyle = {
    triangle: function(options){
        if (arguments.length < 1){
            options = {};
        }
        var height = "height" in options ? options.height: 23;
        var h = height;
        var w = (2/Math.sqrt(3)) * h;
        var halfW = Math.round(w/2);
        var color;
        var fullColorActive   = "colorActive"   in options && ((color = RGB.fromString(options.colorActive))   != null) ? color : new RGB(70,120,70);
        var fullColorInactive = "colorInactive" in options && ((color = RGB.fromString(options.colorInactive)) != null) ? color : new RGB(90,90,160);
        var white = new RGB(255, 255, 255);
        var centerX = w/2;
        var centerY = h/3;
        var centerOffsetFactorX = 1;
        var centerOffsetFactorY = 0.75;
        var cX = centerX * centerOffsetFactorX;
        var cY = centerY * centerOffsetFactorY;
        var numSteps = 10;
        var colorsActive = new Array(numSteps);
        var colorsInactive = new Array(numSteps);
        for (var step = numSteps-1; step >= 0; step--){
            var portion = (step+0.5)/numSteps;
            var p1 = 1 - portion;
            var pp = p1 * p1;
            var pppp = pp * pp;
            var colorMixActive   =   fullColorActive.mixWith(white, 4*(portion+0.25)*pppp);
            var colorMixInactive = fullColorInactive.mixWith(white, 4*(portion+0.25)*pppp);
            colorsActive[step] = colorMixActive;
            colorsInactive[step] = colorMixInactive;
        }
        var parentElt = $("#dummy");
        var colors = colorsActive;
        var drawBorder = true;
        var opts = {
            parentElt: parentElt,
            width: 2*halfW,
            height: h,
            drawingCallback: function(ctx, width, height){
                //var color = ctx.createRadialGradient(centerX, centerY, rInner, centerX1, centerY1, rOuter);
                //color.addColorStop(0, colorBright);
                //color.addColorStop(1, colorDark);
                for (var step = numSteps-1; step >= 0; step--){
                    var colorMix = colors[step];
                    colorMix.setAsFill(ctx);
                    var portion = (step+0.5)/numSteps;
                    var a = portion, b = 1 - portion;
                    var p1x = a * 0       + b * cX, p1y = a * 0      + b * cY;
                    var p2x = a * width   + b * cX, p2y = a * 0      + b * cY;
                    var p3x = a * width/2 + b * cX, p3y = a * height + b * cY;
                    ctx.beginPath();
                    ctx.moveTo(p1x, p1y);
                    ctx.lineTo(p2x, p2y);
                    ctx.lineTo(p3x, p3y);
                    ctx.lineTo(p1x, p1y);
                    ctx.fill();
                }
                if (drawBorder){
                    ctx.strokeStyle = "black";
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(width, 0);
                    ctx.lineTo(width/2, height);
                    ctx.lineTo(0, 0);
                    ctx.stroke();
                }
            }
        };
        var imgSrcActive = H.makeImageWithCanvas(opts).src;
        colors = colorsInactive;
        var imgSrcHovered = H.makeImageWithCanvas(opts).src;
        drawBorder = false;
        var imgSrcInactive = H.makeImageWithCanvas(opts).src;
        return {
            backgroundColor: "rgb(230,230,230)",
            backgroundImageURL: Slidr.prototype.defaults.standardBackgroundImg,
            border: "none",
            handleWidth: opts.width,
            handleHeight: opts.height,
            backgroundHeight: 13,
            handleBorder: "none",
            handleInactive: imgSrcInactive,
            handleActive: imgSrcActive,
            handleHovered: imgSrcHovered,
            handleMarginTop: 1
        };
    }
};
Slidr.prototype.defaults = {
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.5,
    standardBackgroundImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAANCAYAAABsItTPAAAAPUlEQVQImX3HoQ0AQQgEwC2ferBIEnqgDQh6X60482LEoLspMDPKm8ykICIocHfKT6qKgpmh4O4o2F3Kkw9fmoFq+pnaKQAAAABJRU5ErkJggg==",
    otherStyle: {
        backgroundColor: "rgb(230,230,230)",
        border: "none",
        handleWidth: 33,
        handleHeight: 22,
        backgroundHeight: 13,
        handleBorder: "none",
        //handleBackgroundImageURL: "img/sliderHandle.png",
        handleBackgroundImageURL: "data:image/png;base64,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",
        handleMarginTop: 1
    },
    bigStyle: {
        backgroundColor: "rgb(230,230,230)",
        border: "none",
        handleWidth: 22,
        handleHeight: 33,
        backgroundHeight: 18,
        handleBorder: "none",
        handleInactive: "data:image/png;base64,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",
        handleActive: "data:image/png;base64,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",
        handleMarginTop: 1
    },
    smallStyle: {
        backgroundColor: "rgb(230,230,230)",
        border: "none",
        handleWidth: 10,
        handleHeight: 19,
        backgroundHeight: 11,
        handleBorder: "none",
        handleInactive: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAATCAYAAACp65zuAAABIElEQVQokW3Nu4rCQACF4XmSfUBFmMYHsLRyWkEEwUbsZMhLpA3KjKTYOhcvmURMBv4tltUdnAN/98ERaZqilEJKGU0pRZqmCKUUeZ7jvY+W5znz+RwhpcR7z/1+j+a9R0r5C4dh4Ha7RRuGIYTX6zXaB6wvl2ifsK6jBbDve8qyjNb3fQiLoogWwK7rOJ/P0bque8O2bTHGRGvbNoSn0ynaB7TWcjweg6y1b7jf70mSBOccxhiyLCPLMowxOOdIkoTpdIqo65rNZoPWGufc69I5h9aa0WjEer1GALOiKFitVmitaZqGpmnQWjMej1kul1hrv4UQIsCHwwGtNZPJ5IUej8eX+Bswq6qK7XbLYrFgt9t9ov/4+XxSVRVlWQboBx8YYZ19t++zAAAAAElFTkSuQmCC",
        handleActive: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAATCAYAAACp65zuAAABTklEQVQokW3Ov0sCYRzH8ecvcIwc+hOacm2IhsAIjGgMDtya4uYoGpKmoM3gcFDhBveiIWmQLO5MkU4JAjm7ND3P8+edz6V8GiTs6Z4vvLcXfL4kdlt/CIlZBCMyt5CYRexGPyEhMYtMqQPHm3HLlDpYPbwDCUZkON4M750JN8ebIRiR53BIp3gzXW5DOmVhte1y88Hyl8PND5sONwb23SkKxphb3/0HlY8RNwY2Bh7kgsmtMfAW0OhRJJU2N6NHWZh4anHzwbRqQsq3mNKquYB7V0VEExXo9nw+nmsinmsiqbSh2xTRRAUr+xmQcsOhW+fPECQNur14QbcpBEnDUjiJzbM8iGUhoNRHdOP0EYKkodadoNadzNF2CuvHOaRUUySEEAYfXL9CkDQs76RZ9HuWhUDRGNPwhYK1o3vsXr740V/cdb5p8XMMtT5i0A/TCzaXJyp8FwAAAABJRU5ErkJggg==",
        handleMarginTop: 1
    }
};
Slidr.prototype.defaults.otherStyle.handleInactive = Slidr.prototype.defaults.otherStyle.handleBackgroundImageURL;
Slidr.prototype.defaults.otherStyle.handleActive   = Slidr.prototype.defaults.otherStyle.handleBackgroundImageURL;
Slidr.prototype.defaults.otherStyle.handleHovered  = Slidr.prototype.defaults.otherStyle.handleBackgroundImageURL;
Slidr.prototype.defaults.otherStyle.backgroundImageURL = Slidr.prototype.defaults.standardBackgroundImg;
Slidr.prototype.defaults.bigStyle.backgroundImageURL = Slidr.prototype.defaults.standardBackgroundImg;
Slidr.prototype.defaults.smallStyle.backgroundImageURL = Slidr.prototype.defaults.standardBackgroundImg;
Slidr.prototype.defaults.bigStyle.handleHovered = Slidr.prototype.defaults.bigStyle.handleActive;
Slidr.prototype.defaults.smallStyle.handleHovered = Slidr.prototype.defaults.smallStyle.handleActive;


Slidr.prototype.mandatoryOptions = ["app", "name"];
Slidr.prototype.optionalOptions = ["id", "min", "max", "step", "value", "backgroundColor", "backgroundImageURL", "border", "handleWidth", "handleHeight", "backgroundHeight", "handleBorder", "handleBackgroundImageURL", "handleMarginTop"];
Slidr.prototype.init = function(){
    this.active = false;
    var myName = this.name;
    this.elt = $("#" + this.id);
    var THIS = this;
    if (!("callbacks" in this.app)){
        console.log("Slider: error: app object does't have field callbacks");
        return;
    }
    if (!(this.name in this.app.callbacks)){
        console.log("Slider: error: app.callbacks does't have method " + this.name);
        return;
    }
    if (this.xtraCallback != null){
        this.elt.slider({
            min: this.min,
            max: this.max,
            step: this.step,
            value: this.value,
            slide: function(event, ui){
                THIS.active = true;
                var value = ui.value;
                THIS.xtraCallback(value, "slide", THIS, THIS.app, event, ui);
                THIS.app.callbacks[myName](value, "slide", THIS, THIS.app, event, ui);
                if (THIS.style == "jQuery"){
                    return;
                }
                THIS.handleElt.css({
                    background: H.wrapURL(THIS.handleActive),
                });
            },
            stop: function(event, ui){
                THIS.active = false;
                var value = ui.value;
                THIS.xtraCallback(value, "stop", THIS, THIS.app, event, ui);
                THIS.app.callbacks[myName](value, "stop", THIS, THIS.app, event, ui);
                if (THIS.style == "jQuery"){
                    return;
                }
                THIS.handleElt.css({
                    background: H.wrapURL(THIS.handleInactive),
                });
            }
        });
    } else {
        this.elt.slider({
            min: this.min,
            max: this.max,
            step: this.step,
            value: this.value,
            slide: function(event, ui){
                THIS.active = true;
                var value = ui.value;
                THIS.app.callbacks[myName](value, "slide", THIS, THIS.app, event, ui);
                if (THIS.style == "jQuery"){
                    return;
                }
                THIS.handleElt.css({
                    background: H.wrapURL(THIS.handleActive),
                });
            },
            stop: function(event, ui){
                THIS.active = false;
                var value = ui.value;
                THIS.app.callbacks[myName](value, "stop", THIS, THIS.app, event, ui);
                if (THIS.style == "jQuery"){
                    return;
                }
                THIS.handleElt.css({
                    background: H.wrapURL(THIS.handleInactive),
                });
            }
        });
    }
    if (this.style == "jQuery"){
        return;
    }
    this.handleElt = this.elt.find("a");
    this.handleElt.css({
        background: H.wrapURL(THIS.handleInactive),
        border: this.handleBorder,
        "margin-left": -this.handleWidth*0.5,
        "margin-top": this.handleMarginTop
    });
    this.handleElt.hover(
        function(){
            if (THIS.active) return;
            THIS.handleElt.css({
                background: H.wrapURL(THIS.handleHovered)
            });
        },
        function(){
            if (THIS.active) return;
            THIS.handleElt.css({
                background: H.wrapURL(THIS.handleInactive)
            });
        }
    );
    this.handleElt.height(this.handleHeight);
    this.handleElt.width(this.handleWidth);
    this.elt.height(this.backgroundHeight);
    this.elt.css({
        "background-image": H.wrapURL(this.backgroundImageURL),
        "background-repeat": "repeat-x",
        "border": this.border
    });
}
Slidr.prototype.initIndexed = function(name, index){
    this.index = index;
    this.active = false;
    this.elt = $("#" + this.id);
    var THIS = this;
    if (!("callbacks" in this.app)){
        console.log("Slider: error: app object does't have field callbacks");
        return;
    }
    if (!(name in this.app.callbacks)){
        console.log("Slider: error: app.callbacks does't have method " + name);
        return;
    }
    this.elt.slider({
        min: this.min,
        max: this.max,
        step: this.step,
        value: this.value,
        slide: function(event, ui){
            THIS.active = true;
            var value = ui.value;
            THIS.parentComponent.valueElt.html(THIS.parentComponent.formatVal(value));
            THIS.app.callbacks[name](index, value, "slide", THIS, THIS.app, event, ui);
            if (THIS.style == "jQuery"){
                return;
            }
            THIS.handleElt.css({
                background: H.wrapURL(THIS.handleActive),
            });
        },
        stop: function(event, ui){
            THIS.active = false;
            var value = ui.value;
            THIS.parentComponent.valueElt.html(THIS.parentComponent.formatVal(value));
            THIS.app.callbacks[name](index, value, "stop", THIS, THIS.app, event, ui);
            if (THIS.style == "jQuery"){
                return;
            }
            THIS.handleElt.css({
                background: H.wrapURL(THIS.handleInactive),
            });
        }
    });
    if (this.style == "jQuery"){
        return;
    }
    this.handleElt = this.elt.find("a");
    this.handleElt.css({
        background: H.wrapURL(THIS.handleInactive),
        border: this.handleBorder,
        "margin-left": -this.handleWidth*0.5,
        "margin-top": this.handleMarginTop
    });
    this.handleElt.hover(
        function(){
            if (THIS.active) return;
            THIS.handleElt.css({
                background: H.wrapURL(THIS.handleHovered)
            });
        },
        function(){
            if (THIS.active) return;
            THIS.handleElt.css({
                background: H.wrapURL(THIS.handleInactive)
            });
        }
    );
    this.handleElt.height(this.handleHeight);
    this.handleElt.width(this.handleWidth);
    this.elt.height(this.backgroundHeight);
    this.elt.css({
        "background-image": H.wrapURL(this.backgroundImageURL),
        "background-repeat": "repeat-x",
        "border": this.border
    });
}
Slidr.prototype.get = function(){
    return this.elt.slider("value");
}
Slidr.prototype.set = function(value){
    return this.elt.slider("value", value);
}
/*************************************************************************************************
SliderPlus
*************************************************************************************************/
function SliderPlus(sliderOptions, index){
    var xtra;
    if ("xtra" in sliderOptions){
        xtra = sliderOptions.xtra;
    } else {
        xtra = {};
    }
    function updateValueElt(value, mode, component, app, event, ui){
        component.parentComponent.valueElt.html(component.parentComponent.formatVal(value));
    }
    var sOpts;
    if (arguments.length == 1){
        sOpts = jQuery.extend({xtraCallback: updateValueElt}, sliderOptions);
    } else {
        sOpts = sliderOptions;
        this.index = index;
    }
    var sliWidth = "sliWidth" in xtra ? xtra.sliWidth : this.defaults.sliWidth;
    var valWidth = "valWidth" in xtra ? xtra.valWidth : this.defaults.valWidth;
    this.slider = new Slidr(sOpts);
    this.slider.parentComponent = this;
    this.app = this.slider.app;
    this.name = this.slider.name + "Parent";
    this.app.components[this.name] = this;
    this.valueId = this.slider.id + "Value";
    this.sliderTdId = this.slider.id + "Td";
    var sliTdAtts = Style.attachToAtts({id: this.sliderTdId}, {width: sliWidth});
    this.sliderHtml = H.td(this.slider.html, sliTdAtts);
    var valAtts = Style.attachToAtts({id: this.valueId}, {"min-width": valWidth});
    this.valueHtml = H.tdRight("", valAtts);
    this.sliWidth = sliWidth;
    this.valWidth = valWidth;
    this.parentComponent = null;
    if ("formatFun" in xtra){
        this.formatFun = xtra.formatFun;
        this.formatVal = this.customFormatVal;
    } else {
        if ("formatStr" in xtra){
            this.formatStr = xtra.formatStr;
        } else {
            this.formatVal = this.identityFormat;
        }
    }
}
SliderPlus.prototype.init = function(){
    var valueElt = $("#" + this.valueId);
    this.valueElt = valueElt;
    this.slider.init();
    this.updateVal();
}
SliderPlus.prototype.initIndexed = function(name){
    var valueElt = $("#" + this.valueId);
    this.valueElt = valueElt;
    var index = this.index;
    this.slider.initIndexed(name, index);
    this.updateVal();
}
SliderPlus.prototype.defaults = {
    sliWidth: "100%",
    valWidth: "36px"
}
SliderPlus.prototype.identityFormat = function(x){
    return x;
}
SliderPlus.prototype.formatVal = function(x){
    return this.formatStr.sprintf(x);
}
SliderPlus.prototype.customFormatVal = function(x){
    return this.formatFun(x);
}

SliderPlus.prototype.updateVal = function(){
    this.valueElt.html(this.formatVal(this.slider.get()));
}
SliderPlus.prototype.get = function(){
    return this.slider.get();
}
SliderPlus.prototype.set = function(value){
    this.slider.set(value);
    this.updateVal();
    return this;
}


// value elt is td with id that is that of the slider with "Value" appended
// slider elt is wrapped in td with width 100%
// callback updates the value elt, and otherwise does the same the slider callback did
// value elt needs optional custom format function
// optional parameter format string
// atts, className, and style for value elt


/*************************************************************************************************
SliderTable
*************************************************************************************************/
function SliderTable(app, name, optionsArr){
    var sliders = new Array(optionsArr.length);
    var trs = "";
    for (var i=0; i<sliders.length; i++){
        var sli = new SliderPlus(jQuery.extend({app: app}, optionsArr[i]));
        sliders[i] = sli;
        trs += H.tr(H.thLeft(optionsArr[i].label, {"class": "lineBreakDisabled"}) + sli.sliderHtml + sli.valueHtml);
        sli.parentComponent = this;
    }
    var html = H.table(trs, {"class": "fullWidth"});
    this.html = html;
    this.sliders = sliders;
    this.app = app;
    this.name = name;
    this.parentComponent = null;
    this.app.components[this.name] = this;
}
SliderTable.prototype.init = function(){
    var sliders = this.sliders;
    for (var i=0; i<sliders.length; i++){
        var sli = sliders[i];
        sli.init();
    }
}
/*************************************************************************************************
ButtonBar
*************************************************************************************************/
function ButtonBar(options){
    // buttonLabels, idPrefix, callback
    // orientation, chosenButtonClass, selectedIndex, headerLabel, omitHeader, btnAtts, headerTag
    var error = false;
    for (var i=0; i<this.mandatoryOptions.length; i++){
        var optionName = this.mandatoryOptions[i];
        if (!(optionName in options)){
            console.log("ButtonBar: error: mandatory argument " + optionName + " missing.");
            error = true;
        }
    }
    if (error){
        return;
    }
    this.app = options.app;
    var name = options.name;
    this.name = name;
    if (!("components" in this.app)){
        this.app.components = {};
    }
    this.app.components[name] = this;
    this.parentComponent = null;
    var idPrefix = "idPrefix" in options ? options.idPrefix : UTIL.randomIdentifier(20);
    this.idPrefix = idPrefix;
    var callback = "callback" in options ? options.callback : function(){}
    var orientation = "orientation" in options ? options.orientation : "horizontal";
    var selectedIndex = "selectedIndex" in options ? options.selectedIndex : 0;
    var omitHeader, headerLabel;
    if ("omitHeader" in options && options[omitHeader]){
        omitHeader = true;
        headerLabel = "";
    } else {
        omitHeader = false;
        headerLabel = "headerLabel" in options ? options.headerLabel : "";
    }
    var tableTag = "tableTag" in options ? options.tableTag : "table";
    var headerTag = "headerTag" in options ? options.headerTag : "th";
    var tdTag = "tdTag" in options ? options.tdTag : "td";
    var trTag = "trTag" in options ? options.trTag : "tr";
    var btnTag = "btnTag" in options ? options.btnTag : "btn";
    var tableAtts = "tableAtts" in options ? options.tableAtts : {};
    var headerAtts = "headerAtts" in options ? options.headerAtts : {};
    var tdAtts = "tdAtts" in options ? options.tdAtts : {};
    var trAtts = "trAtts" in options ? options.trAtts : {};
    var btnAtts = "btnAtts" in options ? options.btnAtts : {};
    var tableStyle = "tableStyle" in options ? options.tableStyle : {};
    var headerStyle = "headerStyle" in options ? options.headerStyle : {};
    var tdStyle = "tdStyle" in options ? options.tdStyle : {};
    var trStyle = "trStyle" in options ? options.trStyle : {};
    var btnStyle = "btnStyle" in options ? options.btnStyle : {};
    tableAtts = Style.attachToAtts(tableAtts, tableStyle);
    headerAtts = Style.attachToAtts(headerAtts, headerStyle);
    tdAtts = Style.attachToAtts(tdAtts, tdStyle);
    trAtts = Style.attachToAtts(trAtts, trStyle);
    btnAtts = Style.attachToAtts(btnAtts, btnStyle);
    if ("headerClass" in options){
        headerAtts["class"] = options.headerClass;
    }
    if ("tdClass" in options){
        tdAtts["class"] = options.tdClass;
    }
    if ("trClass" in options){
        trAtts["class"] = options.trClass;
    }
    if ("btnClass" in options){
        btnAtts["class"] = options.btnClass;
    }
    if ("tableClass" in options){
        tableAtts["class"] = options.tableClass;
    }
    tableStyle = "style" in tableAtts ? tableAtts.style : "";
    headerStyle = "style" in headerAtts ? headerAtts.style : "";
    tdStyle = "style" in tdAtts ? tdAtts.style : "";
    trStyle = "style" in trAtts ? trAtts.style : "";
    btnStyle = "style" in btnAtts ? btnAtts.style : "";
    var chosenButtonClass = "chosenButtonClass" in options ? options.chosenButtonClass : "bold";
    var buttonLabelFunction = "buttonLabelFunction" in options ? options.buttonLabelFunction : this.defaultButtonLabelFunction;
    var numButtons;
    var buttonLabels;
    if ("buttonLabels" in options){
        buttonLabels = options.buttonLabels;
        numButtons = buttonLabels.length;
        buttonLabelFunction = function(index){ return buttonLabels[index]; }
    } else {
        numButtons = "numButtons" in options ? options.numButtons : 3;
        buttonLabels = new Array(numButtons);
        for (var i=0; i<numButtons; i++){
            buttonLabels[i] = buttonLabelFunction(i);
        }
    }
    var THIS = this;
    function defaultButtonHtmlFunction(index){
        return HtmlGen[btnTag](buttonLabels[i], jQuery.extend({id: THIS.makeButtonId(index)}, btnAtts));
    }
    var buttonHtmlFunction = "buttonHtmlFunction" in options ? options.buttonHtmlFunction : defaultButtonHtmlFunction;
    var btnsHtml = new Array(numButtons);
    var tdsHtml = new Array(numButtons);
    function tdHtmlFunction(index){
        return HtmlGen[tdTag](btnsHtml[index], jQuery.extend({id: THIS.makeTdId(index)}, tdAtts));
    }
    for (var i=0; i<numButtons; i++){
        btnsHtml[i] = buttonHtmlFunction(i);
        tdsHtml[i] = tdHtmlFunction(i);
    }
    var html;
    if (orientation == "horizontal"){
        var header = omitHeader ? "" : HtmlGen[headerTag](headerLabel, jQuery.extend({id: this.makeHeaderId()}, headerAtts));
        html = HtmlGen[tableTag](
            HtmlGen[trTag](header + tdsHtml.join(""), jQuery.extend({id: this.makeTrIdHorizontal()}, trAtts))
            , jQuery.extend({id: this.makeTableId()}, tableAtts)
        );
    } else {
        if (orientation == "vertical"){
            var header = omitHeader ? "" : HtmlGen[trTag](
                HtmlGen[headerTag](headerLabel, jQuery.extend({id: this.makeHeaderId()}, headerAtts))
                , jQuery.extend({id: this.makeTrIdVertical(-1)}, trAtts)
            );
            var trsHtml = new Array(numButtons);
            for (var i=0; i<numButtons; i++){
                trsHtml[i] = HtmlGen[trTag](tdsHtml[i], jQuery.extend({id: this.makeTrIdVertical(i)}, trAtts));
            }
            this.trsHtml = trsHtml;
            html = HtmlGen[tableTag](
                header + trsHtml.join("")
                , jQuery.extend({id: this.makeTableId()}, tableAtts)
            );
        } else {
            if (orientation != "omit"){
                console.log("warning: unknown orientation option: " +orientation+ " assuming 'omit' is wanted.");
                orientation = "omit";
            }
        }
    }
    //
    this.callback = callback;
    this.orientation = orientation;
    this.selectedIndex = selectedIndex;
    this.omitHeader = omitHeader;
    this.headerLabel = headerLabel;
    this.tableTag = tableTag;
    this.headerTag = headerTag;
    this.tdTag = tdTag;
    this.trTag = trTag;
    this.btnTag = btnTag;
    this.tableAtts = tableAtts;
    this.headerAtts = headerAtts;
    this.tdAtts = tdAtts;
    this.trAtts = trAtts;
    this.btnAtts = btnAtts;
    this.tableStyle = tableStyle;
    this.headerStyle = headerStyle;
    this.tdStyle = tdStyle;
    this.trStyle = trStyle;
    this.btnStyle = btnStyle;
    this.buttonLabelFunction = buttonLabelFunction;
    this.buttonLabels = buttonLabels;
    this.numButtons = numButtons;
    this.chosenButtonClass = chosenButtonClass;
    this.buttonHtmlFunction = buttonHtmlFunction;
    this.btnsHtml = btnsHtml;
    this.tdsHtml = tdsHtml;
    this.html = html;
}
ButtonBar.prototype.mandatoryOptions = ["app", "name"];
ButtonBar.prototype.optionalOptions = [
    "idPrefix", "callback", "orientation", "selectedIndex", "tableTag", "headerTag", "tdTag", "trTag", "btnTag", "tableAtts", "headerAtts",
    "tdAtts", "trAtts", "btnAtts", "tableStyle", "headerStyle", "tdStyle", "trStyle", "btnStyle", "omitHeader", "headerLabel",
    "headerClass", "tdClass", "trClass", "btnClass", "tableClass"
];

ButtonBar.prototype.init = function(){
    if (!("callbacks" in this.app)){
        console.log("ButtonBar: error: app object does't have field callbacks");
        return;
    }
    if (!(this.name in this.app.callbacks)){
        console.log("ButtonBar: error: app.callbacks does't have method " + this.name);
        return;        
    }
    this.elts = new Array(this.numButtons);
    this.tdElts = new Array(this.numButtons);
    for (var i=0; i<this.numButtons; i++){
        var btnElt = $("#" + this.makeButtonId(i));
        this.elts[i] = btnElt;
        btnElt.click(this.makeClickHandler(i));
        var tdElt = $("#" + this.makeTdId(i));
        this.tdElts[i] = tdElt;
    }
    this.elts[this.selectedIndex].addClass(this.chosenButtonClass);
    if (this.orientation == "horizontal"){
        this.trElt = $("#" + this.makeTrIdHorizontal());
    }
    if (this.orientation != "omit"){
        this.tableElt = $("#" + this.makeTableId());
    }
}
ButtonBar.prototype.makeClickHandler = function(index){
    var BB = this;
    var myName = this.name;
    return function(evt){
        var oldSelectedIndex = BB.selectedIndex;
        if (index == oldSelectedIndex){
            return;
        }
        BB.elts[oldSelectedIndex].removeClass(BB.chosenButtonClass);
        BB.elts[index].addClass(BB.chosenButtonClass);
        BB.selectedIndex = index;
        BB.app.callbacks[myName](index, evt, BB, BB.app, this);
    }
}
ButtonBar.prototype.makeButtonId = function(index){
    return this.idPrefix + "Button" + index;
}
ButtonBar.prototype.makeTdId = function(index){
    return this.idPrefix + "Td" + index;
}
ButtonBar.prototype.makeTrIdVertical = function(index){
    if (index < 0){
        return this.idPrefix + "TrHeader";
    } else {
        return this.idPrefix + "Tr" + index;
    }
}
ButtonBar.prototype.makeTrIdHorizontal = function(){
    return this.idPrefix + "Tr";
}
ButtonBar.prototype.makeHeaderId = function(index){
    return this.idPrefix + "Th";
}
ButtonBar.prototype.makeTableId = function(index){
    return this.idPrefix + "Table";
}
ButtonBar.prototype.defaultButtonLabelFunction = function(index){
    return "&nbsp;" + index + "&nbsp;";
}
