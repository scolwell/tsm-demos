// buttonBar.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICE
function ButtonBar(options){
    // buttonLabels, idPrefix, callback
    // orientation, chosenButtonClass, selectedIndex, headerLabel, omitHeader, btnAtts, headerTag
    var alwaysCallback = "alwaysCallback" in options ? options.alwaysCallback : false;
    var idPrefix = "idPrefix" in options ? options.idPrefix : UTIL.randomIdentifier(20);
    this.idPrefix = idPrefix;
    var callback = "callback" in options ? options.callback : function(){}
    var orientation = "orientation" in options ? options.orientation : "horizontal";
    var selectedIndex = "selectedIndex" in options ? options.selectedIndex : 0;
    var omitHeader, headerLabel;
    if ("omitHeader" in options && options.omitHeader){
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
    var app = "app" in options ? options.app : null;
    var name = "name" in options ? options.name : "buttonBar";
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
    if (app != null){
        if ("controls" in app){
            app.controls[name] = this;
        } else {
            app[name] = this;
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
    this.app = app;
    this.name = name;
    this.chosenButtonClass = chosenButtonClass;
    this.buttonHtmlFunction = buttonHtmlFunction;
    this.btnsHtml = btnsHtml;
    this.tdsHtml = tdsHtml;
    this.html = html;
    this.alwaysCallback = alwaysCallback;
}
ButtonBar.prototype.init = function(){
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
    return function(evt){
        var oldSelectedIndex = BB.selectedIndex;
        if (BB.alwaysCallback){
        } else {
            if (index == oldSelectedIndex){
                return;
            }
        }
        BB.elts[oldSelectedIndex].removeClass(BB.chosenButtonClass);
        BB.elts[index].addClass(BB.chosenButtonClass);
        BB.selectedIndex = index;
        BB.callback(index, evt, this);
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
