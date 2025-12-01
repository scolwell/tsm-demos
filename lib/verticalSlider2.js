// verticalSlider2.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICEfunction VerticalSlider(options){
    var min = ("min" in options ? options.min : 0);
    var max = ("max" in options ? options.max: 1);
    var step = ("step" in options ? options.step : 0.01);
    var values = options.values;
    var callback = ("callback" in options ? options.callback : function(){});
    var size = (("size" in options && options.size in this.sizes) ? options.size : "regular");
    var id = options.id;
    var html = HtmlGen.div("", {id: id});
    this.html = html;
    this.min = min;
    this.max = max;
    this.step = step;
    this.values = values;
    this.callback = callback;
    this.id = id;
    this.size = size;
    this.sizeOptions = this.sizes[size];
}
VerticalSlider.prototype.sizes = {
    small: {
        width: 11,
        height: 16,
        leftMargin: 6,
        tdBorderThickness: 0,
        imgFileName: "verticalSliderHandle1116.png"
    },
    regular: {
        width: 17,
        height: 24,
        leftMargin: 3,
        tdBorderThickness: 3,
        imgFileName: "verticalSliderHandle1724.png"
    },
    big: {
        width: 22,
        height: 32,
        leftMargin: 0,
        tdBorderThickness: 4,
        imgFileName: "verticalSliderHandle2232.png"
    }
};
VerticalSlider.prototype.getBackground = function(){
    return "url(img/" + this.sizeOptions.imgFileName + ")";
}
VerticalSlider.prototype.backgroundColor = "rgb(230, 230, 230)";
VerticalSlider.prototype.VerticalSliderBackgroundWidth = 13;
VerticalSlider.prototype.init = function(){
    this.elt = $("#" + this.id);
    var THIS = this;
    this.elt.slider({
        orientation: "vertical",
        min: this.min,
        max: this.max,
        step: this.step,
        values: this.values,
        slide: function(event, ui){
            console.log(ui.values);
            THIS.callback(ui.values);
        },
        stop: function(event, ui){
            THIS.callback(ui.values);
        }
    });
    this.handleElt = this.elt.find("a");
    this.handleElt.css({
        background: this.getBackground(),
        border: "none",
        "margin-left": this.sizeOptions.leftMargin,
        "margin-bottom": -this.sizeOptions.height/2
    });
    this.handleElt.height(this.sizeOptions.height);
    this.handleElt.width(this.sizeOptions.width);
    this.elt.width(this.VerticalSliderBackgroundWidth);
    this.elt.css({
        "background-image": "url(img/verticalSliderBackground.png)",
        "background-repeat": "repeat-y",
        "border": "none"
    });
    this.adjustTdCss(this.elt.parent());
}
VerticalSlider.prototype.adjustTdCss = function(tdElt){
    var bgColor = this.backgroundColor;
    var hBorder = this.sizeOptions.tdBorderThickness + "px solid " + bgColor;
    tdElt.css({
        "background-color": bgColor,
        "border-left": hBorder,
        "border-right": hBorder
    });
}
VerticalSlider.prototype.get = function(){
    return this.elt.VerticalSlider("value");
}
VerticalSlider.prototype.set = function(value){
    return this.elt.VerticalSlider("value", value);
}