// studentPDF.js
// written by Thomas "mathheadinclouds" Kloecker
// THIS CODE IS PUBLIC DOMAIN. YOU DO NOT "OWN" IT IN ANY WAY, YOU MAY USE IT IN ANY AND EVERY WAY.
// PLEASE REFRAIN FROM REMOVING THIS NOTICE
function StudentPDF(size){
    var factors = new Array(size + 1);
    factors[0] = null;
    factors[1] = 1/Math.PI;
    factors[2] = 1/2;
    for (var i=3; i<=size; i++){
        factors[i] = (i-1)/(i-2) * factors[i-2];
    }
    for (var i=1; i<=size; i++){
        factors[i] /= Math.sqrt(i);
    }
    this.factors = factors;
}
StudentPDF.prototype.getPDF = function(degreesOfFreedom){
    var factor = this.factors[degreesOfFreedom];
    var exponent = -0.5*(degreesOfFreedom + 1)
    return function(x){
        return factor * Math.pow(1 + x*x/degreesOfFreedom, exponent);
    }
}
function Gamma(size){
    // g[n] = gamma[n/2] = (n/2-1)*gamma[n/2-1] = (n/2-1)*gamma[(n-2)/2] =(n/2-1)*g[n-2] 
    var g = new Array(size+1);
    g[0] = null;
    g[1] = Math.sqrt(Math.PI);
    g[2] = 1;
    for (var n=3; n<=size; n++){
        g[n] = (n/2-1) * g[n-2]; 
    }
    this.g = g;
}
Gamma.prototype.gammaOfHalfArg = function(n){
    return this.g[n];
}
function LogGamma(size){
    // g[n] = log( gamma[n/2] = (n/2-1)*gamma[n/2-1] = (n/2-1)*gamma[(n-2)/2] =(n/2-1)*g[n-2] ) 
    var g = new Array(size+1);
    g[0] = null;
    g[1] = Math.log(Math.sqrt(Math.PI));
    g[2] = 0;
    for (var n=3; n<=size; n++){
        g[n] = Math.log((n/2-1)) + g[n-2]; 
    }
    this.g = g;
}
LogGamma.prototype.logGammaOfHalfArg = function(n){
    return this.g[n];
}

function Fpdf(size){
    this.g = (new Gamma(size)).g;
}

Fpdf.prototype.getPDF = function(d1, d2){
    var d12 = d1 / d2;
    var factor = (this.g[d1 + d2]) / (this.g[d1] * this.g[d2]) * Math.pow(d12, d1/2);
    var expo1 = d1/2 - 1;
    var expo2 = -(d1 + d2)/2;
    return function(x){
        return factor * Math.pow(x, expo1) * Math.pow(1 + d12 * x, expo2);
    } 
}
function hyperGeometric1F1(a, b, x){
    var terms = [];
    var term = 1;
    var k = 1;
    var aa = a;
    var bb = b;
    while (true){
        terms.push(term);
        if (k >= 5 && (term < 1e-25 || k >= 300)){
            break;
        }
        term *= ((aa*x)/(k*bb));
        k++;
        aa += 1;
        bb += 1;
    }
    var result = 0;
    for (var i=terms.length-1; i>=0; i--){
        result += terms[i];
    }
    return result;
}
/*
function noncentralStudentPDF0(x, df, noncent, gammahelper){
    // code not adapted to deal with big df (overflow errors), but simpler
    var vx2 = df + x*x;
    var halfDf = df/2;
    var v1 = 0.5 * (df + 1);
    var v2 = halfDf + 1;
    var mu2 = noncent * noncent;
    var k = mu2 * x * x * 0.5 / vx2;
    var gammaV1 = gammahelper.gammaOfHalfArg(df + 1);
    var gammaV2 = gammahelper.gammaOfHalfArg(df + 2);
    var factorial = gammahelper.gammaOfHalfArg(2*df+2);
    var gammaHalfDf = gammahelper.gammaOfHalfArg(df);
    var factor = Math.pow(df, halfDf) * factorial * Math.exp(-mu2/2) * Math.pow(2, -df) * Math.pow(vx2, -halfDf) / gammaHalfDf;
    var term1 = Math.sqrt(2) * noncent * x * hyperGeometric1F1(v2, 1.5, k) / (vx2 * gammaV1);
    var term2 = hyperGeometric1F1(v1, 0.5, k) / (Math.sqrt(vx2) * gammaV2);
    return factor * (term1 + term2);
}


function noncentralStudentPDF1(x, df, noncent, gammahelper){
    var vx2 = df + x*x;
    var halfDf = df/2;
    var v1 = 0.5 * (df + 1);
    var v2 = halfDf + 1;
    var mu2 = noncent * noncent;
    var k = mu2 * x * x * 0.5 / vx2;
    var gammaV1 = gammahelper.gammaOfHalfArg(df + 1);
    var gammaV2 = gammahelper.gammaOfHalfArg(df + 2);
    var factorial = gammahelper.gammaOfHalfArg(2*df+2);
    var gammaHalfDf = gammahelper.gammaOfHalfArg(df);
    //var factor = Math.pow(df, halfDf) * factorial * Math.exp(-mu2/2) * Math.pow(2, -df) * Math.pow(vx2, -halfDf) / gammaHalfDf;
    var logDf = Math.log(df);
    var logVx2 = Math.log(vx2);
    var logFactor = halfDf * logDf + Math.log(factorial) - mu2/2 - df*Math.LN2 -halfDf * logVx2 - Math.log(gammaHalfDf);
    var factor = Math.exp(logFactor);
    var term1 = Math.sqrt(2) * noncent * x * hyperGeometric1F1(v2, 1.5, k) / (vx2 * gammaV1);
    var term2 = hyperGeometric1F1(v1, 0.5, k) / (Math.sqrt(vx2) * gammaV2);
    return factor * (term1 + term2);
}
*/


function noncentralStudentPDF(x, df, noncent, logGammaHelper){
    if (arguments.length < 4){
        logGammaHelper = new LogGamma(2*df + 10);
    }
    var vx2 = df + x*x;
    var halfDf = df/2;
    var v1 = 0.5 * (df + 1);
    var v2 = halfDf + 1;
    var mu2 = noncent * noncent;
    var k = mu2 * x * x * 0.5 / vx2;
    var logGammaV1 = logGammaHelper.logGammaOfHalfArg(df + 1);
    var logGammaV2 = logGammaHelper.logGammaOfHalfArg(df + 2);
    var logFactorial = logGammaHelper.logGammaOfHalfArg(2*df+2);
    var logGammaHalfDf = logGammaHelper.logGammaOfHalfArg(df);
    var logDf = Math.log(df);
    var logVx2 = Math.log(vx2);
    var logFactor = halfDf * logDf + logFactorial - mu2/2 - df*Math.LN2 -halfDf * logVx2 - logGammaHalfDf - logGammaV1;
    var factor = Math.exp(logFactor);
    var term1 = Math.sqrt(2) * noncent * x * hyperGeometric1F1(v2, 1.5, k) / vx2;
    var term2 = hyperGeometric1F1(v1, 0.5, k) * Math.exp(logGammaV1 - logGammaV2) / Math.sqrt(vx2);
    var result = factor * (term1 + term2);
    if ( isNaN(result) ) {
        //debugger;
        $("#debug1").html("number overflow, please use less excessive difference of means and/greater standard deviation and/or smaller sample size");
    } else {
        $("#debug1").html("");
    }
    return result;
}
var NonCentralTdefaults = {
    epsilon: 0.000025,
    maxStepSize: 0.2,
    minTrapezoidArea: 0.0000001,
    maxSteps: 15000,
    minSteps: 10
};
function noncentralStudentCDFleft(x, df, noncent, logGammaHelper, options){
    // compute intergral of noncentralStudentPdf with df degrees of freedom and noncentrality parameter noncent,
    // from -Infinity to x
    // logGammaHelper: wrapped lookup table for logs of gamma values of arguments which are multiples of 1/2
    // epsilon: approximate area of trapezoids being summed up
    // maxStep: maximum width of trapezoids
    // minTrapezoidArea: if we go below, abort further computation
    // maxSteps: maximum number of trapezoids being summed up, in order to avoid excessive computation time, giving possible inaccurate results, in which case warning will be displayed
    // minSteps: minimum number of trapezoids being summed up.
    if (!options){
        options = {};
    }
    var minSteps = "minSteps" in options ? options.minSteps : NonCentralTdefaults.minSteps;
    var maxSteps = "maxSteps" in options ? options.maxSteps : NonCentralTdefaults.maxSteps;
    var minTrapezoidArea = "minTrapezoidArea" in options ? options.minTrapezoidArea : NonCentralTdefaults.minTrapezoidArea;
    var maxStepSize = "maxStepSize" in options ? options.maxStepSize : NonCentralTdefaults.maxStepSize;
    var epsilon = "epsilon" in options ? options.epsilon : NonCentralTdefaults.epsilon;
    if (x > noncent){
        return 1 - noncentralStudentCDFright(x, df, noncent, logGammaHelper, options);
    }
    var counter = 0;
    var pRight = noncentralStudentPDF(x, df, noncent, logGammaHelper);
    var step = Math.min(Math.abs(epsilon/pRight), maxStepSize);
    var terms = [];
    while (true){
        counter++;
        x -= step;
        var pLeft = noncentralStudentPDF(x, df, noncent, logGammaHelper);
        terms.push(step * 0.5 * (pLeft + pRight));
        if ((terms[terms.length-1] < minTrapezoidArea || counter >= maxSteps) && counter >= minSteps){
            if (counter >= maxSteps){
                console.log("warning: results might lack accuracy, stopping due to excessive computation length");
            }
            break;
        }
        pRight = pLeft;
        //console.log("counter= " + counter + " pLeft = " + pLeft + "step = " + step);
        step = Math.min(Math.abs(epsilon/pLeft), maxStepSize);
    }
    var result = 0;
    //console.log("steps needed: " + terms.length);
    for (var i=terms.length-1; i>=0; i--){
        result += terms[i];
    }
    return result;
}

function noncentralStudentCDFright(x, df, noncent, logGammaHelper, options){
    // compute intergral of noncentralStudentPdf with df degrees of freedom and noncentrality parameter noncent,
    // from x to infinity
    if (!options){
        options = {};
    }
    var minSteps = "minSteps" in options ? options.minSteps : NonCentralTdefaults.minSteps;
    var maxSteps = "maxSteps" in options ? options.maxSteps : NonCentralTdefaults.maxSteps;
    var minTrapezoidArea = "minTrapezoidArea" in options ? options.minTrapezoidArea : NonCentralTdefaults.minTrapezoidArea;
    var maxStepSize = "maxStepSize" in options ? options.maxStepSize : NonCentralTdefaults.maxStepSize;
    var epsilon = "epsilon" in options ? options.epsilon : NonCentralTdefaults.epsilon;
    if (x < noncent){
        return 1 - noncentralStudentCDFleft(x, df, noncent, logGammaHelper, options);
    }
    var counter = 0;
    var pLeft = noncentralStudentPDF(x, df, noncent, logGammaHelper);
    var step = Math.min(Math.abs(epsilon/pLeft), maxStepSize);
    var terms = [];
    while (true){
        counter++;
        x += step;
        var pRight = noncentralStudentPDF(x, df, noncent, logGammaHelper);
        terms.push(step * 0.5 * (pLeft + pRight));
        if ((terms[terms.length-1] < minTrapezoidArea || counter >= maxSteps) && counter >= minSteps){
            if (counter >= maxSteps){
                console.log("warning: results might lack accuracy, stopping due to excessive computation length");
            }
            break;
        }
        pLeft = pRight;
        //console.log("counter= " + counter + " pLeft = " + pLeft + "step = " + step);
        step = Math.min(Math.abs(epsilon/pRight), maxStepSize);
    }
    var result = 0;
    //console.log("steps needed: " + terms.length);
    for (var i=terms.length-1; i>=0; i--){
        result += terms[i];
    }
    return result;
}




