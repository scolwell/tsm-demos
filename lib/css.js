// css.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICE
function CSS(id){
    this.id = id;
    this.rules = [];
}
CSS.prototype.addRule = function(rule){
    this.rules.push(rule);
}
CSS.prototype.apply = function(){
    $("#" + this.id).text(
        this.rules.map(function(item){
            return item.toCSSString();
        }).join("\n")
    );
}
function Rule(selector, mapping){
    this.selector = selector;
    this.mapping = mapping;
}
Rule.prototype.toCSSString = function(){
    var result = this.selector + "{ ";
    for (var att in this.mapping){
        result += att;
        result += ": ";
        result += this.mapping[att];
        result += "; "
    }
    result += "}";
    return result;
}
CSS.prototype.addRules = function(rulesArray){
    for (var i=0; i<rulesArray.length; i++){
        this.rules.push(rulesArray[i]);
    }
}
CSS.prototype.addShortHandRules = function(shortHandArr){
    for (var i=0; i<shortHandArr.length; i++){
        var entry = shortHandArr[i];
        var selector = entry[0];
        var mapping = entry[1];
        var rule = new Rule(selector, mapping);
        this.rules.push(rule);
    }
}
function cssFactory(obj){
    this.obj = obj;
    this.css = new CSS(obj.cssId);
    this.css.addShortHandRules(obj.cssRules);
}
cssFactory.prototype.produce = function(){
    this.css.apply();
}
Style = {
    toString: function(obj){
        var space = "";
        var result = "";
        for (var att in obj){
            result += space;
            result += att;
            result += ": ";
            result += obj[att];
            result += ";";
            space = " ";
        }
        return result;
    },
    attachToAtts: function(atts, obj){
        var attsClone = {};
        for (att in atts){
            attsClone[att] = atts[att];
        }
        if ("style" in atts){
            attsClone.style = attsClone.style + " " + this.toString(obj);
        } else {
            attsClone.style = this.toString(obj);
        }
        if (attsClone.style.length == 0){
            delete attsClone.style;
        }
        return attsClone;
    },
    toAtts: function(obj){
        return this.attachToAtts({}, obj);
    }
};