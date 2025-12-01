// util.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICE
function toHex(x){
    // ONLY for numbers from zero to 255
    var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var temp = Math.floor(x/16);
    var first = digits[temp];
    var second = digits[x - 16 * temp];
    return first + second;
}
function rgbaToHex(r,g,b,a){
    return "#" + toHex(r) + toHex(g) + toHex(b) + toHex(a);
}
function rgbToHex(r,g,b){
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function RGB(red, green, blue){
    this.r = red;
    this.g = green;
    this.b = blue;
}
RGB.prototype.toString = function(){
    return "rgb(" + [this.r, this.g, this.b].join(",") + ")";
}
RGB.prototype.mixWith = function(otherRGB, mixParam){
    // mixParam = 0 gives this color
    // mixParam = 1 gives the other color
    function affineMix(value1, value2, mix){
        var val = (1-mix) * value1 + mix * value2;
        return Math.round(val);
    }
    var red = affineMix(this.r, otherRGB.r, mixParam);
    var green = affineMix(this.g, otherRGB.g, mixParam);
    var blue = affineMix(this.b, otherRGB.b, mixParam);
    return new RGB(red, green, blue);
}
RGB.prototype.setAsFill = function(ctx){
    ctx.fillStyle = this.toString();
}
RGB.prototype.setAsStroke = function(ctx){
    ctx.strokeStyle = this.toString();
}
RGB.fromHexString = function(hexString){
    function convert(hex){
        return parseInt(hex, 16);
    }
    if (hexString.length == 7){
        var red = convert(hexString.substr(1, 2));
        var green = convert(hexString.substr(3, 2));
        var blue = convert(hexString.substr(5, 2));
        return new RGB(red, green, blue);
    }
    if (hexString.length != 4){
        return null;
    }
    var r = hexString.charAt(1); var red   = convert(r + r);
    var g = hexString.charAt(2); var green = convert(g + g);
    var b = hexString.charAt(3); var blue  = convert(b + b);
    return new RGB(red, green, blue);
}
RGB.fromRGBstring = function(str){
    str = str.trim();
    if (str.slice(0, 4) != "rgb("){
        return null;
    }
    if (str.charAt(str.length - 1) != ")"){
        return null;
    }
    var components = str.split(",");
    if (components.length != 3){
        return null;
    }
    var red = parseInt(components[0].slice(4));
    var green = parseInt(components[1]);
    var blue = parseInt(components[2]);
    if (isNaN(red) || isNaN(green) || isNaN(blue)){
        return null;
    }
    return new RGB(red, green, blue);
}
RGB.fromString = function(str){
    if (str.charAt(0) == "#"){
        return RGB.fromHexString(str);
    }
    return RGB.fromRGBstring(str);
}
/*******************************************************
********************************************************
color conversion from
http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
********************************************************
*******************************************************/


/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}
function hslToRgbString(h, s, l){
    var rgb = hslToRgb(h, s, l);
    var r = Math.round(rgb[0]);
    var g = Math.round(rgb[1]);
    var b = Math.round(rgb[2]);
    return "rgb(" + r + "," + g + "," + b + ")";
}
/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}
/////////////////////// end color conversion ////////////////////////////////

function QuadraticBezierCurve(x0, y0, x1, y1, x2, y2){
    this.x0 = x0; this.y0 = y0; // start
    this.x1 = x1; this.y1 = y1; // control
    this.x2 = x2; this.y2 = y2; // end
}
QuadraticBezierCurve.prototype.get = function(yang){
    var yin = 1-yang;
    var alpha = yin*yin;
    var beta = 2*yang*yin;
    var gamma = yang*yang;
    var x = alpha * this.x0 + beta * this.x1 + gamma * this.x2;
    var y = alpha * this.y0 + beta * this.y1 + gamma * this.y2;
    return {x: x, y: y};
}
function pointInRect(left, top, width, height, x, y){
    if (y < top) return false;
    if (y > top + height) return false;
    if (x < left) return false;
    if (x > left + width) return false;
    return true;
}
function pointInCircle(centerX, centerY, radius, pointX, pointY){
    var dx = pointX - centerX;
    var dy = pointY - centerY;
    var squaredDistance = dx*dx + dy*dy;
    return squaredDistance <= radius*radius;
}
function squaredDistance(x1, y1, x2, y2){
    var dx = x1 - x2;
    var dy = y1 - y2;
    return dx*dx + dy*dy;
}
function queryStringGetParametersObject(doc){
    // retrieve get parameters from document search string,
    // result is an object (associative array) with the parameters as entries
    // or null, if the querystring is absent.
    if ( arguments.length < 1 ){
        doc = document;
    }
    // full search string
    var s = doc.location.search;
    // omit question mark
    var str = s.substr(1, s.length);
    if ( !str ) return null;
    var result = {};
    // split into name value pairs
    var arr = str.split('&');
    var numParams = arr.length;
    for ( var i=0; i<numParams; i++ ){
        // split into name and value
        var subArr = arr[i].split('=');
        var paramName = unescape(subArr[0]);
        var value = '';
        if ( subArr.length > 1 ){
            value = unescape(subArr[1]);
        }
        // store what we have retrieved
        result[paramName] = value;
    }
    return result;
}
UTIL = {
    zeros : function(length){
        var result = new Array(length);
        for (var i=0; i<length; i++){
            result[i] = 0;
        }
        return result;
    },
    constantArray: function(length, value){
        var result = new Array(length);
        for (var i=0; i<length; i++){
            result[i] = value;
        }
        return result;
    },
    range: function(start, end){
        var result = [];
        for (var entry = start; entry <= end; entry++){
            result.push(entry);
        }
        return result;
    },
    table: function(size, fun){
        var result = [];
        for (var i=0; i<size; i++){
            result.push(fun(i));
        }
        return result;
    },
    zip: function(array1, array2){
        // arrays should have the same length
        var result = [];
        for (var i=0; i<array1.length; i++){
            result.push([array1[i], array2[i]]);
        }
        return result;
    },
    nest : function(fun, start, stopFun){
        var result = [start];
        var current = start;
        while (true){
            var next = fun(current);
            if (stopFun(next)) return result;
            current = next;
            result.push(current);
        }
    },
    binomialCoefficient: function(n, k){
        if (n <= 0){
            return 0;
        }
        if (k > n){
            return 0;
        }
        if (k < 0){
            return 0;
        }
        if (k == 0 || k == n){
            return 1;
        }
        if (k > n/2){
            k = n-k;
        }
        var result = 1;
        for (var i=0; i<k; i++){
            result *= (n-i);
            result /= (k-i);
        }
        return Math.round(result);
    },
    randomLowerCaseLetter: function(){
        return this.lowerCaseLetters.randomEntry();
    },
    randomUpperCaseLetter: function(){
        return this.upperCaseLetters.randomEntry();
    },
    randomDigitCaseLetter: function(){
        return this.digitCharacters.randomEntry();
    },
    randomLetter: function(){
        return this.alphaCharacters.randomEntry();
    },
    randomAlphaNumericCharacter: function(){
        return this.alphaNumbericCharacters.randomEntry();
    },
    randomIdentifier: function(length){
        if (arguments.length < 1){
            length = 10;
        }
        return this.range(1, length).map(function(i){
            if (i==1){
                return UTIL.randomLetter();
            } else {
                return UTIL.randomAlphaNumericCharacter();
            }
        }).join("");
    }
};
UTIL.lowerCaseLetters = UTIL.range("a".charCodeAt(0), "z".charCodeAt(0)).map(function(charCode){ return String.fromCharCode(charCode); });
UTIL.upperCaseLetters = UTIL.range("A".charCodeAt(0), "Z".charCodeAt(0)).map(function(charCode){ return String.fromCharCode(charCode); });
UTIL.digitCharacters = UTIL.range("0".charCodeAt(0), "9".charCodeAt(0)).map(function(charCode){ return String.fromCharCode(charCode); });
UTIL.alphaCharacters = UTIL.upperCaseLetters.concat(UTIL.lowerCaseLetters);
UTIL.alphaNumbericCharacters = UTIL.alphaCharacters.concat(UTIL.digitCharacters);

function pickRandomlyWithoutRepetition(urnContents, pickCount){
    // urnContents = array with possible choices
    // return array of length pickCount, containing randomly chosen entries of urnContents, all different
    if (pickCount > urnContents.length){
        console.log("error: too many elements");
        return [];
    }
    var choices = urnContents;
    var result = [];
    var counter = 0;
    var n = urnContents.length;
    while (true){
        if (counter == pickCount){
            return result;
        }
        var rand = Math.random();
        var pickedIndex = Math.floor(n * rand);
        result.push(choices[pickedIndex]);
        choices = choices.filter(function(content, index){
            return index != pickedIndex;
        });
        counter++;
        n--;
    }
}
//test: blah = UTIL.table(6000, function(){ return pickRandomlyWithoutRepetition([1,2,3], 2); });[blah.filter(function(p){ return p[0]==1 && p[1] == 2;}).length,blah.filter(function(p){ return p[0]==1 && p[1] == 3;}).length,blah.filter(function(p){ return p[0]==2 && p[1] == 1;}).length,blah.filter(function(p){ return p[0]==2 && p[1] == 3;}).length,blah.filter(function(p){ return p[0]==3 && p[1] == 1;}).length,blah.filter(function(p){ return p[0]==3 && p[1] == 2;}).length]

function intersectSortedArrays(array1, array2){
    var result = [];
    if (array1.length == 0) return result;
    if (array2.length == 0) return result;
    var index1 = 0;
    var index2 = 0;
    while (true){
        var value1 = array1[index1];
        var value2 = array2[index2];
        if (value1 == value2){
            result.push(value1);
            index1++; if (index1 >= array1.length) return result;
            index2++; if (index2 >= array2.length) return result;
        } else {
            if (value1 < value2){
                index1++; if (index1 >= array1.length) return result;
            } else {
                index2++; if (index2 >= array2.length) return result;
            }
        }
    }
}
function __ascendingSortAux__(x, y){
    return x - y;
}
Array.prototype.sortASC = function(){
    return this.sort(__ascendingSortAux__);
};


Array.prototype.sum = function(){
    var sum = 0;
    this.scan(function(item){
        sum += item;
    });
    return sum;
};
Array.prototype.mean = function(){
    var sum = 0;
    this.map(function(item){
        sum += item;
    });
    return sum/this.length;
};

Array.prototype.scan = function(f){
    for (var i=0; i<this.length; i++) {
        f(this[i], i);
    }
}
Array.prototype.product = function(){
    var prod = 1;
    this.scan(function(item){
        prod *= item;
    });
    return prod;
};
Array.prototype.timesConst = function(theConst){
    return this.map(function(item){
        return theConst * item;
    });
}
Array.prototype.plusConst = function(theConst){
    return this.map(function(item){
        return theConst + item;
    });
}
/*
Array.prototype.quantile = function(q){
    var n = this.length - 1;
    var target = q*n;
    var lo = Math.floor(target);
    var hi = Math.ceil(target);
    if (lo == hi){
        return this[lo];
    }
    var epsilon = target - lo;
    return epsilon * this[hi] + (1-epsilon) * this[lo];
}*/
Array.prototype.quantile = function(q){
    // use ONLY on sorted arrays !!
    var n = this.length;
    var target = q*n - 0.5;
    var loIndex = Math.floor(target);
    if (loIndex == -1){
        return this[0];
    }
    var hiIndex = loIndex + 1;
    if (hiIndex == n){
        return this[n-1];
    }
    var epsilon = target - loIndex;
    return epsilon * this[hiIndex] + (1-epsilon) * this[loIndex];
};
if (!Array.prototype.reduce){
    Array.prototype.reduce = function(fun, first){
        var result = first;
        for (var i=0; i<this.length; i++){
            result = fun(result, this[i], i);
        }
        return result;
    };
}
Array.prototype.min = function(){
    return this.reduce(function(old, item){ return Math.min(old, item); }, Infinity);
};
Array.prototype.min1 = function(){
    // same as min, but ignoring entries which are NaN
    return this.reduce(function(old, item){ return isNaN(item) ? old : Math.min(old, item); }, Infinity);
};
Array.prototype.max1 = function(){
    // same as max, but ignoring entries which are NaN
    return this.reduce(function(old, item){ return isNaN(item) ? old : Math.max(old, item); }, -Infinity);
};
Array.prototype.max = function(){
    return this.reduce(function(old, item){ return Math.max(old, item); }, -Infinity);
};
Array.prototype.randomEntry = function(){
    var index = Math.floor(this.length * Math.random());
    return this[index];
};
Array.prototype.randomSample = function(size){
    var result = new Array(size);
    for (var i=0; i<size; i++){
        result[i] = this.randomEntry();
    }
    return result;
};
Array.prototype.pick = function(picker){
    var THIS = this;
    return picker.map(function(index){ return THIS[index]; })
};

Array.prototype.binCount = function(numBins, lo, hi){
    if (arguments.length < 2){
        lo = this.min();
    }
    if (arguments.length < 3){
        hi = this.max();
    }
    var spread = hi - lo;
    var factor = numBins / spread;
    var result = new Array(numBins);
    for (var i=0; i<numBins; i++){
        result[i] = 0;
    }
    for (var i=0; i<this.length; i++){
        var entry = this[i];
        var floatBin = factor * (entry - lo);
        var index = Math.min(Math.floor(floatBin), numBins - 1);
        result[index]++;
    }
    return result;
}
Array.prototype.binCount1 = function(numBins, lo, hi){
    if (arguments.length < 2){
        lo = this.min();
    }
    if (arguments.length < 3){
        hi = this.max();
    }
    var spread = hi - lo;
    var gap = spread/(2*numBins);
    var lo1 = lo - gap;
    var hi1 = hi + gap;
    var spread1 = hi1 - lo1;
    var factor = numBins / spread1;
    var result = new Array(numBins);
    for (var i=0; i<numBins; i++){
        result[i] = 0;
    }
    for (var i=0; i<this.length; i++){
        var entry = this[i];
        var floatBin = factor * (entry - lo1);
        var index = Math.floor(floatBin);
        result[index]++;
    }
    return {
        bins: result,
        lo: lo,
        hi: hi
    };
}
Array.prototype.inversePermutation = function(){
    var result = new Array(this.length);
    for (var i=0; i<this.length; i++){
        result[this[i]] = i;
    }
    return result;
}
function duoBinCount(arr1, arr2, numBins){
    var min1 = arr1.min();
    var max1 = arr1.max();
    var min2 = arr2.min();
    var max2 = arr2.max();
    var min = Math.min(min1, min2);
    var max = Math.max(max1, max2);
    var spread = max - min;
    var gap = spread/(2*numBins);
    var low = min - gap;
    var high = max + gap;
    var _spread = high - low;
    var factor = numBins / _spread;
    var bins1 = new Array(numBins);
    var bins2 = new Array(numBins);
    for (var i=0; i<numBins; i++){
        bins1[i] = 0;
        bins2[i] = 0;
    }
    for (var i=0; i<arr1.length; i++){
        var entry = arr1[i];
        var floatBin = factor * (entry - low);
        var index = Math.floor(floatBin);
        bins1[index]++;
    }
    for (var i=0; i<arr2.length; i++){
        var entry = arr2[i];
        var floatBin = factor * (entry - low);
        var index = Math.floor(floatBin);
        bins2[index]++;
    }
    return {
        bins1: bins1,
        bins2: bins2,
        low: low,
        high: high
    };
}
Array.prototype.variance = function(){
    var m = this.mean();
    return this.map(function(item) {var tmp = item-m; return tmp*tmp;}).mean();
};
Array.prototype.varianceE = function(){
    // empirical variance
    var m = this.mean();
    return this.map(function(item) {var tmp = item-m; return tmp*tmp;}).sum() / (this.length-1);
};
Array.prototype.stdDev = function(){
    var m = this.mean();
    var variance =  this.map(function(item) {var tmp = item-m; return tmp*tmp;}).mean();
    return Math.sqrt(variance);
};
Array.prototype.stdDevE = function(){
    // empirical standard deviation
    var m = this.mean();
    var variance =  this.map(function(item) {var tmp = item-m; return tmp*tmp;}).sum() / (this.length-1);
    return Math.sqrt(variance);
};

CANVAS = {
    erase: function(ctx){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    defaultTickDistancesFromWidth : function(width, narrowness){
        if (arguments.length < 2){
            narrowness = 1;
        }
        var width1 = width / narrowness;
        if (width1 >= 600){
            var temp = this.defaultTickDistancesFromWidth(width/10, narrowness);
            return {
                minor: temp.minor * 10,
                major: temp.major * 10,
                numDigitsAfterDecimalPoint: 0
            };
        }
        if (width1 >= 300){
            return {
                minor: 10,
                major: 50,
                numDigitsAfterDecimalPoint: 0
            };
        }
        if (width1 >= 120){
            return {
                minor: 5,
                major: 20,
                numDigitsAfterDecimalPoint: 0
            };
        }
        if (width1 >= 60){
            return {
                minor: 2,
                major: 10,
                numDigitsAfterDecimalPoint: 0
            };
        }
        if (width1 >= 30){
            return {
                minor: 1,
                major: 5,
                numDigitsAfterDecimalPoint: 0
            };
        }
        if (width1 >= 12){
            return {
                minor: 0.5,
                major: 2,
                numDigitsAfterDecimalPoint: 0
            };
        }
        if (width1 >= 6){
            return {
                minor: 0.2,
                major: 1,
                numDigitsAfterDecimalPoint: 0
            };
        }
        var temp = this.defaultTickDistancesFromWidth(width * 10, narrowness);
        return {
            minor: temp.minor / 10,
            major: temp.major / 10,
            numDigitsAfterDecimalPoint: 1 + temp.numDigitsAfterDecimalPoint
        };
    },
    xAxis : function(ctx, options){
        var labelAdjustmentFunction = "labelAdjustmentFunction" in options ? options.labelAdjustmentFunction : function(lbl){ return lbl; };
        var axisLabelDistanceFromRight = "undefined", centerAxisLabel;
        if ("axisLabelDistanceFromRight" in options){
            axisLabelDistanceFromRight = options.axisLabelDistanceFromRight;
            centerAxisLabel = false;
        } else {
            if (!("centerAxisLabel" in options) || options.centerAxisLabel){
                centerAxisLabel = true;
            } else {
                centerAxisLabel = false;
                axisLabelDistanceFromRight = 10;
            }
        }
        var narrowness = "narrowness" in options ? options.narrowness : 1;
        var showTicks = "showTicks" in options ? options.showTicks : true;
        var showNumberLables = "showNumberLables" in options ? options.showNumberLables : true;
        var useK = "useK" in options ? options.useK : false;
        var min;  // minimum of x, default 0
        var max;  // maximum of x, default width of canvas
        var axisMin;
        var axisMax;
        var minorStep;  // distance between two minor ticks
        var majorStep;  // distance between two major ticks (with number labels on them)
        var format;     // format for the labels, using String.sprintf from google string tools
        var minorTickLength;
        var majorTickLength;
        var distanceFromBottom;
        var lineWidth;
        var color;
        var font;
        var axisLabel;
        var distNumberLabelsAxis;
        var omitLabelIndex;
        var canvas = ctx.canvas;
        var cw = canvas.width;
        var ch = canvas.height;
        min = ("min" in options) ? options.min : 0;
        max = ("max" in options) ? options.max : cw;
        axisMin = ("axisMin" in options) ? options.axisMin : min;
        axisMax = ("axisMax" in options) ? options.axisMax : max;
        if ("majorStep" in options && "minorStep" in options){
            minorStep = options.minorStep;
            majorStep = options.majorStep;
        } else {
            var tickDistObj = this.defaultTickDistancesFromWidth(max-min, narrowness);
            minorStep = tickDistObj.minor;
            majorStep = tickDistObj.major;
        }
        var digitsAfterDecimalPoint = Math.max(0, -Math.floor(Math.log(majorStep)/Math.log(10)));
        var format = ("format" in options) ? options.format : "%15." + digitsAfterDecimalPoint + "f";
        minorTickLength = ("minorTickLength" in options) ? options.minorTickLength : 3;
        majorTickLength = ("majorTickLength" in options) ? options.majorTickLength : 6;
        distanceFromBottom = ("distanceFromBottom" in options) ? options.distanceFromBottom : Math.max(Math.round(0.1*ch), 50);
        lineWidth = ("lineWidth" in options) ? options.lineWidth : 1;
        color = ("color" in options) ? options.color : "black";
        font = ("font" in options) ? options.font : "11pt Arial";
        labelFont = ("labelFont" in options) ? options.labelFont : "12pt Arial";
        axisLabel = ("axisLabel" in options) ? options.axisLabel : "axisLabel";
        distNumberLabelsAxis = ("distNumberLabelsAxis" in options) ? options.distNumberLabelsAxis : 16;
        omitLabelIndex = ("omitLabelIndex" in options) ? options.omitLabelIndex : -1;
        var y = ch - distanceFromBottom;
        var toCanvasFactor = cw/(max-min);
        function trafoToCanvas(x){
            return (x - min) * toCanvasFactor;
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        // the axis itself
        ctx.beginPath();
        ctx.moveTo(trafoToCanvas(axisMin), y);
        ctx.lineTo(trafoToCanvas(axisMax), y);
        ctx.stroke();
        if ("omitTicks" in options){
            return {
                distanceFromBottom: distanceFromBottom
            };
        }
        // the ticks
        function makeTicks(tickDistance, tickLength){
            var x = tickDistance * Math.ceil(axisMin/tickDistance);
            while (x <= axisMax){
                canvX = trafoToCanvas(x);
                ctx.beginPath();
                ctx.moveTo(canvX, y);
                ctx.lineTo(canvX, y - tickLength);
                ctx.stroke();
                x += tickDistance;
            }
        }
        if (showTicks){
            makeTicks(minorStep, minorTickLength);
            makeTicks(majorStep, majorTickLength);
        }
        // the number labels
        function makeNumberLabels(labelDistance){
            var result = [];
            var x = labelDistance * Math.ceil(min/labelDistance);
            var index = 0;
            while (x <= axisMax){
                if (index != omitLabelIndex && x >= axisMin){
                    canvX = trafoToCanvas(x);
                    if (canvX >= 12 && canvX <= cw - 12){
                        var lbl = labelAdjustmentFunction(format.sprintf(x).trim(), x);
                        if (useK){
                            var start = lbl.slice(0, -3);
                            var end = lbl.slice(-3);
                            if (end == "000"){
                                lbl = start + "K"
                            }
                        }
                        var txtX = canvX;
                        var txtY = y + distNumberLabelsAxis;
                        ctx.fillText(lbl, txtX, txtY);
                        result.push({
                            x: x,
                            lbl: lbl,
                            txtX: txtX,
                            txtY: txtY
                        })
                    }
                }
                x += labelDistance;
                index++;
            }
            return result;
        }
        if (showNumberLables){
            ctx.textAlign = "center";
            ctx.font = font;
            var labels = makeNumberLabels(majorStep);
        }
        // axis label
        if (axisLabel.length > 0){
            ctx.font = labelFont;
            ctx.textAlign = "right";
            if (centerAxisLabel){
                var lblWidth = ctx.measureText(axisLabel).width;
                var axisWidth = trafoToCanvas(axisMax) - trafoToCanvas(axisMin);
                axisLabelDistanceFromRight = (axisWidth - lblWidth)/2;
            }
            var labelY = distanceFromBottom >= 40 ? y + 35 : y - 15;
            ctx.fillText(axisLabel, cw-axisLabelDistanceFromRight, labelY);
        }
        return {
            distanceFromBottom: distanceFromBottom,
            labels: labels,
            font: font,
            trafo: trafoToCanvas
        };
    },
    yAxis : function(ctx, options){
        var narrowness = "narrowness" in options ? options.narrowness : 1;
        var axisLabelDistanceFromTop = "undefined", centerAxisLabel;
        if ("axisLabelDistanceFromTop" in options){
            axisLabelDistanceFromTop = options.axisLabelDistanceFromTop;
            centerAxisLabel = false;
        } else {
            if (!("centerAxisLabel" in options) || options.centerAxisLabel){
                centerAxisLabel = true;
            } else {
                centerAxisLabel = false;
                axisLabelDistanceFromTop = 10;
            }
        }
        var min;  // minimum of y, default 0
        var max;  // maximum of y, default height of canvas
        var axisMin;
        var axisMax;
        var minorStep;  // distance between two minor ticks
        var majorStep;  // distance between two major ticks (with number labels on them)
        var format;     // format for the labels, using String.sprintf from google string tools
        var minorTickLength;
        var majorTickLength;
        var distanceFromLeft;
        var lineWidth;
        var color;
        var font;
        var axisLabel;
        var distNumberLabelsAxis;
        var omitLabelIndex;
        var canvas = ctx.canvas;
        var cw = canvas.width;
        var ch = canvas.height;
        min = ("min" in options) ? options.min : 0;
        max = ("max" in options) ? options.max : ch;
        axisMin = ("axisMin" in options) ? options.axisMin : min;
        axisMax = ("axisMax" in options) ? options.axisMax : max;
        if ("majorStep" in options && "minorStep" in options){
            minorStep = options.minorStep;
            majorStep = options.majorStep;
        } else {
            var tickDistObj = this.defaultTickDistancesFromWidth(max-min, narrowness);
            minorStep = tickDistObj.minor;
            majorStep = tickDistObj.major;
        }
        var digitsAfterDecimalPoint = Math.max(0, -Math.floor(Math.log(majorStep)/Math.log(10)));
        var format = ("format" in options) ? options.format : "%15." + digitsAfterDecimalPoint + "f";
        minorTickLength = ("minorTickLength" in options) ? options.minorTickLength : 3;
        majorTickLength = ("majorTickLength" in options) ? options.majorTickLength : 6;
        distanceFromLeft = ("distanceFromLeft" in options) ? options.distanceFromLeft : Math.max(Math.round(0.1*cw), 50);
        lineWidth = ("lineWidth" in options) ? options.lineWidth : 1;
        color = ("color" in options) ? options.color : "black";
        font = ("font" in options) ? options.font : "11pt Arial";
        labelFont = ("labelFont" in options) ? options.labelFont : "12pt Arial";
        axisLabel = ("axisLabel" in options) ? options.axisLabel : "axisLabel";
        distNumberLabelsAxis = ("distNumberLabelsAxis" in options) ? options.distNumberLabelsAxis : 7;
        omitLabelIndex = ("omitLabelIndex" in options) ? options.omitLabelIndex : -1;
        var labelLeftOfAxisWhenLeftGapGreaterThan = "labelLeftOfAxisWhenLeftGapGreaterThan" in options ?
            options.labelLeftOfAxisWhenLeftGapGreaterThan : 75;
        var x = distanceFromLeft;
        var toCanvasFactor = ch/(max-min);
        function trafoToCanvas(y){
            return (max - y) * toCanvasFactor;
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        // the axis itself
        ctx.beginPath();
        ctx.moveTo(x, trafoToCanvas(axisMin));
        ctx.lineTo(x, trafoToCanvas(axisMax));
        ctx.stroke();
        if ("omitTicks" in options){
            return {
                trafo: trafoToCanvas
            };
        }
        // the ticks
        function makeTicks(tickDistance, tickLength){
            var y = tickDistance * Math.ceil(axisMin/tickDistance);
            while (y <= axisMax){
                canvY = trafoToCanvas(y);
                ctx.beginPath();
                ctx.moveTo(x, canvY);
                ctx.lineTo(x + tickLength, canvY);
                ctx.stroke();
                y += tickDistance;
            }
        }
        makeTicks(minorStep, minorTickLength);
        makeTicks(majorStep, majorTickLength);
        // the number labels
        ctx.textAlign = "right";
        ctx.font = font;
        function makeNumberLabels(labelDistance){
            var y = labelDistance * Math.ceil(min/labelDistance);
            var index = 0;
            while (y <= axisMax){
                if (index != omitLabelIndex && y >= axisMin){
                    canvY = trafoToCanvas(y);
                    ctx.fillText(format.sprintf(y).trim(), x - distNumberLabelsAxis, canvY + 5);
                }
                y += labelDistance;
                index++;
            }
        }
        makeNumberLabels(majorStep);
        if (axisLabel.length > 0){
            // axis label
            ctx.font = labelFont;
            ctx.textAlign = "right";
            ctx.save();
            var labelX;
            if (distanceFromLeft <= labelLeftOfAxisWhenLeftGapGreaterThan){
                labelX = distanceFromLeft + 25;
            } else {
                labelX = 25;
            }
            if (centerAxisLabel){
                var lblWidth = ctx.measureText(axisLabel).width;
                var axisHeight = -trafoToCanvas(axisMax) + trafoToCanvas(axisMin);
                axisLabelDistanceFromTop = (axisHeight - lblWidth)/2;
            }
            ctx.translate(labelX, axisLabelDistanceFromTop);
            ctx.rotate(-Math.PI/2);
            ctx.fillText(axisLabel, 0, 0);
            ctx.restore();
        }
        return {
            trafo: trafoToCanvas
        };
    },
    xyAxis : function(ctx, optionsX, optionsY, options){
        if (arguments.length < 4){
            options = {};
        }
        var xNarrowness = "narrowness" in optionsX ? optionsX.narrowness : 1;
        var yNarrowness = "narrowness" in optionsY ? optionsY.narrowness : 1;
        var minorStepX, majorStepX, minorStepY, majorStepY;
        if ("majorStep" in optionsX && "minorStep" in optionsX){
            minorStepX = optionsX.minorStep;
            majorStepX = optionsX.majorStep;
        } else {
            var tickDistObjX = this.defaultTickDistancesFromWidth(optionsX.max-optionsX.min, xNarrowness);
            minorStepX = tickDistObjX.minor;
            majorStepX = tickDistObjX.major;
            optionsX.minorStep = minorStepX;
            optionsX.majorStep = majorStepX;
        }        
        if ("majorStep" in optionsY && "minorStep" in optionsY){
            minorStepY = optionsY.minorStep;
            majorStepY = optionsY.majorStep;
        } else {
            var tickDistObjY = this.defaultTickDistancesFromWidth(optionsY.max-optionsY.min, yNarrowness);
            minorStepY = tickDistObjY.minor;
            majorStepY = tickDistObjY.major;
            optionsY.minorStep = minorStepY;
            optionsY.majorStep = majorStepY;
        }
        var xFactor = ctx.canvas.width / (optionsX.max - optionsX.min);
        function trafoX(x){
            return (x - optionsX.min) * xFactor;
        }
        var yFactor = ctx.canvas.height / (optionsY.max - optionsY.min);
        function trafoY(y){
            return (optionsY.max - y) * yFactor;
        }
        var left, bottom, yAxisSetManually, xAxisSetManually;
        if ( "xValueOfYaxis" in options){
            left = options.xValueOfYaxis;
            yAxisSetManually = true;
        } else {
            left = majorStepX * Math.ceil(optionsX.min/majorStepX);
            yAxisSetManually = false;
        }
        if ( "yValueOfXaxis" in options){
            bottom = options.yValueOfXaxis;
            xAxisSetManually = true;
        } else {
            bottom = majorStepY * Math.ceil(optionsY.min/majorStepY);
            xAxisSetManually = false;
        }
        var canvasLeft = trafoX(left);
        var canvasBottom = trafoY(bottom);
        var vSpace = ctx.canvas.height - canvasBottom;
        if (canvasLeft >= 40 || yAxisSetManually){
            optionsY.distanceFromLeft = canvasLeft;
            optionsX.omitLabelIndex = 0;
        } else {
            optionsY.distanceFromLeft = trafoX(left + majorStepX);
            optionsX.omitLabelIndex = 1;
        }
        if (vSpace >= 20 || xAxisSetManually){
            optionsX.distanceFromBottom = vSpace;
            optionsY.omitLabelIndex = 0;
        } else {
            optionsX.distanceFromBottom = ctx.canvas.height - trafoY(bottom + majorStepY);
            optionsY.omitLabelIndex = 1;
        }
        if (options.allYlabels){
            optionsY.omitLabelIndex = -1;
        }
        if (options.allXlabels){
            optionsX.omitLabelIndex = -1;
        }
        var xRet = this.xAxis(ctx, optionsX);
        var yRet = this.yAxis(ctx, optionsY);
        return {
            xTrafo: xRet.trafo,
            yTrafo: yRet.trafo
        }
    },
    leftArrow: function(ctx, y, xRight, xLeft, arrowHeadLength, arrowThickness, color, lineWidth, dashing){
        var isDashed;
        if (arguments.length >= 9){
            isDashed = true;
        } else {
            isDashed = false;
        }
        if (arguments.length < 8){
            lineWidth = 1;
        }
        if (arguments.length < 7){
            color = "black";
        }
        if (arguments.length < 6){
            arrowThickness = 8;
        }
        if (arguments.length < 5){
            arrowHeadLength = 15;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        // arrow tail
        if (isDashed){
            CANVAS.dashedLine(ctx, xRight, y, xLeft + 0.5*arrowHeadLength, y, dashing);
        } else {
            ctx.beginPath();
            ctx.moveTo(xRight, y);
            ctx.lineTo(xLeft + 0.5*arrowHeadLength, y);
            ctx.stroke();
        }
        //arrow head
        ctx.beginPath();
        ctx.moveTo(xLeft,               y);  // the tip
        ctx.lineTo(xLeft + arrowHeadLength, y + 0.5*arrowThickness);
        ctx.lineTo(xLeft + arrowHeadLength, y - 0.5*arrowThickness);
        ctx.lineTo(xLeft,               y);  // back to the tip
        ctx.fill();
    },
    rightArrow: function(ctx, y, xRight, xLeft, arrowHeadLength, arrowThickness, color, lineWidth, dashing){
        var isDashed;
        if (arguments.length >= 9){
            isDashed = true;
        } else {
            isDashed = false;
        }
        if (arguments.length < 8){
            lineWidth = 1;
        }
        if (arguments.length < 7){
            color = "black";
        }
        if (arguments.length < 6){
            arrowThickness = 8;
        }
        if (arguments.length < 5){
            arrowHeadLength = 15;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        // arrow tail
        if (isDashed){
            CANVAS.dashedLine(ctx, xLeft, y, xRight - 0.5*arrowHeadLength, y, dashing);
        } else {
            ctx.beginPath();
            ctx.moveTo(xLeft, y);
            ctx.lineTo(xRight - 0.5*arrowHeadLength, y);
            ctx.stroke();
        }
        //arrow head
        ctx.beginPath();
        ctx.moveTo(xRight,               y);  // the tip
        ctx.lineTo(xRight - arrowHeadLength, y + 0.5*arrowThickness);
        ctx.lineTo(xRight - arrowHeadLength, y - 0.5*arrowThickness);
        ctx.lineTo(xRight,               y);  // back to the tip
        ctx.fill();
    },
    downArrow: function(ctx, x, yTop, yBottom, arrowHeadLength, arrowThickness, color, lineWidth, dashing){
        var isDashed;
        if (arguments.length >= 9){
            isDashed = true;
        } else {
            isDashed = false;
        }
        if (arguments.length < 8){
            lineWidth = 1;
        }
        if (arguments.length < 7){
            color = "black";
        }
        if (arguments.length < 6){
            arrowThickness = 8;
        }
        if (arguments.length < 5){
            arrowHeadLength = 15;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        // arrow tail
        if (isDashed){
            CANVAS.dashedLine(ctx, x, yTop, x, yBottom - 0.5*arrowHeadLength, dashing);
        } else {
            ctx.beginPath();
            ctx.moveTo(x, yTop);
            ctx.lineTo(x, yBottom - 0.5*arrowHeadLength);
            ctx.stroke();
        }
        //arrow head
        ctx.beginPath();
        ctx.moveTo(x,                      yBottom);  // the tip
        ctx.lineTo(x + 0.5*arrowThickness, yBottom - arrowHeadLength);
        ctx.lineTo(x - 0.5*arrowThickness, yBottom - arrowHeadLength);
        ctx.moveTo(x,                      yBottom);  // back to the tip
        ctx.fill();
    },
    upArrow: function(ctx, x, yTop, yBottom, arrowHeadLength, arrowThickness, color, lineWidth, dashing){
        var isDashed;
        if (arguments.length >= 9){
            isDashed = true;
        } else {
            isDashed = false;
        }
        if (arguments.length < 8){
            lineWidth = 1;
        }
        if (arguments.length < 7){
            color = "black";
        }
        if (arguments.length < 6){
            arrowThickness = 8;
        }
        if (arguments.length < 5){
            arrowHeadLength = 15;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        // arrow tail
        if (isDashed){
            CANVAS.dashedLine(ctx, x, yBottom, x, x, yTop + 0.5*arrowHeadLength, dashing);
        } else {
            ctx.beginPath();
            ctx.moveTo(x, yBottom);
            ctx.lineTo(x, yTop + 0.5*arrowHeadLength);
            ctx.stroke();
        }
        //arrow head
        ctx.beginPath();
        ctx.moveTo(x,                      yTop);  // the tip
        ctx.lineTo(x + 0.5*arrowThickness, yTop + arrowHeadLength);
        ctx.lineTo(x - 0.5*arrowThickness, yTop + arrowHeadLength);
        ctx.moveTo(x,                      yTop);  // back to the tip
        ctx.fill();
    },
    arrow: function(ctx, x0, y0, x1, y1, length, thickness, color, lineWidth){
        if (arguments.length >= 8){
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
        }
        if (arguments.length >= 9){
            ctx.lineWidth = lineWidth;
        }
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        var dx = x1 - x0;
        var dy = y1 - y0;
        var dx2 = dx*dx;
        var dy2 = dy*dy;
        var temp = Math.sqrt(dx2 + dy2);
        var dx0 = dx / temp;
        var dy0 = dy / temp;
        var baseX = x1 - dx0 * length;
        var baseY = y1 - dy0 * length;
        var cornerX1 = baseX - dy0 * thickness/2;
        var cornerY1 = baseY + dx0 * thickness/2;
        var cornerX2 = baseX + dy0 * thickness/2;
        var cornerY2 = baseY - dx0 * thickness/2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cornerX1, cornerY1);
        ctx.lineTo(cornerX2, cornerY2);
        ctx.lineTo(x1, y1);
        ctx.fill();
    },
    dashedLine : function(ctx, x, y, x2, y2, da){
        ctx.beginPath();
        var totalDx = x2 - x;
        var totalDy = y2 - y;
        var totalLenSquared = totalDx*totalDx + totalDy*totalDy;
        if (totalLenSquared <= 0.0000000001){
            return;
        }
        var totalLength = Math.sqrt(totalLenSquared);
        var cos = totalDx / totalLength;
        var sin = totalDy / totalLength;
        var factor = 1;
        function calcCountAndFactor(){
            var count = 0;
            var curX = x;
            var curY = y;
            var dashIndex = 0;
            var draw = true;
            while (true){
                var dashLen = da[dashIndex];
                var dx = cos * dashLen;
                var dy = sin * dashLen;
                var nextX = curX + dx;
                var nextY = curY + dy;
                var tmpX = nextX - x;
                var tmpY = nextY - y;
                var curSquaredLength = tmpX*tmpX + tmpY*tmpY;
                if (curSquaredLength >= totalLenSquared){
                    if (draw){
                        len = Math.sqrt(curSquaredLength);
                        factor = totalLength / len;
                        return count + 1;
                    } else {
                        tmpX = curX-x; tmpY = curY-y;
                        len = Math.sqrt(tmpX*tmpX + tmpY*tmpY);
                        factor = totalLength / len;
                        return count;
                    }
                }
                curX = nextX;
                curY = nextY;
                draw = !draw;
                dashIndex++;
                if (dashIndex == da.length) dashIndex = 0;
                count++;
            }
        }
        var curX = x;
        var curY = y;
        var dashIndex = 0;
        var draw = true;
        ctx.moveTo(x, y);
        var numRuns = calcCountAndFactor();
        cos *= factor;
        sin *= factor;
        for (var run=0; run<numRuns; run++){
            var dashLen = da[dashIndex];
            var dx = cos * dashLen;
            var dy = sin * dashLen;
            curX += dx;
            curY += dy;
            if (draw){
                ctx.lineTo(curX, curY);
            } else {
                ctx.moveTo(curX, curY);
            }
            draw = !draw;
            dashIndex++;
            if (dashIndex == da.length) dashIndex = 0;
        }
        ctx.stroke();
    },
    alphaChar: function(ctx, centerX, centerY, scale){
        var xRight = centerX + 20*scale;
        var xLeft  = centerX - 20*scale;
        var yLeftTop = centerY - 50*scale;
        var yLeftBot = centerY + 50*scale;
        var yRightTop = centerY - 13*scale;
        var yRightBot = centerY + 13*scale;
        ctx.beginPath();
        ctx.moveTo(xRight, yRightTop);
        ctx.bezierCurveTo(xLeft, yLeftBot, xLeft, yLeftTop, xRight, yRightBot);
        ctx.stroke();
    },
    mathematicaCrossHairs: function(ctx, x, y, options){
        if (arguments.length < 4){
            options = {};
        }
        var innerRadius = "innerRadius" in options ? options.innerRadius : 2;
        var outerRadius = "outerRadius" in options ? options.outerRadius : 7;
        var hairLength = "hairLength" in options ? options.hairLength : 10;
        var color = "color" in options ? options.color : "rgb(177,177,177)";
        // outer circle area
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, 2*Math.PI);
        ctx.fill();
        // outer circle edge
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, 2*Math.PI);
        ctx.stroke();
        // hairs
        var a = innerRadius;
        var b = a + hairLength;
        ctx.beginPath(); ctx.moveTo(x + a, y    ); ctx.lineTo(x + b, y    ); ctx.stroke(); // right
        ctx.beginPath(); ctx.moveTo(x - a, y    ); ctx.lineTo(x - b, y    ); ctx.stroke(); // left
        ctx.beginPath(); ctx.moveTo(x,     y + a); ctx.lineTo(x,     y + b); ctx.stroke(); // bottom
        ctx.beginPath(); ctx.moveTo(x,     y - a); ctx.lineTo(x,     y - b); ctx.stroke(); // top
        // eye
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, innerRadius, 0, 2*Math.PI);
        ctx.fill();
    }
};
function Histogram(ctx, values, options){
    var n = values.length;
    var xLabelAdjustmentFunction = "xLabelAdjustmentFunction" in options ? options.xLabelAdjustmentFunction : function(x){return x;};
    var yLabelAdjustmentFunction = "yLabelAdjustmentFunction" in options ? options.yLabelAdjustmentFunction : function(x){return x;};
    var omitXAxis = "omitXAxis" in options && options.omitXAxis ? true : false;
    var omitYAxis = "omitYAxis" in options && options.omitYAxis ? true : false;
    var leftGap = "leftGap" in options ? options.leftGap : 20;
    var bottomGap = "bottomGap" in options ? options.bottomGap : 22;
    var topGap = "topGap" in options ? options.topGap : 8;
    var rightGap = "rightGap" in options ? options.rightGap : 10;
    var xMin, xMax, xAxisMin, xAxisMax;
    if ("xAxisMin" in options && "xAxisMax" in options){
        xAxisMin = options.xAxisMin;
        xAxisMax = options.xAxisMax;
        xMin = "xMin" in options ? options.xMin : xAxisMin + 0.5 * (xAxisMax - xAxisMin) / n;
        xMax = "xMax" in options ? options.xMax : xAxisMax - 0.5 * (xAxisMax - xAxisMin) / n;
    } else {
        xMin = "xMin" in options ? options.xMin : 0;
        xMax = "xMax" in options ? options.xMax : n - 1;
        var hcw = 0.5 * (xMax - xMin)/(n-1);   // half column width
        xAxisMin = xMin - hcw;
        xAxisMax = xMax + hcw;
    }
    var yMax = "yMax" in options ? options.yMax : values.max();
    var color = "color" in options ? options.color : "rgb(204,211,247)";
    var borderColor = "borderColor" in options ? options.borderColor : "black";
    var lineWidth = "lineWidth" in options ? options.lineWidth : 1;
    var xAxisLabel = "xAxisLabel" in options ? options.xAxisLabel : "";
    var yAxisLabel = "yAxisLabel" in options ? options.yAxisLabel : "";
    var showXticks = "showXticks" in options ? options.showXticks : false;
    var showXnumberLabels = "showXnumberLabels" in options ? options.showXnumberLabels : true;
    var xUseK = "xUseK" in options ? options.xUseK : false;
    var yUseK = "yUseK" in options ? options.yUseK : false;
    var xNarrowness = "xNarrowness" in options ? options.xNarrowness : 1;
    var yNarrowness = "yNarrowness" in options ? options.yNarrowness : 1;
    var canvasWidth = ctx.canvas.width;
    var canvasHeight = ctx.canvas.height;
    var canvasInnerWidth = canvasWidth - leftGap - rightGap;
    var reducedInnerWidth = canvasInnerWidth * (xMax - xMin) / (xAxisMax - xAxisMin);
    //var columnWidth = canvasInnerWidth/n;
    var columnWidth = reducedInnerWidth / (n-1);
    //var canvasFirstLastColXdist = canvasInnerWidth - columnWidth;
    var maxColumnHeight = canvasHeight - bottomGap - topGap;
    var yScaleFactor = maxColumnHeight / yMax;
    //var xScaleFactor = canvasFirstLastColXdist / (xMax - xMin);
    var xScaleFactor = reducedInnerWidth / (xMax - xMin);
    //var firstColumnCenterXcanvas = leftGap + columnWidth/2;
    var firstColumnCenterXcanvas = leftGap + canvasInnerWidth * (xMin - xAxisMin) / (xAxisMax - xAxisMin);
    
    function yTrafo(y){
        return canvasHeight - (bottomGap + yScaleFactor * y);
    }
    function invYtrafo(yCanvas){
        return (canvasHeight - yCanvas - bottomGap)/yScaleFactor;
    }
    function xTrafo(x){
        return firstColumnCenterXcanvas + xScaleFactor * (x - xMin);
    }
    function invXtrafo(xCanvas) {
        return (xCanvas - firstColumnCenterXcanvas)/xScaleFactor + xMin;
    }
    ctx.fillStyle = color;
    var yBottom = yTrafo(0);
    for (var i=0; i<n; i++){
        var xLeft = leftGap + i * columnWidth;
        var yTop = yTrafo(values[i]);
        var columnHeight = -yTop + yBottom;
        ctx.fillRect(xLeft, yTop, columnWidth, columnHeight);
    }
    ctx.strokStyle = borderColor;
    for (var i=0; i<n; i++){
        var xLeft = leftGap + i * columnWidth;
        var yTop = yTrafo(values[i]);
        var columnHeight = -yTop + yBottom;
        ctx.strokeRect(xLeft, yTop, columnWidth, columnHeight);
    }
    
    var yAxisOptions = omitYAxis ? null : {
        axisMin: 0,
        axisMax: yMax,
        min: invYtrafo(canvasHeight),
        max: invYtrafo(0),
        distanceFromLeft: leftGap,
        axisLabel: yAxisLabel,
        useK: yUseK,
        narrowness: yNarrowness,
        labelAdjustmentFunction: yLabelAdjustmentFunction
    };
    var xAxisOptions = omitXAxis ? null : {
        axisMin: xAxisMin,
        axisMax: xAxisMax,
        min: invXtrafo(0),
        max: invXtrafo(canvasWidth),
        distanceFromBottom: bottomGap,
        axisLabel: xAxisLabel,
        showTicks: showXticks,
        showNumberLables: showXnumberLabels,
        useK: xUseK,
        narrowness: xNarrowness,
        labelAdjustmentFunction: xLabelAdjustmentFunction
    };
    if (!omitXAxis) { CANVAS.xAxis(ctx, xAxisOptions); }
    if (!omitYAxis) { CANVAS.yAxis(ctx, yAxisOptions); }
    //
    this.ctx = ctx;
    this.values = values;
    this.leftGap = leftGap;
    this.bottomGap = bottomGap;
    this.topGap = topGap;
    this.xMin = xMin;
    this.xMax = xMax;
    this.xAxisMin = xAxisMin;
    this.xAxisMax = xAxisMax;
    this.yMax = yMax;
    this.color = color;
    this.borderColor = borderColor;
    this.lineWidth = lineWidth;
    this.columnWidth = columnWidth;
    this.xTrafo = xTrafo;
    this.yTrafo = yTrafo;
    this.invYtrafo = invYtrafo;
    this.xAxisOptions = yAxisOptions;
    this.yAxisOptions = yAxisOptions;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
    this.omitXAxis = omitXAxis;
    this.omitYAxis = omitYAxis;
}
function pdfHistogram(ctx, sampleSize, binCount, inverseCDF, histogramOptions, moreOptions){
    var asProbabilities = "asProbabilities" in moreOptions ? moreOptions.asProbabilities : false;
    var forbidValuesBelow = "forbidValuesBelow" in moreOptions ? moreOptions.forbidValuesBelow : -Infinity;
    var forbidValuesOver = "forbidValuesOver" in moreOptions ? moreOptions.forbidValuesOver : Infinity;
    var values = new Array(sampleSize);
    var sampleCounter = 0;
    while (sampleCounter < sampleSize){
        var v = inverseCDF(Math.random());
        if (v >= forbidValuesBelow && v <= forbidValuesOver){
            values[sampleCounter] = v;
            sampleCounter++;
        }
    }
    var temp = values.binCount1(binCount);
    var bins = temp.bins;
    if (asProbabilities){
        for (var i=0; i<bins.length; i++){
            bins[i] /= sampleSize;
        }
    }
    var lo = temp.lo;
    var hi = temp.hi;
    var histOpts = jQuery.extend({xMin: lo, xMax: hi}, histogramOptions);
    var hist = new Histogram(ctx, bins, histOpts);
    return {
        hist: hist,
        values: values,
        bins: bins,
        lo: lo,
        hi: hi
    }
}
function generateSample(sampleSize, inverseCDF){
    var result = new Array(sampleSize);
    var sampleCounter = 0;
    while (sampleCounter < sampleSize){
        var v = inverseCDF(Math.random());
        result[sampleCounter] = v;
        sampleCounter++;
    }
    return result;
}
function TwoPdfsHistogram(ctx, inverseCDF1, histogramOptions1, inverseCDF2, histogramOptions2, options, histogramOptions3){
    var asProbabilities = "asProbabilities" in options ? options.asProbabilities : false;
    var forbidValuesBelow = "forbidValuesBelow" in options ? options.forbidValuesBelow : -Infinity;
    var forbidValuesOver = "forbidValuesOver" in options ? options.forbidValuesOver : Infinity;
    var sampleSize1 = "sampleSize1" in options ? options.sampleSize1 :  ( "sampleSize" in options ? options.sampleSize : 10000 ); 
    var sampleSize2 = "sampleSize2" in options ? options.sampleSize2 :  ( "sampleSize" in options ? options.sampleSize : 10000 );
    var binCount = "binCount" in options ? options.binCount : 40 
    var values1 = new Array(sampleSize1);
    var values2 = new Array(sampleSize2);
    var sampleCounter1 = 0;
    while (sampleCounter1 < sampleSize1){
        var v = inverseCDF1(Math.random());
        if (v >= forbidValuesBelow && v <= forbidValuesOver){
            values1[sampleCounter1] = v;
            sampleCounter1++;
        }
    }
    var sampleCounter2 = 0;
    while (sampleCounter2 < sampleSize2){
        var v = inverseCDF2(Math.random());
        if (v >= forbidValuesBelow){
            values2[sampleCounter2] = v;
            sampleCounter2++;
        }
    }
    var temp = duoBinCount(values1, values2, binCount);
    var bins1 = temp.bins1;
    var bins2 = temp.bins2;
    var low = temp.low;
    var high = temp.high;
    if (asProbabilities){
        for (var i=0; i<bins1.length; i++){
            bins1[i] /= sampleSize1;
        }
        for (var i=0; i<bins2.length; i++){
            bins2[i] /= sampleSize2;
        }
    }
    var minBins = new Array(bins1.length);
    for (var i=0; i<minBins.length; i++){
        minBins[i] = Math.min(bins1[i], bins2[i]);
    }
    var biMax1 = bins1.max();
    var biMax2 = bins2.max();
    var biMax = Math.max(biMax1, biMax2);
    var histOpts1 = jQuery.extend({xAxisMin: low, xAxisMax: high, yMax: biMax}, histogramOptions1);
    var histOpts2 = jQuery.extend({xAxisMin: low, xAxisMax: high, omitXAxis: true, omitYAxis: true, yMax: biMax}, histogramOptions2);
    var histOpts3 = jQuery.extend({xAxisMin: low, xAxisMax: high, omitXAxis: true, omitYAxis: true, yMax: biMax}, histogramOptions3);
    var hist1 = new Histogram(ctx, bins1, histOpts1);
    var hist2 = new Histogram(ctx, bins2, histOpts2);
    var hist3 = new Histogram(ctx, minBins, histOpts3);
    return {
        hist1: hist1,
        values1: values1,
        bins1: bins1,
        hist2: hist2,
        values2: values2,
        bins2: bins2,
        hist3: hist3,
        minBins: minBins,
        xAxisMin: low,
        xAxisMax: high
    };
}
function CanvasPlot(ctx, func, options){
    this.ctx = ctx;
    this.func = func;
    this.xMin = options.xMin;
    this.xMinPlot = "xMinPlot" in options ? options.xMinPlot : options.xMin;
    this.xMax = options.xMax;
    this.xMaxPlot = "xMaxPlot" in options ? options.xMaxPlot : options.xMax;
    this.yMin = options.yMin;
    this.yMax = options.yMax;
    this.color = "color" in options ? options.color : "black";
    this.lineWidth = "lineWidth" in options ? options.lineWidth : 1;
    this.canvasWidth = ctx.canvas.width;
    this.canvasHeight = ctx.canvas.height;
    this.scaledWidth = this.xMax - this.xMin;
    this.scaledHeight = this.yMax - this.yMin;
    this.xFactor = this.canvasWidth / this.scaledWidth;
    this.yFactor = this.canvasHeight / this.scaledHeight;
    this.step = "step" in options ? options.step : 2 / this.xFactor;
    this.axisY = "axisY" in options ? options.axisY : 0;
    this.borderColor = "borderColor" in options ? options.borderColor : "omitBorder";   // used only in fill plot
}
CanvasPlot.prototype.xTrafo = function(x){
    return (x - this.xMin) * this.xFactor;
}
CanvasPlot.prototype.yTrafo = function(y){
    return this.canvasHeight - (y - this.yMin) * this.yFactor;
}
CanvasPlot.prototype.plot = function(){
    var ctx = this.ctx;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    var yMinData = Infinity;
    var yMaxData = -Infinity;
    var xScaled = this.xMinPlot;
    var yScaled = this.func(xScaled);
    var xCanvas = this.xTrafo(xScaled);
    var yCanvas = this.yTrafo(yScaled);
    ctx.beginPath();
    ctx.moveTo(xCanvas, yCanvas);
    while (true){
        xScaled += this.step;
        if (xScaled > this.xMaxPlot + this.step/2){
            break;
        }
        yScaled = this.func(xScaled);
        yMinData = Math.min(yMinData, yScaled);
        yMaxData = Math.max(yMaxData, yScaled);
        xCanvas = this.xTrafo(xScaled);
        yCanvas = this.yTrafo(yScaled);
        ctx.lineTo(xCanvas, yCanvas);
    }
    ctx.stroke();
    this.yMinData = yMinData;
    this.yMaxData = yMaxData;
}
CanvasPlot.prototype.fillPlot = function(){
    var ctx = this.ctx;
    ctx.fillStyle = this.color;
    var yMinData = Infinity;
    var yMaxData = -Infinity;
    var xScaled = this.xMinPlot;
    var yScaled = this.func(xScaled);
    var xCanvasStart = this.xTrafo(xScaled);
    var yCanvasStart = this.yTrafo(yScaled);
    var yCanvas = yCanvasStart;
    var yAxisCanvas = this.yTrafo(this.axisY);
    ctx.beginPath();
    ctx.moveTo(xCanvasStart, yAxisCanvas);
    ctx.lineTo(xCanvasStart, yCanvas);
    var xCanvas = xCanvasStart;
    while (true){
        xScaled += this.step;
        if (xScaled > this.xMaxPlot + this.step/2){
            break;
        }
        yScaled = this.func(xScaled);
        yMinData = Math.min(yMinData, yScaled);
        yMaxData = Math.max(yMaxData, yScaled);
        xCanvas = this.xTrafo(xScaled);
        yCanvas = this.yTrafo(yScaled);
        ctx.lineTo(xCanvas, yCanvas);
    }
    ctx.lineTo(xCanvas, yAxisCanvas);
    ctx.lineTo(xCanvasStart, yAxisCanvas);
    ctx.fill();
    if (this.borderColor != "omitBorder"){
        ctx.lineWidth = this.lineWidth;
        ctx.strokStyle = this.borderColor;
        ctx.beginPath();
        ctx.moveTo(xCanvas, yCanvas);
        ctx.lineTo(xCanvas, yAxisCanvas);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xCanvasStart, yCanvasStart);
        ctx.lineTo(xCanvasStart, yAxisCanvas);
        ctx.stroke();
    }
    this.yMinData = yMinData;
    this.yMaxData = yMaxData;
}
CanvasPlot.prototype.showPoint = function(x, options){
    var radius = ("radius" in options ? options.radius : 1.6);
    var color = ("color" in options ? options.color : "red");
    var axisX = ("axisX" in options ? options.axisX : 0);
    var axisY = ("axisY" in options ? options.axisY : 0);
    var epsilonX = ("epsilonX" in options ? options.epsilonX : 4);
    var epsilonY = ("epsilonY" in options ? options.epsilonY : 4);
    var y = this.func(x);
    var xCanvas = this.xTrafo(x);
    var yCanvas = this.yTrafo(y);
    var ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xCanvas, yCanvas, radius, 0, 2*Math.PI);
    ctx.fill();
    var axisXcanv = this.xTrafo(axisX);
    var axisYcanv = this.yTrafo(axisY);
    CANVAS.leftArrow(ctx, yCanvas, xCanvas, axisXcanv + epsilonX, 15, 8, color, 1);
    CANVAS.downArrow(ctx, xCanvas, yCanvas, axisYcanv - epsilonY, 15, 8, color, 1);
}
function MouseCanvas(options){
    var id = options.id;
    var mousedown = "mousedown" in options ? options.mousedown : null;
    var mousemove = "mousemove" in options ? options.mousemove : null;
    var mouseup   = "mouseup"   in options ? options.mouseup   : null;
    var mouseover = "mouseover" in options ? options.mouseover : null;
    var mouseout  = "mouseout"  in options ? options.mouseout  : null;
    var elt = $("#" + id);
    var ctx = elt[0].getContext('2d');
    var cWidth = ctx.canvas.width;
    var cHeight = ctx.canvas.height;
    var xMin = ("xMin" in options ? options.xMin : 0);
    var xMax = ("xMax" in options ? options.xMax : cWidth);
    var yMin = ("yMin" in options ? options.yMin : 0);
    var yMax = ("yMax" in options ? options.yMax : cHeight);
    var scaledWidth = xMax - xMin;
    var scaledHeight = yMax - yMin;
    var xToCanvasFactor = cWidth / scaledWidth;
    var xFromCanvasFactor = scaledWidth / cWidth;
    var yToCanvasFactor = cHeight / scaledHeight;
    var yFromCanvasFactor = scaledHeight / cHeight;
    function xToCanvas(x){
        return (x-xMin) * xToCanvasFactor;
    }
    function xFromCanvas(x){
        return xMin + xFromCanvasFactor * x;
    }
    function yToCanvas(y){
        return cHeight - (y-yMin) * yToCanvasFactor;
    }
    function yFromCanvas(y){
        return (cHeight - y) * yFromCanvasFactor + yMin;
    }
    if (mousedown){
        elt.mousedown(function(evt){
            var off = elt.offset();
            var oTop = off.top;
            var oLeft = off.left;
            var xCanvas = evt.pageX - oLeft;
            var yCanvas = evt.pageY - oTop;
            var xScaled = xFromCanvas(xCanvas);
            var yScaled = yFromCanvas(yCanvas);
            mousedown(xScaled, yScaled, evt, xCanvas, yCanvas);
        });
    }
    if (mousemove){
        elt.mousemove(function(evt){
            var off = elt.offset();
            var oTop = off.top;
            var oLeft = off.left;
            var xCanvas = evt.pageX - oLeft;
            var yCanvas = evt.pageY - oTop;
            var xScaled = xFromCanvas(xCanvas);
            var yScaled = yFromCanvas(yCanvas);
            mousemove(xScaled, yScaled, evt, xCanvas, yCanvas);
        });
    }
    if (mouseup){
        elt.mouseup(function(evt){
            var off = elt.offset();
            var oTop = off.top;
            var oLeft = off.left;
            var xCanvas = evt.pageX - oLeft;
            var yCanvas = evt.pageY - oTop;
            var xScaled = xFromCanvas(xCanvas);
            var yScaled = yFromCanvas(yCanvas);
            mouseup(xScaled, yScaled, evt, xCanvas, yCanvas);
        });
    }
    if (mouseover){
        elt.mouseover(function(evt){
            var off = elt.offset();
            var oTop = off.top;
            var oLeft = off.left;
            var xCanvas = evt.pageX - oLeft;
            var yCanvas = evt.pageY - oTop;
            var xScaled = xFromCanvas(xCanvas);
            var yScaled = yFromCanvas(yCanvas);
            mouseover(xScaled, yScaled, evt, xCanvas, yCanvas);
        });
    }
    if (mouseout){
        elt.mouseout(function(evt){
            var off = elt.offset();
            var oTop = off.top;
            var oLeft = off.left;
            var xCanvas = evt.pageX - oLeft;
            var yCanvas = evt.pageY - oTop;
            var xScaled = xFromCanvas(xCanvas);
            var yScaled = yFromCanvas(yCanvas);
            mouseout(xScaled, yScaled, evt, xCanvas, yCanvas);
        });
    }
    this.id = id;
    this.ctx = ctx;
    this.elt = elt;
    this.mousedown = mousedown;
    this.mousemove = mousemove;
    this.mouseup = mouseup;
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.xToCanvas = xToCanvas;
    this.xFromCanvas = xFromCanvas;
    this.yToCanvas = yToCanvas;
    this.yFromCanvas = yFromCanvas;
}
function PointCollection(points, maxSquaredDistance){
    this.points = points;
    this.maxSd = maxSquaredDistance;
}
PointCollection.prototype._closestIndex = function(x, y){
    var min = Infinity;
    var minIndex;
    for (var i=0; i<this.points.length; i++){
        var point = this.points[i];
        var px = point.x;
        var py = point.y;
        var dx = x - px;
        var dy = y - py;
        var hypotSq = dx*dx + dy*dy;
        if (hypotSq < min){
            min = hypotSq;
            minIndex = i;
        }
    }
    if (min < this.maxSd){
        return minIndex;
    } else {
        return -1;
    }
}
PointCollection.prototype.closestIndex = function(xCanvas, yCanvas){
    var min = Infinity;
    var minIndex;
    for (var i=0; i<this.points.length; i++){
        var point = this.points[i];
        var pxc = point.xCanvas;
        var pyc = point.yCanvas;
        var dx = xCanvas - pxc;
        var dy = yCanvas - pyc;
        var hypotSq = dx*dx + dy*dy;
        if (hypotSq < min){
            min = hypotSq;
            minIndex = i;
        }
    }
    if (min < this.maxSd){
        return minIndex;
    } else {
        return -1;
    }
}
function DragDropCanvas(options){
    var id = options.id;
    var points = options.points;
    var radius = -1, maxSquaredDistance;
    if ("radius" in options){
        radius = options.radius;
        maxSquaredDistance = radius * radius;
    } else {
        if ("maxSquaredDistance" in options){
            maxSquaredDistance =  options.maxSquaredDistance;
        } else {
            radius = this.defaultRadius;
            maxSquaredDistance = radius * radius;
        }
    }
    var immutableX = false;
    if ("immutableX" in options && options.immutableX){
        immutableX = true;
    }
    var immutableY = false;
    if ("immutableY" in options && options.immutableY){
        immutableY = true;
    }
    var additionalCallback = "additionalCallback" in options ? options.additionalCallback : null;
    this.additionalCallback = additionalCallback;
    var mouseover = "mouseover" in options ? options.mouseover : null;
    var minAllowedY = "minAllowedY" in options ? options.minAllowedY : -Infinity;
    var maxAllowedY = "maxAllowedY" in options ? options.maxAllowedY :  Infinity;
    this.minAllowedY = minAllowedY;
    this.maxAllowedY = maxAllowedY;
    this.app = "app" in options ? options.app : null;
    this.immutableX = immutableX;
    this.immutableY = immutableY;
    var color = "color" in options ? options.color : this.defaultColor;
    var textColor = "textColor" in options ? options.textColor : this.defaultTextColor;
    var font = "font" in options ? options.font : this.defaultFont;
    var pointColl = new PointCollection(points, maxSquaredDistance);
    var paintPoint = "paintPoint" in options ? options.paintPoint : this.paintPointDefault;
    var getText = "getText" in options ? options.getText : this.defaultGetText;
    var THIS = this;
    var repaintCallback = "repaintCallback" in options ? options.repaintCallback : function(ctx){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        THIS.repaint();
    }
    var mcOptions = {
        id: id,
        mousedown: function(xScaled, yScaled, evt, xCanvas, yCanvas){
            if (THIS.additionalCallback){
                THIS.additionalCallback(xScaled, yScaled, evt, xCanvas, yCanvas, "down");
            }
            THIS.movingIndex = THIS.pointColl.closestIndex(xCanvas, yCanvas);
            evt.preventDefault();
            return false;
        },
        mouseout: function(){
            THIS.movingIndex = -1;
        },
        mousemove: function(xScaled, yScaled, evt, xCanvas, yCanvas){
            if (THIS.additionalCallback){
                THIS.additionalCallback(xScaled, yScaled, evt, xCanvas, yCanvas, "move");
            }
            var targetIndex = THIS.movingIndex;
            if (targetIndex == -1){
                return;
            }
            var point = THIS.pointColl.points[targetIndex];
            if (!THIS.immutableX){
                point.x = xScaled;
                point.xCanvas = xCanvas;
            }
            if (!THIS.immutableY){
                if (yScaled < THIS.minAllowedY){
                    point.y = THIS.minAllowedY;
                } else {
                    if (yScaled > THIS.maxAllowedY){
                        point.y = THIS.maxAllowedY;
                    } else {
                        point.y = yScaled;
                        point.yCanvas = yCanvas;
                    }
                }
            }
            if ("update" in point){
                point.update();
            }
            THIS.repaintCallback(THIS.mc.ctx);
            evt.preventDefault();
            return false;
        }, 
        mouseup: function(xScaled, yScaled, evt, xCanvas, yCanvas){
            if (THIS.additionalCallback){
                THIS.additionalCallback(xScaled, yScaled, evt, xCanvas, yCanvas, "up");
            }
            var targetIndex = THIS.movingIndex;
            if (targetIndex != -1){
                var point = THIS.pointColl.points[targetIndex];
                if (!THIS.immutableX){
                    point.x = xScaled;
                    point.xCanvas = xCanvas;
                }
                if (!THIS.immutableY){
                    if (yScaled < THIS.minAllowedY){
                        point.y = THIS.minAllowedY;
                    } else {
                        if (yScaled > THIS.maxAllowedY){
                            point.y = THIS.maxAllowedY;
                        } else {
                            point.y = yScaled;
                            point.yCanvas = yCanvas;
                        }
                    }
                }
                point.index = targetIndex;
                if ("update" in point){
                    point.update();
                }
                THIS.repaintCallback(THIS.mc.ctx);
            }
            THIS.movingIndex = -1;
            evt.preventDefault();
            return false;
        },
        mouseover : mouseover
    };
    if ("xMin" in options) mcOptions.xMin = options.xMin;
    if ("xMax" in options) mcOptions.xMax = options.xMax;
    if ("yMin" in options) mcOptions.yMin = options.yMin;
    if ("yMax" in options) mcOptions.yMax = options.yMax;
    var mc = new MouseCanvas(mcOptions);
    for (var i=0; i<pointColl.points.length; i++){
        var point = pointColl.points[i];
        point.xCanvas = mc.xToCanvas(point.x);
        point.yCanvas = mc.yToCanvas(point.y);
    }
    this.mc = mc;
    this.radius = radius;
    this.pointColl = pointColl;
    this.paintPoint = paintPoint;
    this.color = color;
    this.textColor = textColor;
    this.font = font;
    this.movingIndex = -1;
    this.repaintCallback = repaintCallback;
    this.getText = getText;
}
DragDropCanvas.prototype.defaultRadius = 9;
DragDropCanvas.prototype.defaultColor = "#555";
DragDropCanvas.prototype.defaultTextColor = "white";
DragDropCanvas.prototype.defaultFont = "bold 9pt Arial";
DragDropCanvas.prototype.defaultGetText = function(i){
    return "" + i;
}
DragDropCanvas.prototype.repaint = function(){
    for (var i=0; i<this.pointColl.points.length; i++){
        var point = this.pointColl.points[i];
        this.paintPoint(this.mc.ctx, i, point.x, point.y, this.mc.xToCanvas(point.x), this.mc.yToCanvas(point.y));
    }
}
DragDropCanvas.prototype.paintPointDefault = function(ctx, i, x, y, xCanv, yCanv){
    //console.log("i: " + i + " x: " + x + " y: " + y);
    var r = this.radius;
    var color = "blue";
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(xCanv, yCanv, r, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = this.textColor;
    ctx.font = this.font;
    var widthOf4 = ctx.measureText("4").width;
    ctx.textAlign = "center";
    ctx.fillText(this.getText(i), xCanv, yCanv + widthOf4 * 0.55);
}

function fitDataLinear(data){
    /* data[i][0] = xi, data[i][1] = yi
    returns object with fields abjCoe and linCoe, such that the function
    x -> linCoe*x + absCoe is the least squares linear fit to the data
    solution:
    F = (1  1  ... 1 )
        (x1 x2 ... xN)
        
    FT = (1 x1)
         (1 x2)
          ...
         (1 xN)
         
    Y = (y1 ... yN)     
    then
    
    (F FT)^(-1) (F y)
    then
    F FT = (N sx)
           (sx sxx)
           
    F Y = (sy)
          (sxy)
          
    where sx = sum of x
          sy = sum of y
          sxy sum of x*y
          sxx = sum of x*x  
    */
    var sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0, n = data.length;
    for (var i=0; i<n; i++){
        var point = data[i];
        var x = point[0], y = point[1];
        sx += x;
        sy += y;
        sxy += (x*y);
        sxx += (x*x);
        syy += (y*y);
    }
    function sign(x){
        if (x >= 0){
            return 1;
        } else {
            return -1;
        }
    }
    var deter = n*sxx - sx*sx;
    if (deter == 0){
        console.log("warning: zero determinant");
        return null; // maybe better raise error here
    } 
    var absCoe = (sxx * sy - sx * sxy) / deter;
    var linCoe = (-sx * sy +  n * sxy) / deter;
    var xMean = sx/n;
    var yMean = sy/n;
    var xyMean = sxy/n;
    var xxMean = sxx/n;
    var yyMean = syy/n;
    var temp = xyMean - xMean * yMean;
    var rSquaredEnumerator = temp * temp;
    var varianceX = xxMean - xMean * xMean;   // note: NOT the empirical variance, that would give wrong regression coefficient formula
    var varianceY = yyMean - yMean * yMean;
    var rSquaredDenominator = varianceX * varianceY;
    var rSquared = rSquaredEnumerator / rSquaredDenominator;
    var r = Math.sqrt(rSquared) * sign(temp);
    var empFactorSquared = (n-1)/n;
    var empFactor = Math.sqrt(empFactorSquared);
    var stdX = Math.sqrt(varianceX);
    var stdY = Math.sqrt(varianceY);
    var empStdX = empFactor * stdX;
    var empStdY = empFactor * stdY;
    var empVarianceX = empFactorSquared * varianceX;
    var empVarianceY = empFactorSquared * varianceY;
    var standardErrorOfSlope = Math.abs(linCoe * Math.sqrt((1/rSquared-1)/(n-2)));
    var tValueOfStandardErrorOfSlope = linCoe / standardErrorOfSlope;
    return {
        sx: sx,
        sy: sy,
        sxy: sxy,
        sxx: sxx,
        syy: syy,
        xMean:  xMean,
        yMean:  yMean,
        xyMean: xyMean,
        xxMean: xxMean,
        yyMean: yyMean,
        varianceX: varianceX,
        varianceY: varianceY,
        empVarianceX: empVarianceX,
        empVarianceY: empVarianceY,
        stdX: stdX,
        stdY: stdY,
        empStdX: empStdX,
        empStdY: empStdY,
        rSquared: rSquared,
        r: r,
        determinant: deter,
        absCoe : absCoe,
        linCoe : linCoe,
        standardErrorOfSlope: standardErrorOfSlope,
        tValueOfStandardErrorOfSlope: tValueOfStandardErrorOfSlope
    };
}


function repeatString(str, times){
    var result = "";
    for (var i=0; i<times; i++){
        result = result + str;
    }
    return result;
}
function americanNumberFormat(numStr){
    var beforeDecimalPoint, afterDecimalPoint;
    if (numStr.indexOf(".") == -1){
        beforeDecimalPoint = numStr;
        afterDecimalPoint = "";
    } else {
        var temp = numStr.split(".");
        if (temp.length != 2){
            console.log("bad number format: more than one decimal point!");
        }
        beforeDecimalPoint = temp[0];
        afterDecimalPoint = "." + temp[1];
    }
    var sections = [];
    var end = beforeDecimalPoint.length;
    var start = end - 3;
    while (start >= -2){
        var start1 = Math.max(0, start);
        sections.push(beforeDecimalPoint.slice(start1, end));
        end -= 3;
        start -= 3;
    }
    var comma = "";
    var result = "";
    for (var sectionIndex = sections.length-1; sectionIndex>=0; sectionIndex--){
        result += comma;
        result += sections[sectionIndex];
        comma = ",";
    }
    return result + afterDecimalPoint;
}
