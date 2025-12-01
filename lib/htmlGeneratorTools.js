// htmlGeneratorTools.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICE
HtmlGen = {
    nodeWithAtts : function(tagName, content, atts){
        if ( arguments.length < 3 ) atts = {};
        var openTag =  "<" +tagName;
        for ( var attName in atts ){
            openTag += " ";
            openTag += attName;
            openTag += '="';
            openTag += atts[attName];
            openTag += '"';
        }
        openTag += ">";
        var closeTag =  "</" +tagName+ ">";
        return openTag + content + closeTag;
    },
    italic: function(content){
        return this.span(content, {style: "font-style: italic;"});
    },
    bold: function(content){
        return this.span(content, {style: "font-weight: bold;"});
    },
    boldItalic: function(content){
        return this.span(content, {style: "font-weight: bold; font-style: italic;"});
    },
    a : function(content, atts){
        return this.nodeWithAtts("a", content, atts);
    },
    ul : function(content, atts){
        return this.nodeWithAtts("ul", content, atts);
    },
    ol : function(content, atts){
        return this.nodeWithAtts("ol", content, atts);
    },
    b : function(content, atts){
        return this.nodeWithAtts("b", content, atts);
    },
    li : function(content, atts){
        return this.nodeWithAtts("li", content, atts);
    },
    h1 : function(content, atts){
        return this.nodeWithAtts("h1", content, atts);
    },
    h2 : function(content, atts){
        return this.nodeWithAtts("h2", content, atts);
    },
    h3 : function(content, atts){
        return this.nodeWithAtts("h3", content, atts);
    },
    h4 : function(content, atts){
        return this.nodeWithAtts("h4", content, atts);
    },
    h5 : function(content, atts){
        return this.nodeWithAtts("h5", content, atts);
    },
    h6 : function(content, atts){
        return this.nodeWithAtts("h6", content, atts);
    },
    small : function(content, atts){
        return this.nodeWithAtts("small", content, atts);
    },
    fieldset : function(content, atts){
        return this.nodeWithAtts("fieldset", content, atts);
    },
    legend : function(content, atts){
        return this.nodeWithAtts("legend", content, atts);
    },
    iframe: function(atts){
        return this.nodeWithAtts("iframe", "", atts);
    },
    sub: function(content, atts){
        return this.nodeWithAtts("sub", content, atts);
    },
    sup: function(content, atts){
        return this.nodeWithAtts("sup", content, atts);
    },
    overlineSpan: function(content, atts){
        var attsClone = {};
        if (atts){
            for ( var attName in atts ){
                attsClone[attName] = atts[attName];
            }
        }
        var style = atts && "style" in atts ? atts.style + " " : "";
        style += "text-decoration:overline";
        attsClone.style = style;
        return this.nodeWithAtts("span", content, attsClone);
    },
    underlineSpan: function(content, atts){
        var attsClone = {};
        if (atts){
            for ( var attName in atts ){
                attsClone[attName] = atts[attName];
            }
        }
        var style = atts && "style" in atts ? atts.style + " " : "";
        style += "text-decoration:underline";
        attsClone.style = style;
        return this.nodeWithAtts("span", content, attsClone);
    },
    overBar: function(content){
        // only for single letters
        return content + "&#772;"
    },
    overHat: function(content){
        return content + "&circ;";
    },
    withIndex: function(content, index){
        return content + this.sub(index);
    },
    /*
     fieldset : function(content){
     return this.div(content, {"class": "fieldset"});
     },
     legend : function(content){
     return this.h1(content, {"class" : "legend"});
     },
     */
    checkbox : function(checked, atts, content){
        if ( arguments.length < 3 ){
            content = "";
        }
        if ( arguments.length < 2 ){
            atts = {};
        }
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "checkbox";
        if ( checked ){
            attsClone.checked = "yes";
        }
        return this.nodeWithAtts("input", content, attsClone);
    },
    makeTable : function(rows){
        var result = "<table>";
        for ( var i=0; i<rows.length; i++ ){
            result += rows[i];
        }
        result += "</table>";
        return result;
    },
    makeTableRow : function(cols, attobjVec){
        var result = "<tr>";
        if ( arguments.length < 2 ){
            for ( var i=0; i<cols.length; i++ ){
                result += this.td(cols[i]);
            }
        } else {
            for ( var i=0; i<cols.length; i++ ){
                result += this.td(cols[i], attobjVec[i]);
            }
        }
        result += "</tr>";
        return result;
    },
    makeTableHeaderRow : function(cols){
        var result = "<tr>";
        for ( var i=0; i<cols.length; i++ ){
            result += this.makeTableHeaderCol(cols[i]);
        }
        result += "</tr>";
        return result;
    },
    tr : function(content, atts){
        return this.nodeWithAtts("tr", content, atts);
    },
    td : function(content, atts){
        return this.nodeWithAtts("td", content, atts);
    },
    tdLeft : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.align = "left";
        return this.nodeWithAtts("td", content, attsClone);
    },
    tdCenter : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.align = "center";
        return this.nodeWithAtts("td", content, attsClone);
    },
    tdRight : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.align = "right";
        return this.nodeWithAtts("td", content, attsClone);
    },
    th : function(content, atts){
        return this.nodeWithAtts("th", content, atts);
    },
    thLeft : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.align = "left";
        return this.nodeWithAtts("th", content, attsClone);
    },
    thCenter : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.align = "center";
        return this.nodeWithAtts("th", content, attsClone);
    },
    thRight : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.align = "right";
        return this.nodeWithAtts("th", content, attsClone);
    },
    trtd : function(content, tdAtts, trAtts){
        // shortcut for single column tables
        return this.tr(this.td(content, tdAtts), trAtts);
    },
    trtdLeft : function(content, tdAtts, trAtts){
        return this.tr(this.tdLeft(content, tdAtts), trAtts);
    },
    trtdCenter : function(content, tdAtts, trAtts){
        return this.tr(this.tdCenter(content, tdAtts), trAtts);
    },
    trtdRight : function(content, tdAtts, trAtts){
        return this.tr(this.tdRight(content, tdAtts), trAtts);
    },
    trth : function(content, tdAtts, trAtts){
        // shortcut for single column tables
        return this.tr(this.th(content, tdAtts), trAtts);
    },
    trthLeft : function(content, tdAtts, trAtts){
        return this.tr(this.thLeft(content, tdAtts), trAtts);
    },
    trthCenter : function(content, tdAtts, trAtts){
        return this.tr(this.thCenter(content, tdAtts), trAtts);
    },
    trthRight : function(content, tdAtts, trAtts){
        return this.tr(this.thRight(content, tdAtts), trAtts);
    },
    caption : function(content, atts){
        return this.nodeWithAtts("caption", content, atts);
    },
    table : function(content, atts){
        return this.nodeWithAtts("table", content, atts);
    },
    table00 : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.cellspacing = 0;
        attsClone.cellpadding = 0;
        return this.nodeWithAtts("table", content, attsClone);
    },
    spacerTable : function(height){
        return this.table("<tr/>", { width: "100%", height: height});
    },
    div : function(content, atts){
        return this.nodeWithAtts("div", content, atts);
    },
    span : function(content, atts){
        return this.nodeWithAtts("span", content, atts);
    },
    canvas : function(atts){
        var notSupportedInfo = "If you see this text, this means that your browser does not support the canvas element of HTML5. Try loading this page in a recent version of Chrome, Safari, Firefox, or IE9+.";
        notSupportedInfo = "";
        return this.nodeWithAtts("canvas", notSupportedInfo, atts);
    },
    twoCanvases : function(containerId, foregroundCanvasId, backgroundCanvasId, width, height){
        /* needs this css in order to work:
        .relative {	position: relative; }
        .absolute00 {
        	position: absolute;
        	left: 0px;
        	top: 0px;    
        }
        .zIndex0 { z-index: 0; }
        .zIndex1 { z-index: 1; }
        */
        var foregroundCanvasHtml = this.canvas({width: width, height: height, "class": "absolute00 zIndex1", id: foregroundCanvasId});
        var backgroundCanvasHtml = this.canvas({width: width, height: height, "class": "absolute00 zIndex0", id: backgroundCanvasId});
        return this.div(backgroundCanvasHtml + foregroundCanvasHtml, {"class": "relative", id: containerId});
    },
    threeCanvases : function(containerId, foregroundCanvasId, middleCanvasId, backgroundCanvasId, width, height){
        /* needs this css in order to work:
        .relative {	position: relative; }
        .absolute00 {
        	position: absolute;
        	left: 0px;
        	top: 0px;    
        }
        .zIndex0 { z-index: 0; }
        .zIndex1 { z-index: 1; }
        .zIndex2 { z-index: 2; }
        */
        var foregroundCanvasHtml = this.canvas({width: width, height: height, "class": "absolute00 zIndex2", id: foregroundCanvasId});
        var middleCanvasHtml     = this.canvas({width: width, height: height, "class": "absolute00 zIndex1", id: middleCanvasId});
        var backgroundCanvasHtml = this.canvas({width: width, height: height, "class": "absolute00 zIndex0", id: backgroundCanvasId});
        return this.div(backgroundCanvasHtml + middleCanvasHtml + foregroundCanvasHtml, {"class": "relative", id: containerId});
    },
    select : function(optionsArr, atts){
        var sel = new this.SELECT(atts);
        sel.pushOptionsArr(optionsArr);
        return sel.get();
    },
    sel : function(content, atts){
        return this.nodeWithAtts("select", content, atts);
    },
    option : function(content, atts){
        return this.nodeWithAtts("option", content, atts);
    },
    img : function(content, atts){
        return this.nodeWithAtts("img", content, atts);
    },
    inputBtn : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "button";
        return this.nodeWithAtts("input", content, attsClone);
    },
    inputRange : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "range";
        return this.nodeWithAtts("input", content, attsClone);
    },
    text : function(atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "text";
        return this.nodeWithAtts("input", "", attsClone);
    },
    textarea : function(atts){
        return this.nodeWithAtts("textarea", "", atts);
    },
    btn : function(content, atts){
        return this.nodeWithAtts("button", content, atts);
    },
    eisBtn : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        if ("class" in attsClone){
            attsClone["class"] = attsClone["class"] + " outerEisButton";
        } else {
            attsClone["class"] = "outerEisButton";
        }
        return this.span(this.span(content, {"class": "innerEisButton"}), attsClone);
    },
    makeTableHeaderCol : function(content){
        return "<th>" + content + "</th>";
    },
    makeSpan : function(id, content){
        if ( arguments.length < 2 ) content = "";
        var result = '<span id="' +id+ '">'
        result += content;
        result += "</span>";
        return result;
    },
    makeDiv : function(id, content){
        if ( arguments.length < 2 ) content = "";
        var result = '<div id="' +id+ '">'
        result += content;
        result += "</div>";
        return result;
    },
    makeTextInput : function(id){
        return '<input id=' +id+ ' type="text"/>';
    },
    makeRadio : function(name, checked){
        if ( checked ){
            return '<input name=' +name+ ' type="radio" checked="checked"/>';
        } else {
            return '<input name=' +name+ ' type="radio"/>';
        }
    },
    radio : function(content, atts, checked){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "radio";
        if ( checked ){
            attsClone.checked = "yes";
        }
        return this.nodeWithAtts("input", content, attsClone);
    },
    makeRadioWithId : function(name, id, checked, content){
        if ( arguments.length <= 3 ){
            content = "";
        }
        if ( checked ){
            return this.nodeWithAtts("input", content, {id : id, name : name, type : "radio", checked : "checked"});
        } else {
            return this.nodeWithAtts("input", content, {id : id, name : name, type : "radio"});
        }
    },
    makeLabel : function(forWhat, name){
        return this.nodeWithAtts("label", name, { "for" : forWhat});
    },
    makeRadioGroup : function(name, ids, labels, checkedIndex, mode){
        // make a simple radio group, consisting of a div tag, with the given name as id
        // (all radio tags of course all have the same name.)
        // and alternating labels and radio inputs
        // give a negative number for checkedIndex in order to have no radio checked
        // ids and labels must be arrays of the same length
        // mode = "labelLeft" gives labels to the left
        // mode = "labelRight" gives labels to the right
        // mode = something else gives no label tags, instead the label is the text content of the radio node
        var content = "";
        var withLabels = ( ( mode == "labelLeft" ) || ( mode == "labelRight" ) );
        var left = ( mode == "labelLeft" );
        for ( var i=0; i<ids.length; i++ ){
            var id = ids[i]; var label = labels[i]; var isChecked = ( i == checkedIndex );
            if ( withLabels ){
                var labelTag = this.makeLabel(id, label);
                var radioTag = this.makeRadioWithId(name, id, isChecked);
                if ( left ){
                    content += labelTag + radioTag;
                } else {
                    content += radioTag + labelTag;
                }
            } else {
                content += this.makeRadioWithId(name, id, isChecked, label);
            }
        }
        return this.makeDiv(name, content);
    },
    makeButton : function(id, onclick, title){
        return '<button id="' +id+ '" onclick="' +onclick+ '">' +title+ "</button>"
    },
    makeQueryString : function (atts){
        var result = "?";
        var seperator = "";
        for ( var attName in atts ){
            result += seperator;
            result += attName;
            result += '=';
            result += atts[attName];
            seperator = "&";
        }
        return result;
    },
    makeQueryString2 : function (atts, defaults){
        // same as makeQueryString, but excludes attributes
        // which occur (with the same value) in defaults
        if ( !defaults ){
            return this.makeQueryString(atts);
        }
        var nonDefaultAtts = {};
        for ( attName in atts ){
            if ( attName in defaults && atts[attName] == defaults[attName] ) continue;
            nonDefaultAtts[attName] = atts[attName];
        }
        var result = "?";
        var seperator = "";
        for ( var attName in nonDefaultAtts ){
            result += seperator;
            result += attName;
            result += '=';
            result += nonDefaultAtts[attName];
            seperator = "&";
        }
        return result;
    },
    makeLabeledSliderRow : function(UI, tableName, label, sliderId, valueId, space){
        if ( arguments.length < 5 ){
            valueId = sliderId + "Value";
        }
        if ( arguments.length < 6 ){
            space = "9px";
        }
        var labelCol = this.td(label);
        var spacerCol = this.td("", {width : space});
        var sliderCol = this.td(this.div("", { id: sliderId }));
        var sliderValueCol = this.td(this.span("", { id: valueId }), {align: "right"});
        //for some reason, this doesn't work: var row = "<tr>" + labelCol + spacerCol + sliderCol + spacerCol + sliderValueCol + "</tr>"; $(row).appendTo(this.UITable);
        var row = $("<tr></tr>");
        $(labelCol).appendTo(row);
        $(spacerCol).appendTo(row);
        $(sliderCol).appendTo(row);
        $(spacerCol).appendTo(row);
        $(sliderValueCol).appendTo(row);
        row.appendTo(UI[tableName]);
        UI[sliderId] = $("#" + sliderId);
        UI[valueId] = $("#" + valueId);
    },
    makeImageWithCanvas: function(options){
        var parentElt = options.parentElt;
        var width = options.width;
        var height = options.height;
        var drawingCallback = options.drawingCallback;
        var canvasHtml = this.canvas({width: width, height: height});
        parentElt.html(canvasHtml);
        var canv = parentElt.find("canvas");
        var ctx = canv[0].getContext('2d');
        drawingCallback(ctx, width, height);
        var result = new Image();
        result.src = ctx.canvas.toDataURL("image/png");
        parentElt.html("");
        return result;
    },
    wrapURL: function(str){
        if (str.slice(0,4) == "url("){
            return str;
        } else {
            return "url(" + str + ")";
        }
    }
};
/*************************** TR ***********************/
HtmlGen.TR = function(atts){
    this.content = "";
    this.atts = atts;
}
HtmlGen.TR.prototype.pushTd = function(content, atts){
    this.content += HtmlGen.td(content, atts);
}
HtmlGen.TR.prototype.pushTh = function(content, atts){
    this.content += HtmlGen.th(content, atts);
}
HtmlGen.TR.prototype.pushAllTd = function(strArr){
    for ( var i=0; i<strArr.length; i++ ){
        this.content += HtmlGen.td(strArr[i]);
    }
}
HtmlGen.TR.prototype.pushAllTh = function(strArr){
    for ( var i=0; i<strArr.length; i++ ){
        this.content += HtmlGen.th(strArr[i]);
    }
}
HtmlGen.TR.prototype.get = function(){
    return HtmlGen.tr(this.content, this.atts);
}
HtmlGen.TR.prototype.appendTo = function(host){
    $(this.get()).appendTo(host);
}
HtmlGen.TR.prototype.appendToId = function(id){
    $(this.get()).appendTo($("#" + id));
}
/********************* TABLE ************************/
HtmlGen.TABLE = function(atts){
    this.content = "";
    this.atts = atts;
}
HtmlGen.TABLE.prototype.pushTr = function(elt){
    this.content += elt.get();
}
HtmlGen.TABLE.prototype.get = function(){
    return HtmlGen.table(this.content, this.atts);
}
HtmlGen.TABLE.prototype.appendToId = function(id){
    $(this.get()).appendTo($("#" + id));
}
HtmlGen.TABLE.prototype.appendTo = function(elt){
    $(this.get()).appendTo(elt);
}
/**************************************/
HtmlGen.tableFromCellFunc = function(numRows, numCols, fun, tableAtts){
    var tableContent = "";
    for (var row=0; row<numRows; row++){
        var trContent = "";
        for (var col=0; col<numCols; col++){
            trContent += HtmlGen.td(fun(row, col));
        }
        tableContent += HtmlGen.tr(trContent);
    }
    return HtmlGen.table(tableContent, tableAtts);
}
HtmlGen.tableFromRowFunc = function(numRows, fun, headings, tableAtts){
    var tableContent = "";
    if (arguments.length >= 3){
        tableContent += HtmlGen.makeTableHeaderRow(headings);
    }
    for (var row=0; row<numRows; row++){
        var trContent = "";
        var arr = fun(row);
        var numCols = arr.length;
        for (var col=0; col<numCols; col++){
            trContent += HtmlGen.td(arr[col]);
        }
        tableContent += HtmlGen.tr(trContent);
    }
    return HtmlGen.table(tableContent, tableAtts);
}
HtmlGen.tableFrom2DArray = function(arr, headings){
    var tableContent = "";
    if (arguments.length >= 2){
        tableContent += HtmlGen.makeTableHeaderRow(headings);
    }
    for (var row=0; row<arr.length; row++){
        var trContent = "";
        for (var col=0; col<arr[row].length; col++){
            trContent += HtmlGen.td(arr[row][col]);
        }
        tableContent += HtmlGen.tr(trContent);
    }
    return HtmlGen.table(tableContent);
}
HtmlGen.tableFrom2DArrayWithHeaderCol = function(arr, headings, firstRowIsHeadingToo, tableAtts){
    var tableContent = "";
    for (var row=0; row<arr.length; row++){
        var trContent = "";
        trContent += HtmlGen.th(headings[row]);
        for (var col=0; col<arr[row].length; col++){
            if ( firstRowIsHeadingToo && row == 0 ){
                trContent += HtmlGen.th(arr[row][col]);
            } else {
                trContent += HtmlGen.td(arr[row][col]);
            }
        }
        tableContent += HtmlGen.tr(trContent);
    }
    return HtmlGen.table(tableContent, tableAtts);
}
HtmlGen.twoColTable = function(col1, col2, headings){
    // col1 and col2 must be arrays of the same lengths
    var tableContent = "";
    if (headings){
        tableContent += HtmlGen.tr(
            HtmlGen.th(headings[0]) + HtmlGen.th(headings[1])
        );
    }
    for (var row=0; row<col1.length; row++){
        tableContent += HtmlGen.tr(
            HtmlGen.td(col1[row]) + HtmlGen.td(col2[row])
        );
    }
    return HtmlGen.table(tableContent);
}
HtmlGen.threeColTable = function(col1, col2, col3){
    // col1 and col2 and col3 must be arrays of the same lengths
    var tableContent = "";
    for (var row=0; row<col1.length; row++){
        tableContent += HtmlGen.tr(
            HtmlGen.td(col1[row]) + HtmlGen.td(col2[row]) + HtmlGen.td(col3[row])
        );
    }
    return HtmlGen.table(tableContent);
}
/**************************************/
/************************ SELECT *************************/
HtmlGen.SELECT = function(atts){
    this.content = "";
    this.atts = atts;
}
HtmlGen.SELECT.prototype.pushOption = function(content, atts){
    this.content += HtmlGen.option(content, atts);
}
HtmlGen.SELECT.prototype.pushOptionsArr = function(arr){
    for ( var i=0; i<arr.length; i++ ) {
        this.content += HtmlGen.option(arr[i]);
    }
}
HtmlGen.SELECT.prototype.get = function(){
    return HtmlGen.nodeWithAtts("select", this.content, this.atts);
}
HtmlGen.SELECT.prototype.appendToId = function(id){
    $(this.get()).appendTo($("#" + id));
}
HtmlGen.selectTable = function(count, choices, id, tableClass, omitLabel){
    var trContent = "";
    for (var i=1; i<=count; i++){
        var lbl = omitLabel ? "" : i+ ":&nbsp;";
        trContent += HtmlGen.td(lbl + HtmlGen.select(choices, {id: id + "Sel" + i}), {id: id + "Td" + i});
    }
    return HtmlGen.table(HtmlGen.tr(trContent), {id: id, "class": tableClass});
}
HtmlGen.SelectTable = function(count, choices, id, callback, app, tableClass, omitLabel, useCustomSelect){
    if (!callback){
        callback = function(index, value, selectedIndex, evt, domElt){
            // do nothing
        }
    }
    this.callback = callback;
    this.app = app;
    this.useCustomSelect = useCustomSelect;
    this.count = count;
    this.choices = choices;
    this.id = id;
    this.tableClass = tableClass;
    this.html = HtmlGen.selectTable(count, choices, id, tableClass, omitLabel);
    this.invChoices = {};
    this.selElts = new Array(count);
    for (var i=0; i<choices.length; i++){
        this.invChoices[choices[i]] = i;
    }
}
HtmlGen.SelectTable.prototype.init = function(){
    this.elt = $("#" + this.id);
    for (var i=0; i<this.count; i++){
        this.selElts[i] = $("#" + this.id + "Sel" + (i+1));
        this.selElts[i][0].selectedIndex = -1;
        this.selElts[i].change(this.makeCallback(i));
    }
}
HtmlGen.SelectTable.prototype.makeCallback = function(index){
    var THIS = this;
    return function(evt){
        THIS.callback(index, THIS.choices[this.selectedIndex], this.selectedIndex, evt, this);
    }
}
HtmlGen.SelectTable.prototype.reset = function(){
    for (var i=0; i<this.count; i++){
        this.selElts[i][0].selectedIndex = -1;
    }
}
HtmlGen.SelectTable.prototype.get = function(){
    var THIS = this;
    return this.selElts.map(function(elt){
        return THIS.choices[elt[0].selectedIndex];
    });
}
HtmlGen.SelectTable.prototype.getSelectedIndices = function(){
    return this.selElts.map(function(elt){
        return elt[0].selectedIndex;
    });
}
HtmlGen.SelectTable.prototype.setByValue = function(values){
    for (var i=0; i<values.length; i++){
        var value = values[i];
        var valueIndex = this.invChoices[value];
        var selElt = this.selElts[i];
        selElt[0].selectedIndex = valueIndex;
        if (this.useCustomSelect){
            this.revert(i);
            this.selElts[i].customSelect();
        }
    }
}
HtmlGen.SelectTable.prototype.setByIndices = function(selectedIndices){
    for (var i=0; i<selectedIndices.length; i++){
        var selElt = this.selElts[i];
        selElt[0].selectedIndex = selectedIndices[i];
        if (this.useCustomSelect){
            this.revert(i);
            this.selElts[i].customSelect();
        }
    }
}
HtmlGen.SelectTable.prototype.setAtByValue = function(index, value){
    var valueIndex = this.invChoices[value];
    var selElt = this.selElts[index];
    selElt[0].selectedIndex = valueIndex;
    if (this.useCustomSelect){
        this.revert(index);
        this.selElts[index].customSelect();
    }
}
HtmlGen.SelectTable.prototype.setAtBySelectedIndex = function(index, selectedIndex){
    var selElt = this.selElts[index];
    selElt[0].selectedIndex = selectedIndex;
    if (this.useCustomSelect){
        this.revert(index);
        this.selElts[index].customSelect();
    }
}
HtmlGen.SelectTable.prototype.setNonChosenAt = function(index){
    var selElt = this.selElts[index];
    selElt[0].selectedIndex = -1;
    if (this.useCustomSelect){
        this.revert(index);
        this.selElts[index].customSelect();
    }
}
HtmlGen.SelectTable.prototype.setAllNonChosen = function(){
    for (var i=0; i<this.count; i++){
        this.setNonChosenAt(i);
    }
}
HtmlGen.SelectTable.prototype.revert = function(index){
    var elt = this.selElts[index];
    var selectedIndex = elt[0].selectedIndex;
    var optionsHtml = elt.html();
    var id = elt.attr("id");
    var parent = elt.parent();
    var html = HtmlGen.sel(optionsHtml, {id: id});
    parent.html(html);
    elt = $("#" + id);
    this.selElts[index] = elt;
    elt[0].selectedIndex = selectedIndex;
    elt.change(this.makeCallback(index));
}
HtmlSymbols = {
    degree     : "&#176;",
    pi         : "&#960;",
    checkMark  : "&#10003",
    infinity   : "&#8734;",
    cent       : "&#162;",
    rightArrow : "&#8594;",
    lessThan   : "&#60;",
    greaterThan: "&#62;",
    downArrow  : "&#8595;",
    upArrow    : "&#8593;",
    permille   : "&#8240;",
    // http://stackoverflow.com/questions/2701192/ascii-character-for-up-down-triangle-arrow-to-display-in-html
    triagBigUp : "&#x25B2;",        // ? - U+25B2 BLACK UP-POINTING TRIANGLE
    triagBigDown : "&#x25BC;",      // ? - U+25BC BLACK DOWN-POINTING TRIANGLE
    triagSmallUp : "&#x25B4;",      // ? - U+25B4 SMALL BLACK UP-POINTING TRIANGLE
    triagSmallDown : "&#x25BE;",    // ? - U+25BE SMALL BLACK DOWN-POINTING TRIANGLE
    triagBigLeft : "$#x25C0;",
    triagBigRight : "$#x25B6;"
}
function ID(id){
    return $("#" + id);
}
function nthOptionText(id, n){
    return $(ID(id).children()[n]).text();
}
function firstOptionText(id){
    return nthOptionText(id, 0);
}
function nthOptionValue(id, n){
    return ID(id).children()[n].value;
}
function firstOptionValue(id){
    return nthOptionValue(id, 0);
}
function selectedIndexOf(id){
    return document.getElementById(id).selectedIndex;
}
function setSelectedIndex(id, value){
    document.getElementById(id).selectedIndex = value;
}
function selectedOptionText(id){
    return nthOptionText(id, selectedIndexOf(id));
}
function selectedOptionValue(id){
    return nthOptionValue(id, selectedIndexOf(id));
}
function isChecked(id){
    return document.getElementById(id).checked;
}
function valueOfID(id){
    return document.getElementById(id).value;
}
function enlargeFontSizeByFactor(elt, factor){
    var fs = parseFloat(elt.css("font-size"));
    elt.css("font-size", factor*fs);
}
function jqmoSetBtnText(elt, text){
    if (typeof elt == "string") elt = $("#" + elt);
    elt.siblings(".ui-btn-inner").children(".ui-btn-text").text(text);
}
function jqmoSetBtnHtml(elt, text){
    if (typeof elt == "string") elt = $("#" + elt);
    elt.siblings(".ui-btn-inner").children(".ui-btn-text").html(text);
}
function jqmoSetBtnStyle(elt, style){
    if (typeof elt == "string") elt = $("#" + elt);
    elt.siblings(".ui-btn-inner").css(style);
}
function mathFloor(content){
    return "&lfloor;" + content + "&rfloor;";
}
function isIntegerKey(evt){
    var charCode = evt.which;
    var ZERO = 48;
    var NINE = 57;
    //var BACKSPACE = 8;
    return (charCode <= 30 || (charCode >= ZERO && charCode <= NINE));
}
function isPositiveNumberKey(evt){
    var charCode = evt.which;
    var ZERO = 48;
    var NINE = 57;
    var PERIOD = 46;
    return (charCode <= 30 || (charCode >= ZERO && charCode <= NINE) || charCode == PERIOD);
}
function isNumberKey(evt){
    var charCode = evt.which;
    var ZERO = 48;
    var NINE = 57;
    var PERIOD = 46;
    var MINUS = 45;
    return (charCode <= 30 || (charCode >= ZERO && charCode <= NINE) || charCode == PERIOD || charCode == MINUS);
}
function naturalNumberTextInput(options){
    var parentElt = null;
    if ("parentId" in options){
        parentElt = $("#" + options.parentId);
    } else {
        parentElt = options.parentElt;
    }
    var id = options.id;
    var atts, callback;
    if ("atts" in options){
        atts = options.atts;
    } else {
        atts = {};
    }
    if ("callback" in options){
        callback = options.callback;
    } else {
        callback = function(){};
    }
    var attsClone = {};
    for ( var attName in atts ){
        attsClone[attName] = atts[attName];
    }
    attsClone.type = "text";
    attsClone.id = id;
    if ("value" in options){
        var v = options.value;
        attsClone.value = v;
        this.value = parseInt(v);
        v = this.value;
        this.state = isNaN(v) || v < 0 ? "ERROR" : "OK";
    } else {
        this.value = NaN;
        this.state = "ERROR";
    }
    var html = HtmlGen.nodeWithAtts("input", "", attsClone);
    parentElt.append(html);
    var elt = parentElt.find("#" + id);
    var THIS = this;
    elt.keypress(function(evt){
            //var valString = THIS.elt.val();
            //var charCode = evt.which;
            //console.log("KEYPRESS old value: " + valString + "   char code: " + charCode + "  key: " + evt.key);
        return isIntegerKey(evt);
    });
    elt.keyup(function(evt){
        //var charCode = evt.which;
        var valString = THIS.elt.val();
        var value = parseInt(valString);
        if (isNaN(value) || value < 0){
            THIS.state = "ERROR";
        } else {
            THIS.state = "OK";
            THIS.value = value;
        }
        //console.log("UP value: " + value);
        THIS.callback(value, evt);
    });
    this.parentElt = parentElt;
    this.id = id;
    this.callback = callback;
    this.elt = elt;
}
function nonNegativeNonTinyTextInput(options){
    var parentElt = null;
    if ("parentId" in options){
        parentElt = $("#" + options.parentId);
    } else {
        parentElt = options.parentElt;
    }
    var id = options.id;
    var atts, callback;
    if ("atts" in options){
        atts = options.atts;
    } else {
        atts = {};
    }
    if ("callback" in options){
        callback = options.callback;
    } else {
        callback = function(){};
    }
    var attsClone = {};
    for ( var attName in atts ){
        attsClone[attName] = atts[attName];
    }
    attsClone.type = "text";
    attsClone.id = id;
    if ("value" in options){
        var v = options.value;
        attsClone.value = v;
        this.value = parseFloat(v);
        v = this.value;
        this.state = isNaN(v) || v < 0 ? "ERROR" : "OK";
    } else {
        this.value = NaN;
        this.state = "ERROR";
    }
    var html = HtmlGen.nodeWithAtts("input", "", attsClone);
    parentElt.append(html);
    var elt = parentElt.find("#" + id);
    var THIS = this;
    elt.keypress(function(evt){
            //var valString = THIS.elt.val();
            //var charCode = evt.which;
            //console.log("KEYPRESS old value: " + valString + "   char code: " + charCode + "  key: " + evt.key);
        return isPositiveNumberKey(evt);
    });
    elt.keyup(function(evt){
        //var charCode = evt.which;
        var valString = THIS.elt.val();
        var value = parseFloat(valString);
        if (isNaN(value) || value < 0){
            THIS.state = "ERROR";
        } else {
            THIS.state = "OK";
            THIS.value = value;
        }
        //console.log("UP value: " + value);
        THIS.callback(value, evt);
    });
    this.parentElt = parentElt;
    this.id = id;
    this.callback = callback;
    this.elt = elt;
}
nonNegativeNonTinyTextInput.prototype.setValue = function(value){
    this.value = value;
    this.state = "OK";
    this.elt.val(value);
}
function nonTinyTextInput(options){
    var parentElt = null;
    if ("parentId" in options){
        parentElt = $("#" + options.parentId);
    } else {
        parentElt = options.parentElt;
    }
    var id = options.id;
    var atts, callback;
    if ("atts" in options){
        atts = options.atts;
    } else {
        atts = {};
    }
    if ("callback" in options){
        callback = options.callback;
    } else {
        callback = function(){};
    }
    var attsClone = {};
    for ( var attName in atts ){
        attsClone[attName] = atts[attName];
    }
    attsClone.type = "text";
    attsClone.id = id;
    if ("value" in options){
        var v = options.value;
        attsClone.value = v;
        this.value = parseFloat(v);
        v = this.value;
        this.state = isNaN(v) ? "ERROR" : "OK";
    } else {
        this.value = NaN;
        this.state = "ERROR";
    }
    var html = HtmlGen.nodeWithAtts("input", "", attsClone);
    parentElt.append(html);
    var elt = parentElt.find("#" + id);
    var THIS = this;
    elt.keypress(function(evt){
            //var valString = THIS.elt.val();
            //var charCode = evt.which;
            //console.log("KEYPRESS old value: " + valString + "   char code: " + charCode + "  key: " + evt.key);
        return isNumberKey(evt);
    });
    elt.keyup(function(evt){
        //var charCode = evt.which;
        var valString = THIS.elt.val();
        var value = parseFloat(valString);
        if (isNaN(value)){
            THIS.state = "ERROR";
        } else {
            THIS.state = "OK";
            THIS.value = value;
        }
        //console.log("UP value: " + value);
        THIS.callback(value, evt);
    });
    this.parentElt = parentElt;
    this.id = id;
    this.callback = callback;
    this.elt = elt;
}
nonTinyTextInput.prototype.setValue = function(value, format){
    this.value = value;
    this.state = "OK";
    if (arguments.length < 2){
        this.elt.val(value);
    } else {
        this.elt.val(format.sprintf(value));
    }
    
}

M = {
    render: function(){
        if (navigator.userAgent.indexOf("Firefox") == -1){
            MathJax.Hub.Typeset(); // http://docs.mathjax.org/en/latest/typeset.html
        }
    },
    nodeWithAtts : function(tagName, content, atts){
        if ( arguments.length < 3 ) atts = {};
        var openTag =  "<" +tagName;
        for ( var attName in atts ){
            openTag += " ";
            openTag += attName;
            openTag += '="';
            openTag += atts[attName];
            openTag += '"';
        }
        openTag += ">";
        var closeTag =  "</" +tagName+ ">";
        return openTag + content + closeTag;
    },
    mathWithOptions : function(content, display, textAlign, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        var style = atts && "style" in atts ? atts.style + " " : "";
        style += "text-align: ";
        style += textAlign;
        style += ";";                
        attsClone.style = style;
        attsClone.display = display;
        attsClone.xmlns = "http://www.w3.org/1998/Math/MathML";
        return this.nodeWithAtts("math", content, attsClone);
    },
    mathBlockLeft : function(content, atts){
        return this.mathWithOptions(content, "block", "left", atts);
    },
    mathBlockCenter : function(content, atts){
        return this.mathWithOptions(content, "block", "center", atts);
    },
    mathBlockRight : function(content, atts){
        return this.mathWithOptions(content, "block", "right", atts);
    },
    mathInlineLeft : function(content, atts){
        return this.mathWithOptions(content, "inline", "left", atts);
    },
    mathInlineCenter : function(content, atts){
        return this.mathWithOptions(content, "inline", "center", atts);
    },
    mathInlineRight : function(content, atts){
        return this.mathWithOptions(content, "inline", "right", atts);
    },
    row : function(content, atts){
        return this.nodeWithAtts("mrow", content, atts);
    },
    i : function(content, atts){
        return this.nodeWithAtts("mi", content, atts);
    },
    o : function(content, atts){
        return this.nodeWithAtts("mo", content, atts);
    },
    n : function(content, atts){
        return this.nodeWithAtts("mn", content, atts);
    },
    frac : function(content, atts){
        return this.nodeWithAtts("mfrac", content, atts);
    },
    sqrt : function(content, atts){
        return this.nodeWithAtts("msqrt", content, atts);
    },
    style : function(content, atts){
        return this.nodeWithAtts("mstyle", content, atts);
    },
    underover : function(content, atts){
        return this.nodeWithAtts("munderover", content, atts);
    },
    over : function(content, atts){
        return this.nodeWithAtts("mover", content, atts);
    },
    under : function(content, atts){
        return this.nodeWithAtts("munder", content, atts);
    },
    sup : function(content, atts){
        return this.nodeWithAtts("msup", content, atts);
    },
    sub : function(content, atts){
        return this.nodeWithAtts("msub", content, atts);
    },
    minus: "<mo>&#x2212;</mo>",
    plus: "<mo>+</mo>",
    plusMinus: "<mo>&#x00B1;</mo>",
    sum: "<mo>&#x2211;</mo>",
    equals: "<mo>=</mo>",
    sigma: "<mi>&#x3C3;</mi>",
    Sigma: "<mi>&Sigma;</mi>",
    alpha: "<mi>&alpha;</mi>",
    boldSigma: '<mi class="bold">&#x3C3;</mi>',
    chi: "<mi>&chi;</mi>",
    times: "<mo>&CenterDot;</mo>",
    cross: "<mo>&#x2a2f;</mo>",
    div: "<mo>&div;</mo>",
    mu: "<mi>&#x3BC;</mi>",
    openParen: '<mo stretchy="false">(</mo>',
    closeParen: '<mo stretchy="false">)</mo>',
    openParen2: '<mo stretchy="true">(</mo>',
    closeParen2: '<mo stretchy="true">)</mo>',
    zero: "<mn>0</mn>",
    one: "<mn>1</mn>",
    two: "<mn>2</mn>",
    three: "<mn>3</mn>",
    four: "<mn>4</mn>",
    five: "<mn>5</mn>",
    six: "<mn>6</mn>",
    seven: "<mn>7</mn>",
    eight: "<mn>8</mn>",
    nine: "<mn>9</mn>",
    ten: "<mn>10</mn>",
    _frac: function(enumerator, denominator, enuAtts, denoAtts, atts){
        return this.frac(this.row(enumerator, enuAtts) + this.row(denominator, denoAtts), atts);
    },
    _underover: function(mid, under, over, midAtts, underAtts, overAtts, atts){
        return this.underover(this.row(mid, midAtts) + this.row(under, underAtts) + this.row(over, overAtts), atts);
    },
    _over: function(mid, over, midAtts, overAtts, atts){
        return this.over(this.row(mid, midAtts) + this.row(over, overAtts), atts);
    },
    _under: function(mid, under, midAtts, underAtts, atts){
        return this.under(this.row(mid, midAtts) + this.row(under, underAtts), atts);
    },
    _sum: function(under, over, underAtts, overAtts, atts){
        return this._underover(this.sum, under, over, {}, underAtts, overAtts, atts);
    },
    _sup: function(base, exponent, baseAtts, expoAtts, atts){
        return this.sup(this.row(base, baseAtts) + this.row(exponent, expoAtts), atts);
    },
    _sub: function(base, index, baseAtts, indexAtts, atts){
        return this.sub(this.row(base, baseAtts) + this.row(index, indexAtts), atts);
    },
    _supWithParens: function(base, exponent, baseAtts, expoAtts, atts){
        return this.sup(this.row(this.openParen + base + this.closeParen, baseAtts) + this.row(exponent, expoAtts), atts);
    },
    _squared: function(base, baseAtts, atts){
        return this._sup(base, this.two, baseAtts, {}, atts)
    },
    _squaredWithParens: function(base, baseAtts, atts){
        return this._supWithParens(base, this.two, baseAtts, {}, atts)
    },
    _withParens: function(content){
        return this.openParen + content + this.closeParen;
    },
    _withParens2: function(content){
        return this.openParen2 + content + this.closeParen2;
    },
    _overBar: function(content){
        return '<mrow class="MJX-TeXAtom-ORD"><mover>' + content + '<mo stretchy="false">&#x00AF;</mo></mover></mrow>';
    },
    _overBar1: function(content){
        return '<mrow class="MJX-TeXAtom-ORD"><mover>' + content + '<mo stretchy="false">_</mo></mover></mrow>';
    },
    _overBar2: function(content){
        return '<mrow class="MJX-TeXAtom-ORD"><mover>' + content + '<mo stretchy="false">__</mo></mover></mrow>';
    },
    _overBar3: function(content){
        return '<mrow class="MJX-TeXAtom-ORD"><mover>' + content + '<mo stretchy="false">___</mo></mover></mrow>';
    },
    _overBar4: function(content){
        return '<mrow class="MJX-TeXAtom-ORD"><mover>' + content + '<mo stretchy="false">____</mo></mover></mrow>';
    },
    _overBar5: function(content){
        return '<mrow class="MJX-TeXAtom-ORD"><mover>' + content + '<mo stretchy="false">_____</mo></mover></mrow>';
    },
    _overHat: function(content, atts){
        return M._over(M.i(content, atts), M.o("&circ;"));
    },
    _div: function(first, second){
        return M.row(first + M.div + second);
    }

}

function changeNumRows(id, newNumRows){
    var doomed = "satnohdustnahodestnhadosetnhuds8265876rciu";
    var newIdPre = UTIL.randomIdentifier(20);
    var t = $("table#" + id);
    if (t.length == 0){
        return;
    }
    var tds = $("table#" + id + ">tbody>tr>td");
    $("table#" + id + ">tbody>tr").addClass(doomed);
    var newTrs = new Array(newNumRows);
    for (var i=0; i<newNumRows; i++){
        newTrs[i] = HtmlGen.tr("", {id: newIdPre + i});
        t.append(newTrs[i]);
    }
    var numTds = tds.length;
    var tdsPerRow = Math.ceil(numTds / newNumRows);
    var rowInd = 0;
    var newTr = $("#" + newIdPre + "0");
    for (var i=1; i<=numTds; i++){
        $(tds[i-1]).appendTo(newTr);
        if (i % tdsPerRow == 0){
            rowInd++;
            var newTr = $("#" + newIdPre + rowInd);
        }
    }
    $("table#" + id + ">tbody>tr." + doomed).remove();
}


function changeNumRows2(id, newNumRows){
    var doomed = "satnohdustnahodestnhadosetnhuds8265876rciu";
    var newIdPre = UTIL.randomIdentifier(20);
    var t = $("table#" + id);
    if (t.length == 0){
        return;
    }
    var tds = $("table#" + id + ">tbody>tr>td");
    $("table#" + id + ">tbody>tr").addClass(doomed);
    for (var i=0; i<newNumRows; i++){
        t.append(HtmlGen.tr(HtmlGen.td(HtmlGen.table(HtmlGen.tr("", {id: newIdPre + i})))));
    }
    var numTds = tds.length;
    var tdsPerRow = Math.ceil(numTds / newNumRows);
    var rowInd = 0;
    var newTr = $("#" + newIdPre + "0");
    for (var i=1; i<=numTds; i++){
        $(tds[i-1]).appendTo(newTr);
        if (i % tdsPerRow == 0){
            rowInd++;
            newTr = $("#" + newIdPre + rowInd);
        }
    }
    $("table#" + id + ">tbody>tr." + doomed).remove();
}
HtmlGen.frataLR = function(left, numer, deno, right, numerStyle, denoStyle){
    var bobo = {"border-bottom" : "1px solid black"};
    if (arguments.length < 4){
        denoStyle = {};
    }
    if (arguments.length < 3){
        numerStyle = {};
    }
    return this.table(
        this.tr(
            this.td(left, {rowSpan: 2, valign: "center"}) +
            this.tdCenter(numer, {style: Style.toString(jQuery.extend(bobo, numerStyle))}) +
            this.td(right, {rowSpan: 2, valign: "center"})
        ) +
        this.tr(
            arguments.length < 4 ? this.tdCenter(deno) : this.tdCenter(deno, {style: Style.toString(denoStyle)})
        )
    );
}
HtmlGen.frata = function(numer, deno, numerStyle, denoStyle){
    var bobo = {"border-bottom" : "1px solid black"};
    if (arguments.length < 4){
        denoStyle = {};
    }
    if (arguments.length < 3){
        numerStyle = {};
    }
    return this.table(
        this.tr(
            this.tdCenter(numer, {style: Style.toString(jQuery.extend(bobo, numerStyle))})
        ) +
        this.tr(
            arguments.length < 4 ? this.tdCenter(deno) : this.tdCenter(deno, {style: Style.toString(denoStyle)})
        )
    );
}


