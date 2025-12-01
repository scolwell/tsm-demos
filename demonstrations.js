// demonstrations.js
var H = HtmlGen;
/* used to make selector triangle for select box
FOO = {
    run: function(){
        w = 8;
        h = w/2;
        ch  = H.canvas({width: w, height: h, id: "c"});
        gUniverseElt.html(ch);
        ctx = $("#c")[0].getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(w,0);
        ctx.lineTo(h,h);
        ctx.lineTo(0,0);
        ctx.fillStyle = "black";
        ctx.fill();
    }
};
*/
//var Empty = { run: function(){ gUniverseElt.html(""); } };
var GaltonBoard = {
    run: function(){
        gUniverseElt.html(
            H.iframe({
                src: "galton3/galton3.html",
                width: "100%",
                height: "1000px",
                seamless: "seamless",
                frameborder: 0
            })
        );
    }
}

/*******************************************************************************************************
 Figure411 (proportion of heads)
*******************************************************************************************************/
var Figure411 = {
    canvasWidth : 700,
    canvasHeight : 450,
    canvasId : "theCanvas",
    canvasElt : null,
    ctx : null,
    sliderTableId : "sliderTable",
    sliderTableElt : null,
    tossSliderId: "tossSlider",
    tossSlider: null,
    probSliderId: "probSlider",
    probSlider: null,
    tryAgainBtnId: "tryAgainBtn",
    resetTo50BtnId: "resetTo50Btn",
    tryAgainBtn: null,
    resetTo50Btn: null,
    info1Elt: null,
    info2Elt: null,
    eventz: null,
    numTosses: 300,
    canvasPlot: null,
    makeSlider: function(){
        this.tossSlider = new Slider({min: 1, max: this.numTosses, value: 1, step: 1, id: this.tossSliderId, callback: Figure411.callback});
        this.probSlider = new Slider({min: 0, max: 1, value: 0.5, step: 0.001, id: this.probSliderId, callback: Figure411.callback});
        var tryAgain = HtmlGen.btn("Try&nbsp;Again", {id: this.tryAgainBtnId});
        var reset50 = HtmlGen.btn("Reset&nbsp;to&nbsp;50%", {id: this.resetTo50BtnId});
        function sliderRow(label, sliderDiv, btn){
            return HtmlGen.tr(
                HtmlGen.td(HtmlGen.span(label, {"class": "sliderLabel lineBreakDisabled"})) +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.td(sliderDiv, {"class": "fullWidth"}) +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.td(btn)
            );
        }
        return HtmlGen.table(
            sliderRow("Move Slider to Toss the Coin", this.tossSlider.html, tryAgain) +
            sliderRow("Move Slider to Set P(Heads)", this.probSlider.html, reset50)
            , {"class": "fullWidth", id: this.sliderTableId}
        );
    },
    run: function(){
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var canvasId = this.canvasId;
        var canvHtml = HtmlGen.canvas({width: canvasWidth, height: canvasHeight, id: canvasId});
        var emptyTd = HtmlGen.td("&nbsp;");
        var info1 = HtmlGen.td("", {id: "info1", "class": "info"});
        var info2 = HtmlGen.td("", {id: "info2", "class": "info"});
        var sliderHtml = this.makeSlider();
        gUniverseElt.html(HtmlGen.table(
            HtmlGen.trtd(sliderHtml) +
            HtmlGen.tr(emptyTd) +
            HtmlGen.tr(info1) +
            HtmlGen.tr(info2) +
            HtmlGen.trtd(canvHtml)
        ));
        this.canvasElt = $("#" + canvasId); 
        this.ctx = this.canvasElt[0].getContext('2d');
        if (!this.ctx){
            alert('you have to use a newer browser to view this page');
            return;
        }
        //
        this.tossSlider.init();
        this.probSlider.init();
        this.sliderTableElt = $("#" + this.sliderTableId);
        this.tossSlider.adjustTableCss(this.sliderTableElt);
        this.info1Elt = $("#info1");
        this.info2Elt = $("#info2");
        this.tryAgainBtn = $("#" + this.tryAgainBtnId);
        this.resetTo50Btn = $("#" + this.resetTo50BtnId);
        this.tryAgainBtn.click(this.tryAgain);
        this.resetTo50Btn.click(this.resetTo50);
        this.tryAgainBtn.width(this.resetTo50Btn.width());
        this.tossit();
        this.makeGraphics();
    },
    tossit: function(){
        this.eventz = UTIL.table(this.numTosses, function(){ return Math.random()});
    },
    tryAgain: function(){
        Figure411.tossit();
        Figure411.tossSlider.set(1);
        Figure411.makeGraphics();
    },
    resetTo50: function(){
        Figure411.probSlider.set(0.5);
        Figure411.makeGraphics();
    },
    callback: function(){
        Figure411.makeGraphics();
    },
    calcProportions: function(headsProb){
        var headCount = 0;
        var result = [undefined];
        for (var i=0; i<this.eventz.length; i++){
            if (this.eventz[i] < headsProb){
                headCount++;
            }
            result.push(headCount / (i+1));
        }
        return result;
    },
    makeGraphics: function(){
        var numShownTosses = this.tossSlider.get();
        var headsProb = this.probSlider.get();
        var propsArr = this.calcProportions(headsProb);
        this.info1Elt.html("You Set the P(Heads) at: %5.1f".sprintf(100*headsProb) + "%");
        this.info2Elt.html("Proportion Landing Heads After %d Tosses is %6.2f".sprintf(numShownTosses, 100*propsArr[numShownTosses]) + "%");
        CANVAS.erase(this.ctx);
        var xMax = this.numTosses*1.02;
        var xMin = this.numTosses*(-0.125);
        var yMin = -0.1;
        var yMax = 1.02;
        CANVAS.xyAxis(this.ctx,
            { min: xMin, axisMin: 0, max: xMax, axisMax: this.numTosses, axisLabel: "Number of Coin Tosses" },
            { min: yMin, axisMin: 0, max: yMax, axisMax: 1, axisLabel: "Proportion Landing Heads" }
        );
        var plotOptions = {
            xMin: xMin, xMinPlot: 1, xMax: xMax, xMaxPlot: numShownTosses,
            yMin: yMin, yMinPlot: 0, yMax: yMax, yMaxPlot: 1,
            step: 1, color: "blue"
        };
        this.canvasPlot = new CanvasPlot(this.ctx, function(index){ return propsArr[Math.round(index)]}, plotOptions);
        this.canvasPlot.plot();
        // draw dotted line
        var x0 = this.canvasPlot.xTrafo(0);
        var x1 = this.canvasPlot.xTrafo(numShownTosses);
        x1 = this.ctx.canvas.width;
        var y = this.canvasPlot.yTrafo(headsProb);
        this.ctx.strokeStyle = "red";
        CANVAS.dashedLine(this.ctx, x0, y, x1, y, [3,3]);
    }
}
/*******************************************************************************************************
 Figure29 (Birthday Problem)
*******************************************************************************************************/
var Figure29 = {
    canvasWidth : 700,
    canvasHeight : 450,
    canvasId : "theCanvas",
    canvasElt : null,
    ctx : null,
    numPeopleSliderId : "numPeopleSlider",
    numPeopleSlider : null,
    sliderTableId : "sliderTable",
    sliderTableElt : null,
    peopleCounterElt : null,
    info1Elt: null,
    info2Elt: null,
    canvasPlot: null,
    callback1: function(value){
        Figure29.callback(value);
    },
    calcBirthdayProb: function(k){
        return 1 - UTIL.range(365 - k + 1, 365).timesConst(1/365).product();
    },
    calcBrithdayProbPercent: function(k){
        return 100 * this.calcBirthdayProb(k);
    },
    calcBrithdayProbPercent1: function(k){
        return Figure29.calcBrithdayProbPercent(k);
    },
    callback: function(value){
        this.peopleCounterElt.text(value);
        var txt1;
        if (value == 2){
            txt1 = "Probability that 2 Randomly Chosen People";
        } else {
            txt1 = H.table00(H.tr(
                H.td("Probability of at Least 2 of the") +
                H.tdCenter(value, {style: "min-width: 32px", id: "numPeopleChosen"}) +
                H.td("People Chosen")
            ), {id: "firstRowFigureHeading", align: "center"})
            //txt1 = "Probability of at Least 2 of the " + (value < 10 ? "&nbsp;&nbsp;": "") + value + " People Chosen";
        }
        var format = "%9.5f";
        var percent = 100 * this.calcBirthdayProb(value);
        var formattedProb = format.sprintf(percent).trim() + "%";
        var txt2a = (value == 2 ? "Share" : "Sharing") + " the Same Birthday =";
        var txt2 = H.table00(H.tr(
            H.td(txt2a) +
            H.tdRight(formattedProb, {style: "min-width: 85px", id: "probability"})
        ), {id: "secondRowFigureHeading", align: "center"});
        this.info1Elt.html(txt1);
        this.info2Elt.html(txt2);
        this.updateGraphics(value);
    },
    updateGraphics: function(x){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var xMin = -13, xMax = 102;
        var yMin = -10, yMax = 102;
        CANVAS.xyAxis(ctx,
            { min: xMin, axisMin: 0, max: xMax, axisMax: 100, axisLabel: "Number of People" },
            { min: yMin, axisMin: 0, max: yMax, axisMax: 100, axisLabel: "Probability of a Match (%)" }
        );
        var plotOptions = {
            xMin: xMin, xMinPlot: 0, xMax: xMax, xMaxPlot: 100,
            yMin: yMin, yMinPlot: 0, yMax: yMax, yMaxPlot: 100,
            step: 1, color: "blue"
        };
        this.canvasPlot = new CanvasPlot(ctx, this.calcBrithdayProbPercent1, plotOptions);
        this.canvasPlot.plot();
        var showPointOptions = {
            radius: 4
        };
        this.canvasPlot.showPoint(x, showPointOptions);
    },
    makeSlider: function(){
        this.numPeopleSlider = new Slider({min: 2, max: 100, value: 3, step: 1, id: this.numPeopleSliderId, callback: this.callback1});
        function sliderRow(label, sliderDiv){
            return HtmlGen.tr(
                HtmlGen.td(HtmlGen.span(label, {"class": "sliderLabel lineBreakDisabled"})) +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.td(sliderDiv, {"class": "fullWidth"}) +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.tdRight("", {id: "peopleCounter", style: "min-width: 25px"})
            );
        }
        return HtmlGen.table(
            sliderRow('Number of people chosen at random (<span style="font-style: italic;">n</span>)', this.numPeopleSlider.html)
            , {"class": "fullWidth", id: this.sliderTableId}
        );
    },
    run: function(){
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var canvasId = this.canvasId;
        var canvHtml = HtmlGen.canvas({width: canvasWidth, height: canvasHeight, id: canvasId});
        var emptyTd = HtmlGen.td("&nbsp;");
        var info1 = HtmlGen.td("", {id: "info1", "class": "info"});
        var info2 = HtmlGen.td("", {id: "info2", "class": "info"});
        var sliderHtml = this.makeSlider();
        gUniverseElt.html(HtmlGen.table(
            HtmlGen.trtd(sliderHtml) +
            HtmlGen.tr(emptyTd) +
            HtmlGen.tr(info1) +
            HtmlGen.tr(info2) +
            HtmlGen.trtd(canvHtml)
        ));
        this.canvasElt = $("#" + canvasId); 
        this.ctx = this.canvasElt[0].getContext('2d');
        if (!this.ctx){
            alert('you have to use a newer browser to view this page');
            return;
        }
        //
        this.numPeopleSlider.init();
        this.sliderTableElt = $("#" + this.sliderTableId);
        this.numPeopleSlider.adjustTableCss(this.sliderTableElt);
        this.info1Elt = $("#info1");
        this.info2Elt = $("#info2");
        this.peopleCounterElt = $("#peopleCounter");
        this.callback(2);
    }    
};
/*******************************************************************************************************
Lottery Simulation
*******************************************************************************************************/
var Lottery = {
    config : {
        howManyDrawsChoices : [1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000],
        jackpotText: ["$1 million", "$5 million", "$10 million"],
        jackpotValues: [1000000, 5000000, 10000000],
        pricePerTicket: 2,
        match3win: 10,
        match4winJackpotPortion: 0.09,
        match5winJackpotPortion: 0.0575,
        match6winJackpotPortion: 0.805,
        match4numWinners: 8500,
        match5numWinners: 150,
        match6numWinners: 1
    },
    topElt : null,
    bottomElt : null,
    containerId : "LotterySimulation",
    contaierElt : null,
    randomlyBtnId : "randomDrawBtn",
    randomDrawBtn : null,
    selectTableId : "numberSelectorTable",
    selectTableClass : "numberSelectorTable",
    selectTable : null,
    eitherId : "either",
    orManuallyId : "orManually",
    allNumbers : UTIL.range(1, 49),
    selectTableEntries : UTIL.table(49, function(i){ return (i+1) + "&nbsp;&nbsp;" }),
    pickedNumbers : null,
    howManyDrawsSelId : "howManySel",
    howManyDrawsSelElt : null,
    jackpotSelId : "jackpotSel",
    jackpotSelElt : null,
    playBtnId : "playButton",
    playBtnElt : null,
    resetBtnId : "resetButton",
    resetBtnElt : null,
    yourNumbersTableId : "yourNumbersTable",
    yourTable : null,
    lastDrawnTableId : "lastDrawnTable",
    lastDrawnTable : null,
    resultsId : "results",
    resultsElt : null,
    simulator : null,
    cssId: "lotteryStyles",
    myBlue: "#00a",
    myRed: "#a00",
    pickerCallback: function(index, value, selectedIndex, evt, domElt){
        //console.log("index: " + index + " value: " + value + " selInd " + selectedIndex);
        // index = which numberPicker it is (numbering starting at 0)
        // value = picked number
        // selectedIndex = one less than number (not really important here)
        // evt = original event from mouse click on select element
        // domElt = the select element 
        // this = SelectTable from htmlGeneratorTools.js
        // this.app = Lottery
        var pickedNumber = selectedIndex + 1;
        this.app.yourTable.set(index, pickedNumber);
    },
    run: function(){
        var myBlue = this.myBlue;
        var myRed = this.myRed;
        var bigFont = "20px";
        var biggerFont = "22px";
        var smallFont = "12px";
        var boxHpad = "8px";
        var boxVpad = "6px";
        this.cssRules = [
            ["#LotterySimulation", {border: "1px solid black"}],
            [".blue", {color: myBlue, "font-size" : bigFont, "font-weight": "bold", "margin-left": "7px"}],
            [".redHeading", {color: myRed, "font-size": biggerFont, "font-weight": "bold", "text-align": "center"}],
            [".box", {border: "4px solid #444", "padding-top": boxVpad, "padding-bottom": boxVpad, "padding-left": boxHpad, "padding-right": boxHpad}],
            ["table.numbersTable td", {padding: "6px"}],
            [".resultsMainBody", {"margin-left": "15px"}],
            ["table.botTable", {"margin-left": "7px"}],
            [".male5", {"margin-left": 5}],
            [".smallText", {"font-size": smallFont}],
            ["#LotterySimulation li", {"font-weight": "bold", "padding": "10px 0px"}],
            ["#LotterySimulation table#numberSelectorTable td", {"min-width": "58px"}],
            ["#LotterySimulation #playButton", {"min-width": "200px", "margin-left": "6px"}],
            ["#LotterySimulation #resetButton", {"min-width": "70px", "margin-left": "12px"}]
            
        ];
        this.factory = new cssFactory(this);
        this.factory.produce();
        var containerId = this.containerId;
        var config = this.config;
        var howManyDrawsSelId = this.howManyDrawsSelId;
        var jackpotSelId = this.jackpotSelId;
        var playBtnId = this.playBtnId;
        var resetBtnId = this.resetBtnId;
        var resultsId = this.resultsId;
        var top = HtmlGen.div("", {id: "top"});
        var bottom = HtmlGen.div("", {id: "bottom"});
        var hr = "<hr />";
        gUniverseElt.html(HtmlGen.table(HtmlGen.trtd(top + hr + bottom), {id: containerId}));
        topElt = $("#top");
        bottomElt = $("#bottom");
        this.topElt = topElt; this.bottomElt = bottomElt;
        var randomlyBtnId = this.randomlyBtnId; var eitherId = this.eitherId;
        // top portion
        var heading1 = HtmlGen.span("Choose six different numbers (1 to 49)");
        var either = HtmlGen.table(HtmlGen.tr(
            HtmlGen.td(H.span("Either: ", {style: "font-weight: normal;"})) +
            HtmlGen.td(HtmlGen.btn("Randomly", {id : randomlyBtnId}))
        ), {id: eitherId, style: "margin-top: 9px;" });
        var selectTable = new HtmlGen.SelectTable(6, this.selectTableEntries, this.selectTableId, this.pickerCallback, this, this.selectTableClass, true, true);
        var orManually = HtmlGen.table(HtmlGen.tr(
            HtmlGen.td(H.span("Or&nbsp;manually:&nbsp;", {style: "font-weight: normal;"})) +
            HtmlGen.td(selectTable.html)
        ), {id: this.orManuallyId});
        this.selectTable = selectTable;
        var li1 = HtmlGen.li(heading1 + either + orManually);
        var heading2 = HtmlGen.span("Choose how many draws to play at once:&nbsp;&nbsp; ");
        var howMany = HtmlGen.select(config.howManyDrawsChoices, {id: howManyDrawsSelId});
        var li2 = HtmlGen.li(heading2 + howMany, {"class": "mato7"});
        var heading3 = HtmlGen.span("Choose the estimated jackpot:&nbsp;&nbsp; ");
        var jackpot = HtmlGen.select(config.jackpotText, {id: jackpotSelId});
        var li3 = HtmlGen.li(heading3 + jackpot, {"class": "mato7"});
        var heading4 = HtmlGen.span("Play the lottery:&nbsp;");
        var playBtn = HtmlGen.btn("", {id: playBtnId});
        var resetBtn = HtmlGen.btn("reset", {id: resetBtnId});
        var li4 = HtmlGen.li(heading4 + playBtn + resetBtn, {"class": "mato7"});
        var totalHeading = HtmlGen.div("Lottery Simulation", {"class": "redHeading"});
        var ol = HtmlGen.ol(li1 + li2 + li3 + li4);
        topElt.html(totalHeading + ol);
        // bottom portion
        var yourHeading = HtmlGen.div("Your numbers are:", {"class": "blue"});
        var yourTable = new this.NumberTable(this.yourNumbersTableId);
        this.yourTable = yourTable;
        var bot1 = HtmlGen.table(
            HtmlGen.trtd(yourHeading) +
            HtmlGen.trtd(yourTable.makeHtml())
            , {"class": "botTable"}
        );
        var lastHeading = HtmlGen.div("Last numbers drawn were:", {"class": "blue"});
        var lastDrawnTable = new this.NumberTable(this.lastDrawnTableId);
        this.lastDrawnTable = lastDrawnTable;
        var bot2 = HtmlGen.table(
            HtmlGen.trtd(lastHeading) +
            HtmlGen.trtd(lastDrawnTable.makeHtml())
            , {"class": "botTable"}
        );
        var results = HtmlGen.div("", {id: resultsId});
        bottomElt.html(bot1 + bot2 + results);
        // hookup, top
        this.randomDrawBtn = $("#" + randomlyBtnId);
        this.randomDrawBtn.click(this.randomDrawButtonClick1);
        selectTable.init();
        var pickers = selectTable.elt.find("select");
        for (var i=0; i<pickers.length; i++){
            var picker = $(pickers[i]);
            //picker.change(this.makeNumberPickerHandler(i));
        }
        howManyDrawsSelElt = $("#" + howManyDrawsSelId); this.howManyDrawsSelElt = howManyDrawsSelElt;
        jackpotSelElt = $("#" + jackpotSelId); this.jackpotSelElt = jackpotSelElt;
        playBtnElt = $("#" + playBtnId); this.playBtnElt = playBtnElt;
        resetBtnElt = $("#" + resetBtnId); this.resetBtnElt = resetBtnElt;
        playBtnElt.click(this.playBtnClick1);
        resetBtnElt.click(this.resetBtnClick1);
        howManyDrawsSelElt.change(this.numDrawsChange1);
        this.updatePlayButtonLabel();
        //hoopup, bottom
        yourTable.init();
        lastDrawnTable.init();
        this.resultsElt = $("#" + resultsId);
        this.simulator = new this.Simulator();
        $("#LotterySimulation select").customSelect();
    },
    makeNumberPickerHandler: function(i){
        return function(){
            var elt = $(this)
            var si = elt[0].selectedIndex;
            var pickedNumber = si + 1;
            Lottery.yourTable.set(i, pickedNumber);
        }
    },
    updatePlayButtonLabel: function(){
        this.playBtnElt.text("Play " + this.getNumDraws() + " Draws");
    },
    randomDrawButtonClick1: function (){
        Lottery.randomDrawButtonClick();
    },
    checkPlayerNumbersLegal: function (){
        var numbers = this.selectTable.getSelectedIndices().plusConst(-1);
        for (var i=0; i<numbers.length; i++){
            if (numbers[i] == undefined){
                return false;
            }
        }
        var sorted = numbers.sortASC();
        for (var i=0; i<numbers.length-1; i++){
            if (numbers[i] == numbers[i+1]){
                return false;
            }
        }
        this.simulator.sortedPlayerNumbers = sorted;
        return true;
    },
    getNumDraws: function (){
        var si = this.howManyDrawsSelElt[0].selectedIndex;
        return this.config.howManyDrawsChoices[si];
    },
    getJackpot: function(){
        var si = this.jackpotSelElt[0].selectedIndex;
        return this.config.jackpotValues[si];
    },
    randomDrawButtonClick: function (){
        var randomPick = pickRandomlyWithoutRepetition(this.allNumbers, 6);
        //this.selectTable.setByValue(this.selectTableEntries.pick(randomPick.plusConst(-1)));
        this.selectTable.setByIndices(randomPick.plusConst(-1));
        this.pickedNumbers = randomPick;
        this.yourTable.setAll(randomPick);
    },
    playBtnClick1: function(){
        Lottery.playBtnClick();
    },
    playBtnClick: function(){
        var legal = this.checkPlayerNumbersLegal();
        if (!legal){
            alert("please select 6 different numbers");
            return;
        }
        this.simulator.action(this.getNumDraws());
    },
    resetBtnClick1: function(){
        Lottery.resetBtnClick();
    },
    resetBtnClick: function(){
        this.simulator = new this.Simulator();
        this.selectTable.reset();
        this.howManyDrawsSelElt[0].selectedIndex = 0;
        this.jackpotSelElt[0].selectedIndex = 0;
        this.yourTable.setEmpty();
        this.lastDrawnTable.setEmpty();
        this.updatePlayButtonLabel();
        this.selectTable.setAllNonChosen();
        this.run();
    },
    numDrawsChange1: function(){
        Lottery.numDrawsChange();
    },
    numDrawsChange: function(){
        this.updatePlayButtonLabel();
    }
};

Lottery.NumberTable = function(id){
    this.id = id;
}
Lottery.NumberTable.prototype.makeHtml = function(){
    var id = this.id;
    return HtmlGen.table(HtmlGen.tr(
        UTIL.range(1,6).map(function(index){ return HtmlGen.td(HtmlGen.div("&nbsp;&nbsp;&nbsp;", {id: id + index, "class": "box"}))}).join("")
    ), {id: id, "class": "numbersTable"});
}
Lottery.NumberTable.prototype.init = function(){
    this.elt = $("#" + this.id);
    this.elts = new Array(6);
    for (var i=0; i<6; i++){
        this.elts[i] = $(this.elt.find(".box")[i]);
    }
}
Lottery.NumberTable.prototype.set = function(index, value){
    this.elts[index].html(value);
}
Lottery.NumberTable.prototype.setAll = function(values){
    for (var i=0; i<values.length; i++){
        this.set(i, values[i]);
    }
}
Lottery.NumberTable.prototype.setEmpty = function(){
    for (var i=0; i<this.elts.length; i++){
        this.set(i, "&nbsp;&nbsp;&nbsp;");
    }
}
Lottery.Simulator = function(){
    this.resultsContainer = Lottery.resultsElt;
    this.resultsContainer.html("");
    this.totalDraws = 0;
    this.successDraws = 0;
    this.matchCounts = UTIL.zeros(7);
    this.totalSpent = 0;
    this.totalWinnings = 0;
    this.lastDrawn = null;
    this.lastDrawnSorted = null;
    this.sortedPlayerNumbers = null;  // sorted array of numbers picked by user
}
Lottery.Simulator.prototype.generate1Draw = function(){
    var randomPick = pickRandomlyWithoutRepetition(Lottery.allNumbers, 6);
    this.lastDrawn = randomPick;
    this.lastDrawnSorted = randomPick.concat([]).sortASC();
}
Lottery.Simulator.prototype.showLastDrawn = function(){
    Lottery.lastDrawnTable.setAll(this.lastDrawn);
}
Lottery.Simulator.prototype.action = function(numDraws){
    var jackpot = Lottery.getJackpot();
    for (var drawCounter = 1; drawCounter <= numDraws; drawCounter++){
        this.generate1Draw();
        var numHits = intersectSortedArrays(this.lastDrawnSorted, this.sortedPlayerNumbers).length;
        this.matchCounts[numHits]++;
        this.totalDraws++;
        if (numHits >= 1){
            this.successDraws++;
        }
        var winnings;
        switch (numHits) {
            case 3:
                winnings = Lottery.config.match3win;
                break;
            case 4:
                winnings = Lottery.config.match4winJackpotPortion * jackpot / Lottery.config.match4numWinners;
                break;
            case 5:
                winnings = Lottery.config.match5winJackpotPortion * jackpot / Lottery.config.match5numWinners;
                break;
            case 6:
                winnings = Lottery.config.match6winJackpotPortion * jackpot / Lottery.config.match6numWinners;
                break;
            default:
                winnings = 0;
        }
        this.totalWinnings += winnings;
    }
    this.totalSpent = Lottery.config.pricePerTicket * this.totalDraws;
    this.showResults();
}
Lottery.Simulator.prototype.makeAssumptionsHtml = function(){
    var line1 = "$" + Lottery.config.pricePerTicket + " per ticket, " + Lottery.config.match4numWinners + " winners for 4 numbers matched, ";
    line1 += Lottery.config.match5numWinners + " winners for 5 numbers matched.";
    var line2 = "$" + Lottery.config.match3win + " for 3 numbers, ";
    var format = "%5.2f";
    var perc4 = format.sprintf(100*Lottery.config.match4winJackpotPortion) + "%";
    var perc5 = format.sprintf(100*Lottery.config.match5winJackpotPortion) + "%";
    var perc6 = format.sprintf(100*Lottery.config.match6winJackpotPortion) + "%";
    line2 += perc4 + ", " + perc5 + ", and " + perc6 + " of the jackpot for 4, 5, and 6 numbers matched, respectively."
    var line3 = "This is only a simulation. It does not reflect your odds of winning in any particular lottery."
    var br = "<br />";
    return "-" + line1 + br + "-" + line2 + br + "-" + line3 + br; 
}
Lottery.Simulator.prototype.showResults = function(){
    this.showLastDrawn();
    var heading = HtmlGen.div("Your results:", {"class": "blue"});
    var br = "<br />";
    var mainText= "";
    mainText += "Total number of draws played: " + this.totalDraws + br;
    mainText += "Total number of draws where at least 1 number matched: " + this.successDraws + br + br;
    var _123456 = ["-", "Single", "Two", "Three", "Four", "Five", "Six"];
    for (var hits=1; hits<=6; hits++){
        mainText += "Number of " + _123456[hits] + " Number Matches = " + this.matchCounts[hits] + br;
    }
    mainText += br;
    mainText += "You spent: $" + this.totalSpent + br;
    mainText += "You won: $" + Math.round(this.totalWinnings);
    this.resultsContainer.html(
        HtmlGen.table(
            HtmlGen.trtd(heading) +
            HtmlGen.trtd(HtmlGen.div(mainText, {id: "resultsMainBody", "class": "resultsMainBody"})) +
            HtmlGen.trtd(HtmlGen.div(br + "Assumptions / Notes:", {"class": "smallText"})) +
            HtmlGen.trtd(HtmlGen.div(this.makeAssumptionsHtml(), {"class": "smallText male5"}))
            , {"class":  "botTable"}
        )
    );
}
/*******************************************************************************************************
 Figure222PLUS (Interactive Boxplot)
*******************************************************************************************************/
var Figure222PLUS = {
    cssId: "boxPlotStyles",
    slider1Id: "slider1",
    slider1: null,
    slider2Id: "slider2",
    slider2: null,
    upperContainerId: "upperContainer",
    sliderHandleSize: "small",
    canvasWidth: 650,
    canvasId: "canvas",
    canvas: null,
    ctx: null,
    height: 600,
    min: 0,
    max: 100,
    step: 1,
    dataA: [13, 18, 22, 28, 35, 38, 42, 45, 48, 52, 57, 60, 67, 73, 76],
    dataB: [26, 30, 34, 40, 44, 49, 54, 58, 62, 66, 69, 74, 78, 82, 87],
    dataAsorted: null,
    dataBsorted: null,
    boxPlotPositions: [0.39, 0.77],
    barWidthPortion: 0.05,
    boxWidthPortion: 0.17,
    lineWidth: 2,
    boxColor: "#a00",
    bottomId: "bottom",
    bottomElt: null,
    canvasFont: "14pt Arial",
    smallCanvasFont: "11pt Arial",
    smallerCanvasFont: "9pt Arial",
    leftCtx: null,
    rightCtx: null,
    arrowLength: 22,
    arrowHeadLength: 12,
    arrowHeadThickness: 8,
    background: "#ffffda",
    initCSS: function(){
        this.cssRules = [
            ["#container", {
                "margin-top": "0px",
                "margin-left": "5px",
                "background-color": this.background
            }],
            ["#upperContainer", {
                border: "1px solid black",
                "background-color": "white",
                "margin-top": "9px"
            }],
            ["div.bottom",  {
                "margin-top": "7px"
            }],
            ["table.dataTable", {
                "border-right": "1px solid black",
                "border-bottom": "1px solid black"
            }],
            ["table.dataTable td.dataCell", {
                cursor: "pointer"
            }],
            ["div.heading", {
                "font-size": "24px",
                "font-weight": "bold",
            }],
            ["table.dataTable td.dataCell:hover", {
                cursor: "pointer",
                "background-color": "#f75"
            }],
            ["table.dataTable td", {
                "border-left": "1px solid black",
                "border-top": "1px solid black",
                padding: 0,
                "text-align": "center",
                "white-space": "nowrap",
                "min-width": "24px",
                "font-size": "16px"
            }],
            [".red", {
                color: "red",
                "font-weight": "bold"
            }],
            ["span.quartileInfo", {
                "white-space": "nowrap"
            }],
            ["canvas.smallCanvas", {
                "background-color": "white"
            }]
        ];
        /*
div.ui-tooltip {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid black;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
}
div.ui-tooltip-content {
    padding-top: 0px;
    padding-bottom: 2px;
    padding-left: 3px;
    padding-right: 3px;
    background-color: #ff9;
    font-size: 15px;
}        
        */
        this.factory = new cssFactory(this);
        this.factory.produce();
    },
    callbackLeft: function(values){
        this.dataA = values;
        this.doBoxPlot();
    },
    callbackRight: function(values){
        this.dataB = values;
        this.doBoxPlot();
    },
    boxPlotAux: function(data){
        var sorted = data.sortASC();
        var min = data[0];
        var max = data[data.length-1];
        var lowerQuartile = data.quantile(0.25);
        var median = data.quantile(0.5);
        var upperQuartile = data.quantile(0.75);
        return {
            sorted: sorted,
            quartiles: [min, lowerQuartile, median, upperQuartile, max]
        };
    },
    boxPlotDrawAux: function(horizPos, quarts, y0, y1, label){
        var ctx = this.ctx;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;
        var x0 = horizPos * width;
        var boxWidth = this.boxWidthPortion * width;
        var barWidth = this.barWidthPortion * width;
        var min = quarts[0];
        var loq = quarts[1];
        var median = quarts[2];
        var hiq = quarts[3];
        var max = quarts[4];
        var scaledHeight = y1 - y0;
        var yFactor = height / scaledHeight;
        function yTrafo(y){
            return height - (y - y0) * yFactor;
        }
        var yMin = yTrafo(min);
        var yLoq = yTrafo(loq);
        var yMedian = yTrafo(median);
        var yHiq = yTrafo(hiq);
        var yMax = yTrafo(max);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = "black";
        // min
        ctx.beginPath();
        ctx.moveTo(x0 - 0.5*barWidth, yMin);
        ctx.lineTo(x0 + 0.5*barWidth, yMin);
        ctx.stroke();
        // min loq
        ctx.beginPath();
        ctx.moveTo(x0, yMin);
        ctx.lineTo(x0, yLoq);
        ctx.stroke();
        // max
        ctx.beginPath();
        ctx.moveTo(x0 - 0.5*barWidth, yMax);
        ctx.lineTo(x0 + 0.5*barWidth, yMax);
        ctx.stroke();
        // max hiq
        ctx.beginPath();
        ctx.moveTo(x0, yMax);
        ctx.lineTo(x0, yHiq);
        ctx.stroke();
        //box
        ctx.fillStyle = this.boxColor;
        ctx.beginPath();
        var left  = x0 - 0.5*boxWidth;
        var right = x0 + 0.5*boxWidth;
        ctx.moveTo(left,  yLoq);
        ctx.lineTo(right, yLoq);
        ctx.lineTo(right, yHiq);
        ctx.lineTo(left,  yHiq);
        ctx.lineTo(left,  yLoq);
        ctx.fill();
        // median
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(left,  yMedian);
        ctx.lineTo(right, yMedian);
        ctx.stroke();
        // label the horizontal axis
        var axisY = yTrafo(0);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, axisY);
        ctx.lineTo(x0, axisY - 5);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.font = this.canvasFont;
        ctx.fillStyle = "black";
        ctx.fillText(label, x0, axisY + 24);
    },
    doBoxPlot: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var qa = this.boxPlotAux(this.dataA);
        var qb = this.boxPlotAux(this.dataB);
        this.dataAsorted = qa.sorted;
        this.dataBsorted = qb.sorted;
        this.aQuarts = qa.quartiles;
        this.bQuarts = qb.quartiles;
        var xMin = -17, xMax = 104;
        var vSpace = 6;
        var yMin = -vSpace, yMax = 100 + vSpace;
        var sliderHeight = this.height * (100/(yMax-yMin));
        this.slider1.elt.height(sliderHeight);
        this.slider2.elt.height(sliderHeight);
        CANVAS.xyAxis(ctx,
            { min: xMin, axisMin: 0, max: xMax, axisMax: 100, axisLabel: "", showTicks: false, showNumberLables: false,  },
            { min: yMin, axisMin: 0, max: yMax, axisMax: 100, axisLabel: "Number of Text Messages", labelFont: this.canvasFont }
        );
        this.boxPlotDrawAux(this.boxPlotPositions[0], qa.quartiles, yMin, yMax, "School A");
        this.boxPlotDrawAux(this.boxPlotPositions[1], qb.quartiles, yMin, yMax, "School B");
        this.showBottom();
    },
    dataTableAux: function(data, id){
        var tr1 = HtmlGen.tr(UTIL.range(1, data.length).map(function(item){
            return HtmlGen.td(HtmlGen.span(item));
        }).join(""));
        var tr2 = HtmlGen.tr(data.map(function(item){
            return HtmlGen.td(HtmlGen.span(item), {"class": "dataCell", title: "erase"});
        }).join(""));
        var dataTable = HtmlGen.table(tr1 + tr2, {cellspacing: 0, cellpadding: 0, "class": "dataTable", id: id + "Data", display: "block"});
        var outerTable = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(dataTable, {display: "block"})) +
            HtmlGen.tr(HtmlGen.td(HtmlGen.div("", {id: id + "canvasDiv", display: "block"}), {display: "block"}))
            , {id: id + "outer", cellspacing: 0, cellpadding: 0}
        );
        return outerTable;
    },
    quantileCalcAux : function(data, quantile, title, idInner, idOuter){
        function a(s){
            return "a" + HtmlGen.sub(s);
        }
        function lc(s1, s2){
            return la1 + "*" + a(s1) + " + " + la + "*" + a(s2);
        }
        function redResult(){
            return HtmlGen.span(result, {"class": "red"});
        }
        var I = quantile * data.length + 0.5;
        var i = Math.floor(I);
        var lambda = I - i;
        var oneMla = 1 - lambda;
        var lo = data[i-1];
        var hi = data[i];
        var result = i == data.length ? lo : oneMla * lo + lambda * hi;
        var la = "&lambda;";
        var la1 = "(1-" + la + ")";
        var br = "<br />";
        var comma = ",&nbsp; "
        var one = "I = " + quantile + " * " + data.length + " + 0.5 = " + I + comma;
        var two = "i = " + mathFloor(I) + " = " + i + comma;
        var three, four, txt;
        if (lambda == 0){
            three = br;
            four = a(i) + " = " + redResult();
        } else {
            three = la + " = I - i = " + lambda + br;
            four = lc("i", "i+1") + /*" = " + lc(i, i+1) +*/ " = ";
            four += oneMla + "*" + lo + " + " + lambda + "*" + hi + " = " + redResult();
        }
        txt = one + two + three + four;
        return HtmlGen.fieldset(
            HtmlGen.legend(title) + HtmlGen.span(txt, {id: idInner, "class": "quartileInfo"}), {id: idOuter}
        );
    },
    showBottom: function(){
        var lo = "lower quartile (25%)";
        var med = "median (50%)";
        var up = "upper  quartile (75%)";
        this.botA0.html(this.dataTableAux(this.dataAsorted, "botA0"));
        this.botB0.html(this.dataTableAux(this.dataBsorted, "botB0"));
        this.botA1.html(this.quantileCalcAux(this.dataA, 0.25, lo, "fooa1", "bara1"));
        this.botB1.html(this.quantileCalcAux(this.dataB, 0.25, lo, "foob1", "barb1"));
        this.botA2.html(this.quantileCalcAux(this.dataA, 0.5, med, "fooa2", "bara2"));
        this.botB2.html(this.quantileCalcAux(this.dataB, 0.5, med, "foob2", "barb2"));
        this.botA3.html(this.quantileCalcAux(this.dataA, 0.75, up, "fooa3", "bara3"));
        this.botB3.html(this.quantileCalcAux(this.dataB, 0.75, up, "foob3", "barb3"));
        this.leftCanvasDiv = $("#botA0canvasDiv");
        this.rightCanvasDiv = $("#botB0canvasDiv");
        var wLeft = this.leftCanvasDiv.width();
        var wRight = this.rightCanvasDiv.width();
        var ha = this.dataAsorted.length >= 7 ? 70 : 95;
        var hb = this.dataBsorted.length >= 7 ? 70 : 95;
        var lc = HtmlGen.canvas({width: wLeft, height: ha, id: "leftCanvas", display: "block", "class": "smallCanvas"});
        var rc = HtmlGen.canvas({width: wRight, height: hb, id: "rightCanvas", display: "block", "class": "smallCanvas"});
        this.leftCanvasDiv.html(lc);
        this.rightCanvasDiv.html(rc);
        var leftCanv = this.leftCanvasDiv.find("#leftCanvas");
        this.leftCtx = leftCanv[0].getContext('2d');
        var rightCanv = this.rightCanvasDiv.find("#rightCanvas");
        this.rightCtx = rightCanv[0].getContext('2d');
        if (this.dataA.length > 2){
            for (var i=1; i<=this.dataA.length; i++){
                var elt = this.botA0.find(".dataCell:nth-child(" + i + ")");
                elt.click(this.makeRemoveHandlerA(i-1));
            }
            //this.botA0.find(".dataCell").tooltip();
        } else {
            this.botA0.find(".dataCell").removeAttr("title").css("cursor", "auto").css("background-color", this.background);
        }
        if (this.dataB.length > 2){
            for (var i=1; i<=this.dataB.length; i++){
                var elt = this.botB0.find(".dataCell:nth-child(" + i + ")");
                elt.click(this.makeRemoveHandlerB(i-1));
            }
            //this.botB0.find(".dataCell").tooltip();
        } else {
            this.botB0.find(".dataCell").removeAttr("title").css("cursor", "auto").css("background-color", this.background);
        }
        this.drawToSmallCanvas(this.leftCtx, this.aQuarts, this.dataAsorted);
        this.drawToSmallCanvas(this.rightCtx, this.bQuarts, this.dataBsorted);
    },
    drawToSmallCanvas : function(ctx, quarts, data){
        var al = this.arrowLength;
        var w = ctx.canvas.width;
        ctx.textAlign = "center";
        ctx.font = data.length <= 5 ? this.smallerCanvasFont : this.smallCanvasFont;
        ctx.fillStyle = "red";
        var x = [0, 0.25, 0.5, 0.75, 1].timesConst(w);
        var txt = ["min", "25%", "median", "75%", "max"];
        var y, lengths;
        if (data.length >= 7){
            lengths = UTIL.constantArray(5, al);
        } else {
            lengths = [0, al + 27, al - 4, al + 27, 0];
        }
        for (var i=1; i<=3; i++){
            //upArrow: function(ctx, x, yTop, yBottom, arrowHeadLength, arrowThickness, color, lineWidth
            CANVAS.upArrow(ctx, x[i], 0, lengths[i], this.arrowHeadLength, this.arrowHeadThickness, "red", 1);
            y = lengths[i]  + 17;
            ctx.fillText(txt[i], x[i], y);
            y += 20;
            ctx.fillText(quarts[i], x[i], y);
        }
    },
    makeRemoveHandlerA: function(position){
        return function(){
            var newData = Figure222PLUS.dataAsorted.slice(0, position).concat(Figure222PLUS.dataAsorted.slice(position + 1, Figure222PLUS.dataAsorted.length));
            Figure222PLUS.dataA = newData;
            Figure222PLUS.run();
        }
    },
    makeRemoveHandlerB: function(position){
        return function(){
            Figure222PLUS.dataB = Figure222PLUS.dataBsorted.slice(0, position).concat(Figure222PLUS.dataBsorted.slice(position + 1, Figure222PLUS.dataBsorted.length));
            Figure222PLUS.run();
        }
    },
    addSampleAbtnClick: function(){
        var newData = [0].concat(Figure222PLUS.dataAsorted);
        Figure222PLUS.dataA = newData;
        Figure222PLUS.run();
    },
    addSampleBbtnClick: function(){
        var newData = [0].concat(Figure222PLUS.dataBsorted);
        Figure222PLUS.dataB = newData;
        Figure222PLUS.run();
    },
    run: function(){
        this.initCSS();
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.height;
        var canvasId = this.canvasId;
        function makeSlider(data, id, callback){
            return new VerticalSlider({
                size: Figure222PLUS.sliderHandleSize,
                min: Figure222PLUS.min,
                max: Figure222PLUS.max,
                step: Figure222PLUS.step,
                values: data,
                id: id,
                callback: function(values){
                    callback.call(Figure222PLUS, values);
                }
            });
        }
        this.slider1 = makeSlider(this.dataA, this.slider1Id, this.callbackLeft);
        this.slider2 = makeSlider(this.dataB, this.slider2Id, this.callbackRight);
        var canvasHtml = HtmlGen.canvas({width: canvasWidth, height: canvasHeight, id: canvasId});
        var table = HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(this.slider1.html, {id: "sliderTd1"}) +
                HtmlGen.td(canvasHtml, {id: "canvasTd"}) +
                HtmlGen.td(this.slider2.html, {id: "sliderTd2"})
            )
            ,{id: this.upperContainerId}
        );
        var tha = HtmlGen.th("School A&nbsp; " + HtmlGen.eisBtn("+", {id: "addSampleA", title: "add samlpe"}) , {id: "headerA"});
        var thb = HtmlGen.th("School B&nbsp; " + HtmlGen.eisBtn("+", {id: "addSampleB", title: "add samlpe"}) , {id: "headerB"});
        var bottom = HtmlGen.div(
            HtmlGen.table(
                HtmlGen.tr(tha + thb) +
                HtmlGen.tr(HtmlGen.td("", {id: "botA0", "align": "center"}) + HtmlGen.td("", {id: "botB0", "align": "center"})) +
                HtmlGen.tr(HtmlGen.td("", {id: "botA1"}) + HtmlGen.td("", {id: "botB1"}), {"class": "calculationDetails"}) +
                HtmlGen.tr(HtmlGen.td("", {id: "botA2"}) + HtmlGen.td("", {id: "botB2"}), {"class": "calculationDetails"}) +
                HtmlGen.tr(HtmlGen.td("", {id: "botA3"}) + HtmlGen.td("", {id: "botB3"}), {"class": "calculationDetails"})
            )
            , {id: this.bottomId, "class": "bottom"}        
        );
        var heading = HtmlGen.div("Interactive Boxplot", {"class": "heading"});
        var mainTable = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(table, {align: "center"})) + 
            HtmlGen.tr(HtmlGen.td(bottom))
            , {id: "container"}
        );
        var html = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(heading, {align: "center"})) +
            HtmlGen.trtd(mainTable)
        );
        gUniverseElt.html(html);
        this.slider1.init();
        this.slider2.init();
        var canvas = $("#" + canvasId);
        var ctx = canvas[0].getContext('2d');
        this.canvas = canvas;
        this.ctx = ctx;
        this.bottomElt = $("#" + this.bottomId);
        this.botA0 = this.bottomElt.find("#botA0");
        this.botA1 = this.bottomElt.find("#botA1");
        this.botA2 = this.bottomElt.find("#botA2");
        this.botA3 = this.bottomElt.find("#botA3");
        this.botB0 = this.bottomElt.find("#botB0");
        this.botB1 = this.bottomElt.find("#botB1");
        this.botB2 = this.bottomElt.find("#botB2");
        this.botB3 = this.bottomElt.find("#botB3");
        this.doBoxPlot();
        this.addSampleAbtn = $("#addSampleA");
        this.addSampleAbtn.click(this.addSampleAbtnClick);
        this.addSampleBbtn = $("#addSampleB");
        this.addSampleBbtn.click(this.addSampleBbtnClick);
    }
};

/*******************************************************************************************************
 Figure222 (Interactive Boxplot)
*******************************************************************************************************/
Figure222 = {
    elts: [],
    canvasWidth: Options.Figure222.canvasWidth,
    canvasHeight: Options.Figure222.canvasHeight,
    ctx: null,
    yMin: 0,
    yMax: 100,
    yStep: 1,
    dataA: [13, 18, 22, 28, 35, 38, 42, 45, 48, 52, 57, 60, 67, 73, 76],
    dataB: [26, 30, 34, 40, 44, 49, 54, 58, 62, 66, 69, 74, 78, 82, 87],
    yAxisPosition: Options.Figure222.yAxisPosition,
    boxPlotPositions: Options.Figure222.boxPlotPositions,
    controlPositions: Options.Figure222.controlPositions,
    barWidthPortion: Options.Figure222.barWidthPortion,
    boxWidthPortion: Options.Figure222.boxWidthPortion,
    lineWidth: Options.Figure222.lineWidth,
    boxColor: Options.Figure222.boxColor,
    canvasFont: Options.Figure222.canvasFont,
    smallCanvasFont: Options.Figure222.smallCanvasFont,
    smallerCanvasFont: Options.Figure222.smallerCanvasFont,
    leftCtx: null,
    rightCtx: null,
    arrowLength: 22,
    arrowHeadLength: 12,
    arrowHeadThickness: 8,
    xTrafoToCanvas: null,
    xTrafoFromCanvas: null,
    xMakeTrafoToCanvas: function(){
        var w = this.ctx.canvas.width;
        var a0 = this.controlPositions[0];
        var a1 = this.controlPositions[1];
        var da = a1 - a0;
        return function(x){
            return w * (da * x + a0);
        }
    },
    xMakeTrafoFromCanvas: function(){
        var w = this.ctx.canvas.width;
        var a0 = this.controlPositions[0];
        var a1 = this.controlPositions[1];
        var da = a1 - a0;
        return function(x){
            return (x/w - a0)/da;
        }
    },
    run: function(){
        this.background = Options.Figure222.backgroundColor;
    	var canvasWidth = this.canvasWidth;
    	var canvasHeight = this.canvasHeight;
    	var canvasId = "canvas222";
    	var canvasHtml = HtmlGen.canvas({width: canvasWidth, height: canvasHeight, id: canvasId});
    	var tha = HtmlGen.th("School A&nbsp; " + HtmlGen.eisBtn("+", {id: "addSampleA", title: "add samlpe"}) , {id: "headerA"});
    	var thb = HtmlGen.th("School B&nbsp; " + HtmlGen.eisBtn("+", {id: "addSampleB", title: "add samlpe"}) , {id: "headerB"});
    	var bottom = HtmlGen.div(
    		HtmlGen.table(
    			HtmlGen.tr(tha + thb, {"class": "valuesTable"}) +
    			HtmlGen.tr(HtmlGen.td("", {id: "botA0", "align": "center"}) + HtmlGen.td("", {id: "botB0", "align": "center"}), {"class": "valuesTable"}) +
    			HtmlGen.tr(HtmlGen.td("", {id: "botA1"}) + HtmlGen.td("", {id: "botB1"}), {"class": "calculationDetails"}) +
    			HtmlGen.tr(HtmlGen.td("", {id: "botA2"}) + HtmlGen.td("", {id: "botB2"}), {"class": "calculationDetails"}) +
    			HtmlGen.tr(HtmlGen.td("", {id: "botA3"}) + HtmlGen.td("", {id: "botB3"}), {"class": "calculationDetails"})
    		)
    		, {id: "bottom", "class": "bottom"}        
    	);
    	var heading = HtmlGen.div("Interactive Boxplot", {"class": "heading"});
        var leftOverCanvasInfo = H.span("left", {id: "leftOverCanvasInfo", "class": "overCanvasInfo"});
        var rightOverCanvasInfo = H.span("right", {id: "rightOverCanvasInfo", "class": "overCanvasInfo"});
        var canvasParent = H.div(
            canvasHtml + leftOverCanvasInfo + rightOverCanvasInfo
            , {id: "canvasParent", style: "position: relative; z-index: 0;"}
        );

    	var mainTable = HtmlGen.table(
    		HtmlGen.tr(HtmlGen.td(canvasParent, {align: "center"})) + 
    		HtmlGen.tr(HtmlGen.td(bottom))
    		, {id: "Figure222Main"}
    	);
    	var html = HtmlGen.table(
    		HtmlGen.tr(HtmlGen.td(heading, {align: "center"})) +
    		HtmlGen.trtd(mainTable)
            , {id: "Figure222"}
    	);
        gUniverseElt.html(html);
        $("#leftOverCanvasInfo").hide();
        $("#rightOverCanvasInfo").hide();
        var canvas = $("#" + canvasId);
        var ctx = canvas[0].getContext('2d');
        this.ctx = ctx;
        this.bottomElt = $("#" + "bottom");
        this.botA0 = this.bottomElt.find("#botA0");
        this.botA1 = this.bottomElt.find("#botA1");
        this.botA2 = this.bottomElt.find("#botA2");
        this.botA3 = this.bottomElt.find("#botA3");
        this.botB0 = this.bottomElt.find("#botB0");
        this.botB1 = this.bottomElt.find("#botB1");
        this.botB2 = this.bottomElt.find("#botB2");
        this.botB3 = this.bottomElt.find("#botB3");
        
        this.xTrafoToCanvas = this.xMakeTrafoToCanvas();
        this.xTrafoFromCanvas = this.xMakeTrafoFromCanvas();
        var xTrafoToCanvas  = this.xTrafoToCanvas;
        var xTrafoFromCanvas  = this.xTrafoFromCanvas;
        var pointsA0 = this.dataA.map(function(y){ return [0, y]; });
        var pointsB0 = this.dataB.map(function(y){ return [1, y]; });
        var pointsA = pointsA0.map(function(item){
            var x = item[0];
            var y = item[1];
            return {
                x: x,
                y: y,
                update: function(){
                    //$("#debug2").html(this.index);
                }
            }
        });
        var pointsB = pointsB0.map(function(item){
            var x = item[0];
            var y = item[1];
            return {
                x: x,
                y: y,
                update: function(){
                    //$("#debug2").html(this.index);
                }
            }
        });
        var pointsAB = pointsA.concat(pointsB);

        var yMin = this.yMin, yMax = this.yMax;
        var dy = yMax - yMin;
    	var vSpace = 0.06 * dy;
    	var yMin1 = yMin - vSpace, yMax1 = yMax + vSpace;
        this.yMin1 = yMin1; this.yMax1 = yMax1;

        var THIS = this;
        this.ddc = new DragDropCanvas({
            id: canvasId,
            xMin: xTrafoFromCanvas(0),
            xMax: xTrafoFromCanvas(THIS.ctx.canvas.width),
            yMin: THIS.yMin1,
            yMax: THIS.yMax1,
            points: pointsAB,
            paintPoint: function(ctx, i, x, y, xCanv, yCanv){
                //console.log("i: " + i + " x: " + x + " y: " + y);
                CANVAS.mathematicaCrossHairs(ctx, xCanv, yCanv);
            },
            repaintCallback: function(ctx){
                THIS.repaint.call(THIS, ctx);
            },
            immutableX: true,
            app: this,
            minAllowedY: Options.Figure222.minimumAllowedNumberOfTextMessages,
            maxAllowedY: Options.Figure222.maximumAllowedNumberOfTextMessages,
            additionalCallback : function(xScaled, yScaled, evt, xCanvas, yCanvas, mode){
                //$("#debug1").html("xs: " + xScaled + " ys: " + yScaled + " xc: " + xCanvas + " yc: " + yCanvas + " mode: " + mode);
                var leftA = THIS.boxPlotPositions[0] - THIS.boxWidthPortion/2;
                var rightA = leftA + THIS.boxWidthPortion;
                var leftB = THIS.boxPlotPositions[1] - THIS.boxWidthPortion/2;
                var rightB = leftB + THIS.boxWidthPortion;
                var x = xCanvas / THIS.ctx.canvas.width;
                var overA = leftA <= x && x <= rightA && THIS.dataA[0] <= yScaled && yScaled <= THIS.dataA[THIS.dataA.length - 1];
                var overB = leftB <= x && x <= rightB && THIS.dataB[0] <= yScaled && yScaled <= THIS.dataB[THIS.dataB.length - 1];
                //$("#debug1").html("over A: " + overA + " over B: " + overB);
                //$("#debug2").html("y: " + yScaled);
                //blah = evt;
                var lci = $("#leftOverCanvasInfo");
                var rci = $("#rightOverCanvasInfo");
                function mouseOverTableAux(quarts){
                    return H.table00(
                        H.tr(H.th("max")    + H.td(quarts[4])) +
                        H.tr(H.th("75%")    + H.td(quarts[3])) +
                        H.tr(H.th("median") + H.td(quarts[2])) +
                        H.tr(H.th("25%")    + H.td(quarts[1])) +
                        H.tr(H.th("min")    + H.td(quarts[0]))
                    )
                }
                var shiftMouseOverTableToRight = 70;
                if (overA){
                    lci.css({
                        left: xCanvas + shiftMouseOverTableToRight,
                        top: yCanvas
                    });
                    lci.html(mouseOverTableAux(THIS.aQuarts));
                    lci.show();
                } else {
                    lci.hide();
                }
                if (overB){
                    rci.css({
                        left: xCanvas + shiftMouseOverTableToRight,
                        top: yCanvas
                    });
                    rci.html(mouseOverTableAux(THIS.bQuarts));
                    rci.show();
                } else {
                    rci.hide();
                }
            }
        });
        this.repaint(this.ctx);
        this.addSampleAbtn = $("#addSampleA");
        this.addSampleAbtn.click(this.addSampleAbtnClick);
        this.addSampleBbtn = $("#addSampleB");
        this.addSampleBbtn.click(this.addSampleBbtnClick);
        if (Options.Figure222.hideCalculationDetails){
            $(".calculationDetails").hide();
        }
        if (Options.Figure222.hideValuesTables){
            $(".valuesTable").hide();
        }
        $("table#Figure222").css({
            "background-color": Options.Figure222.backgroundColor
        });
    },
    boxPlotDrawAux: function(horizPos, quarts, y0, y1, label){
    	var ctx = this.ctx;
    	var width = ctx.canvas.width;
    	var height = ctx.canvas.height;
    	var x0 = horizPos * width;
    	var boxWidth = this.boxWidthPortion * width;
    	var barWidth = this.barWidthPortion * width;
    	var min = quarts[0];
    	var loq = quarts[1];
    	var median = quarts[2];
    	var hiq = quarts[3];
    	var max = quarts[4];
    	var scaledHeight = y1 - y0;
    	var yFactor = height / scaledHeight;
    	function yTrafo(y){
    		return height - (y - y0) * yFactor;
    	}
    	var yMin = yTrafo(min);
    	var yLoq = yTrafo(loq);
    	var yMedian = yTrafo(median);
    	var yHiq = yTrafo(hiq);
    	var yMax = yTrafo(max);
    	ctx.lineWidth = this.lineWidth;
    	ctx.strokeStyle = "black";
    	// min
    	ctx.beginPath();
    	ctx.moveTo(x0 - 0.5*barWidth, yMin);
    	ctx.lineTo(x0 + 0.5*barWidth, yMin);
    	ctx.stroke();
    	// min loq
    	ctx.beginPath();
    	ctx.moveTo(x0, yMin);
    	ctx.lineTo(x0, yLoq);
    	ctx.stroke();
    	// max
    	ctx.beginPath();
    	ctx.moveTo(x0 - 0.5*barWidth, yMax);
    	ctx.lineTo(x0 + 0.5*barWidth, yMax);
    	ctx.stroke();
    	// max hiq
    	ctx.beginPath();
    	ctx.moveTo(x0, yMax);
    	ctx.lineTo(x0, yHiq);
    	ctx.stroke();
    	//box
    	ctx.fillStyle = this.boxColor;
    	ctx.beginPath();
    	var left  = x0 - 0.5*boxWidth;
    	var right = x0 + 0.5*boxWidth;
    	ctx.moveTo(left,  yLoq);
    	ctx.lineTo(right, yLoq);
    	ctx.lineTo(right, yHiq);
    	ctx.lineTo(left,  yHiq);
    	ctx.lineTo(left,  yLoq);
    	ctx.fill();
    	// median
    	ctx.strokeStyle = "white";
    	ctx.beginPath();
    	ctx.moveTo(left,  yMedian);
    	ctx.lineTo(right, yMedian);
    	ctx.stroke();
    	// label the horizontal axis
    	var axisY = yTrafo(0);
    	ctx.strokeStyle = "black";
    	ctx.lineWidth = 1;
    	ctx.beginPath();
    	ctx.moveTo(x0, axisY);
    	ctx.lineTo(x0, axisY - 5);
    	ctx.stroke();
    	ctx.textAlign = "center";
    	ctx.font = this.canvasFont;
    	ctx.fillStyle = "black";
    	ctx.fillText(label, x0, axisY + 24);
    },
    boxPlotAux: function(data){
    	data.sortASC();
    	var min = data[0];
    	var max = data[data.length-1];
    	var lowerQuartile = data.quantile(0.25);
    	var median = data.quantile(0.5);
    	var upperQuartile = data.quantile(0.75);
    	return {
    		quartiles: [min, lowerQuartile, median, upperQuartile, max]
    	};
    },
    repaint: function(ctx){
        this.dataA = this.ddc.pointColl.points.filter(function(point){ return point.x == 0;}).map(function(point){ return Math.round(point.y); }).sortASC();
        this.dataB = this.ddc.pointColl.points.filter(function(point){ return point.x == 1;}).map(function(point){ return Math.round(point.y); }).sortASC();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    	var qa = this.boxPlotAux(this.dataA);
    	var qb = this.boxPlotAux(this.dataB);
    	this.aQuarts = qa.quartiles;
    	this.bQuarts = qb.quartiles;
        var yMin = this.yMin, yMax = this.yMax;
        var dy = yMax - yMin;
    	var vSpace = 0.06 * dy;
    	var yMin1 = yMin - vSpace, yMax1 = yMax + vSpace;
        var xMin1 = this.xTrafoFromCanvas(0);
        var xMax1 = this.xTrafoFromCanvas(ctx.canvas.width);
        var canvasYaxisPosition = ctx.canvas.width * this.yAxisPosition;
        var xMin = this.xTrafoFromCanvas(canvasYaxisPosition);
        var xMax = xMax1;
        var xAxisOptions = {
            min: xMin1, axisMin: xMin, max: xMax1, axisMax: xMax,
            axisLabel: "", showTicks: false, showNumberLables: false,
            distanceFromBottom: ctx.canvas.height * (yMin - yMin1) / (yMax1 - yMin1)
        };
        var yAxisOptions = {
            min: yMin1, axisMin: yMin, max: yMax1, axisMax: yMax,
            axisLabel: "Number of Text Messages", labelFont: this.canvasFont,
            distanceFromLeft: canvasYaxisPosition, narrowness: 0.6
        };
    	CANVAS.xAxis(ctx, xAxisOptions);
    	CANVAS.yAxis(ctx, yAxisOptions);
    	this.boxPlotDrawAux(this.boxPlotPositions[0], qa.quartiles, yMin1, yMax1, "School A");
    	this.boxPlotDrawAux(this.boxPlotPositions[1], qb.quartiles, yMin1, yMax1, "School B");
    	this.showBottom();
        this.ddc.repaint();
        //this.ddc.pointColl.points
    },
    dataTableAux: function(data, id){
    	var tr1 = HtmlGen.tr(UTIL.range(1, data.length).map(function(item){
    		return HtmlGen.td(HtmlGen.span(item));
    	}).join(""));
    	var tr2 = HtmlGen.tr(data.map(function(item){
    		return HtmlGen.td(HtmlGen.span(item), {"class": "dataCell", title: "erase"});
    	}).join(""));
    	var dataTable = HtmlGen.table(tr1 + tr2, {cellspacing: 0, cellpadding: 0, "class": "dataTable", id: id + "Data", display: "block"});
    	var outerTable = HtmlGen.table(
    		HtmlGen.tr(HtmlGen.td(dataTable, {display: "block"})) +
    		HtmlGen.tr(HtmlGen.td(HtmlGen.div("", {id: id + "canvasDiv", display: "block"}), {display: "block"}))
    		, {id: id + "outer", cellspacing: 0, cellpadding: 0}
    	);
    	return outerTable;
    },
    quantileCalcAux : function(data, quantile, title, idInner, idOuter){
    	function a(s){
    		return "a" + HtmlGen.sub(s);
    	}
    	function lc(s1, s2){
    		return la1 + "*" + a(s1) + " + " + la + "*" + a(s2);
    	}
    	function redResult(){
    		return HtmlGen.span(result, {"class": "red"});
    	}
    	var I = quantile * data.length + 0.5;
    	var i = Math.floor(I);
    	var lambda = I - i;
    	var oneMla = 1 - lambda;
    	var lo = data[i-1];
    	var hi = data[i];
    	var result = i == data.length ? lo : oneMla * lo + lambda * hi;
    	var la = "&lambda;";
    	var la1 = "(1-" + la + ")";
    	var br = "<br />";
    	var comma = ",&nbsp; "
    	var one = "I = " + quantile + " * " + data.length + " + 0.5 = " + I + comma;
    	var two = "i = " + mathFloor(I) + " = " + i + comma;
    	var three, four, txt;
    	if (lambda == 0){
    		three = br;
    		four = a(i) + " = " + redResult();
    	} else {
    		three = la + " = I - i = " + lambda + br;
    		four = lc("i", "i+1") + /*" = " + lc(i, i+1) +*/ " = ";
    		four += oneMla + "*" + lo + " + " + lambda + "*" + hi + " = " + redResult();
    	}
    	txt = one + two + three + four;
    	return HtmlGen.fieldset(
    		HtmlGen.legend(title) + HtmlGen.span(txt, {id: idInner, "class": "quartileInfo"}), {id: idOuter}
    	);
    },    
    showBottom: function(){
    	var lo = "lower quartile (25%)";
    	var med = "median (50%)";
    	var up = "upper  quartile (75%)";
    	this.botA0.html(this.dataTableAux(this.dataA, "botA0"));
    	this.botB0.html(this.dataTableAux(this.dataB, "botB0"));
    	this.botA1.html(this.quantileCalcAux(this.dataA, 0.25, lo, "fooa1", "bara1"));
    	this.botB1.html(this.quantileCalcAux(this.dataB, 0.25, lo, "foob1", "barb1"));
    	this.botA2.html(this.quantileCalcAux(this.dataA, 0.5, med, "fooa2", "bara2"));
    	this.botB2.html(this.quantileCalcAux(this.dataB, 0.5, med, "foob2", "barb2"));
    	this.botA3.html(this.quantileCalcAux(this.dataA, 0.75, up, "fooa3", "bara3"));
    	this.botB3.html(this.quantileCalcAux(this.dataB, 0.75, up, "foob3", "barb3"));
    	this.leftCanvasDiv = $("#botA0canvasDiv");
    	this.rightCanvasDiv = $("#botB0canvasDiv");
    	var wLeft = this.leftCanvasDiv.width();
    	var wRight = this.rightCanvasDiv.width();
    	var ha = this.dataA.length >= 7 ? 70 : 95;
    	var hb = this.dataB.length >= 7 ? 70 : 95;
    	var lc = HtmlGen.canvas({width: wLeft, height: ha, id: "leftCanvas", display: "block", "class": "smallCanvas"});
    	var rc = HtmlGen.canvas({width: wRight, height: hb, id: "rightCanvas", display: "block", "class": "smallCanvas"});
    	this.leftCanvasDiv.html(lc);
    	this.rightCanvasDiv.html(rc);
    	var leftCanv = this.leftCanvasDiv.find("#leftCanvas");
    	this.leftCtx = leftCanv[0].getContext('2d');
    	var rightCanv = this.rightCanvasDiv.find("#rightCanvas");
    	this.rightCtx = rightCanv[0].getContext('2d');
    	if (this.dataA.length > 2){
    		for (var i=1; i<=this.dataA.length; i++){
    			var elt = this.botA0.find(".dataCell:nth-child(" + i + ")");
    			elt.click(this.makeRemoveHandlerA(i-1));
    		}
    		//this.botA0.find(".dataCell").tooltip();
    	} else {
    		this.botA0.find(".dataCell").removeAttr("title").css("cursor", "auto").css("background-color", this.background);
    	}
    	if (this.dataB.length > 2){
    		for (var i=1; i<=this.dataB.length; i++){
    			var elt = this.botB0.find(".dataCell:nth-child(" + i + ")");
    			elt.click(this.makeRemoveHandlerB(i-1));
    		}
    		//this.botB0.find(".dataCell").tooltip();
    	} else {
    		this.botB0.find(".dataCell").removeAttr("title").css("cursor", "auto").css("background-color", this.background);
    	}
    	this.drawToSmallCanvas(this.leftCtx, this.aQuarts, this.dataA);
    	this.drawToSmallCanvas(this.rightCtx, this.bQuarts, this.dataB);
    },
    drawToSmallCanvas : function(ctx, quarts, data){
    	var al = this.arrowLength;
    	var w = ctx.canvas.width;
    	ctx.textAlign = "center";
    	ctx.font = data.length <= 5 ? this.smallerCanvasFont : this.smallCanvasFont;
    	ctx.fillStyle = "red";
    	var x = [0, 0.25, 0.5, 0.75, 1].timesConst(w);
    	var txt = ["min", "25%", "median", "75%", "max"];
    	var y, lengths;
    	if (data.length >= 7){
    		lengths = UTIL.constantArray(5, al);
    	} else {
    		lengths = [0, al + 27, al - 4, al + 27, 0];
    	}
    	for (var i=1; i<=3; i++){
    		//upArrow: function(ctx, x, yTop, yBottom, arrowHeadLength, arrowThickness, color, lineWidth
    		CANVAS.upArrow(ctx, x[i], 0, lengths[i], this.arrowHeadLength, this.arrowHeadThickness, "red", 1);
    		y = lengths[i]  + 17;
    		ctx.fillText(txt[i], x[i], y);
    		y += 20;
    		ctx.fillText(quarts[i], x[i], y);
    	}
    },
    makeRemoveHandlerA: function(position){
    	return function(){
    		var newData = Figure222.dataA.slice(0, position).concat(Figure222.dataA.slice(position + 1, Figure222.dataA.length));
    		Figure222.dataA = newData;
    		Figure222.run();
    	}
    },
    makeRemoveHandlerB: function(position){
    	return function(){
    		Figure222.dataB = Figure222.dataB.slice(0, position).concat(Figure222.dataB.slice(position + 1, Figure222.dataB.length));
    		Figure222.run();
    	}
    },
    addSampleAbtnClick: function(){
    	var newData = [0].concat(Figure222.dataA);
    	Figure222.dataA = newData;
    	Figure222.run();
    },
    addSampleBbtnClick: function(){
    	var newData = [0].concat(Figure222.dataB);
    	Figure222.dataB = newData;
    	Figure222.run();
    }
};
/*******************************************************************************************************
 Figure511 (Area under the normal curve)
*******************************************************************************************************/
var Figure511 = {
    title: "Area Under the Normal Curve",
    titleFont : "bold 18pt Arial",
    titleTopMargin : 50,
    leftTailImageWidth: 93,
    rightTailImageWidth: 104,
    leftRightTailImageHeight: 22,
    zMin: -4,
    zMax: 4,
    zGap: 0.3,
    leftZ: -1,
    rightZ: 1,
    leftColor: "rgb(102,153,102)",
    rightColor: "rgb(102,153,204)",
    centerColor: "rgb(153,153,153)",
    leftTailImage: null,
    rightTailImage: null,
    canvasId: "canvas",
    canvas: null,
    ctx: null,
    canvasWidth: 800,
    canvasHeight: 530,
    infoBoxWidth: 176,
    infoBoxHeight: 90,
    infoBoxHeadingFont: "bold 18pt Arial",
    infoBoxFont: "bold 14pt Arial",
    infoBoxAreaFormat: "%7.5f",
    infoBoxZscoreFormat: "%6.3f",
    infoBoxDistanceCenterToCanvasTop: 121,
    infoBoxDistanceHorizFringeToCanvasHorizFringe: 35,
    distanceBellCurvePeakCanvasTop: 180,
    distanceBellCurveAxisCanvasBottom: 20,
    bottomId: "bottom",
    leftButtonsTableParent: null,
    rightButtonsTableParent: null,
    leftButtonZvalues: [-2.575829303548901, -1.9599639845400545, -1.6448536269514729, 0],
    leftButtonCaptions: ["-2.576", "-1.96", "-1.645", "0.000"],
    rightButtonCaptions: ["0.000", "+1.645", "+1.96", "+2.576"],
    calcAreas: function(){
        this.leftArea = gNormalDistribuionCalculator.cdfStdNormal(this.leftZ);
        this.rightArea = 1 - gNormalDistribuionCalculator.cdfStdNormal(this.rightZ);
        if ( this.leftAreaInput ){
            this.leftAreaInput.setValue(this.leftArea);
            this.rightAreaInput.setValue(this.rightArea);
        }
        this.centerArea = 1 - this.leftArea - this.rightArea;
    },
    zChange: function(small, big){
        this.leftZ = small;
        this.rightZ = big;
        this.calcAreas();
        this.doLegend();
        this.draw();
    },
    slideCallback: function(small, big){
        this.zChange(small, big);
        this.leftZInput.setValue(small);
        this.rightZInput.setValue(big);
    },
    actualSlideCallback: function(small, big){
        this.zScoreInputErrorFeedback("both", false);
        this.slideCallback(small, big);
    },
    makeLeftImg: function(){
        if (this.leftTailImage){
            return;
        }
        var width = this.leftTailImageWidth, height = this.leftRightTailImageHeight;
        var color = this.leftColor;
        this.leftTailImage = HtmlGen.makeImageWithCanvas({
            parentElt: gUniverseElt,
            width : width,
            height : height,
            drawingCallback : function(ctx, width, height){
                ctx.font = "14pt Arial";
                CANVAS.leftArrow(ctx, 12, width, width - 21, 11, 8, color, 2);
                ctx.fillStyle = color;
                ctx.textAlign = "right";
                ctx.fillText("Left Tail", width-26, 17);
            }
        });
    },
    makeRightImg: function(){
        if (this.rightTailImage){
            return;
        }
        var width = this.rightTailImageWidth, height = this.leftRightTailImageHeight;
        var color = this.rightColor;
        this.rightTailImage = HtmlGen.makeImageWithCanvas({
            parentElt: gUniverseElt,
            width : width,
            height : height,
            drawingCallback : function(ctx, width, height){
                ctx.font = "14pt Arial";
                CANVAS.rightArrow(ctx, 12, 21, 0, 11, 8, color, 2);
                ctx.fillStyle = color;
                ctx.textAlign = "left";
                ctx.fillText("Right Tail", 26, 17);
            }
        });
    },
    doLegend: function(){
        var sliderWidth = this.slider.elt.width();
        var lr = this.slider.handles.map(function(item) { return parseFloat(item.css("left"))}).sortASC();
        var xLeft = lr[0];
        var xRight = lr[1];
        $(this.leftTailImage).css("left", Math.max(0, xLeft - this.leftTailImageWidth));
        $(this.rightTailImage).css("left", Math.min(sliderWidth - this.rightTailImageWidth, xRight));
    },
    run: function(){
        if (gNormalDistribuionCalculator == null){
            gNormalDistribuionCalculator = new NdCalc();
        }
        this.rightButtonZvalues = this.leftButtonZvalues.timesConst(-1).reverse();
        this.makeLeftImg();
        this.makeRightImg();
        this.slider = new DoubleSlider({
            min: this.zMin,
            max: this.zMax,
            values: [this.leftZ, this.rightZ],
            step: 0.01,
            id: "slider",
            callback: function(small, big){
                Figure511.actualSlideCallback.call(Figure511, small, big);
            },
            leftBackgroundColor: this.leftColor,
            rightBackgroundColor: this.rightColor
        });
        var slider = this.slider;
        var canvasId = this.canvasId;
        var cWidth = this.canvasWidth;
        var cHeight = this.canvasHeight;
        var upper = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(slider.html)) +
            HtmlGen.tr(HtmlGen.td(HtmlGen.div("", {"class": "positionRelative", id: "underneathSlider"})))
            ,{"class": "fullWidth"}
        );
        var lower = HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td("", {id: "leftButtonsTableParent", align: "left"}) +
                HtmlGen.td("", {id: "rightButtonsTableParent", align: "right"})
            ) + HtmlGen.tr(
                HtmlGen.td("", {id: "leftInputsTableParent", align: "left"}) +
                HtmlGen.td("", {id: "rightInputsTableParent", align: "right"})
            )
            , {id: "lowerTable", "class": "fullWidth"}
        );
        var canvasHtml = HtmlGen.canvas({id: canvasId, width: cWidth, height: cHeight});
        var html = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(upper)) +
            HtmlGen.tr(HtmlGen.td(canvasHtml)) +
            HtmlGen.tr(HtmlGen.td(lower))
            ,{id: "Figure511"}
        );
        gUniverseElt.html(html);
        slider.init();
        this.underneathSlider = $("#underneathSlider");
        this.underneathSlider.append(this.leftTailImage);
        this.underneathSlider.append(this.rightTailImage);
        this.underneathSlider.height(this.leftRightTailImageHeight);
        $(this.leftTailImage).addClass("positionAbsolute");
        $(this.rightTailImage).addClass("positionAbsolute");
        this.doLegend();
        this.canvas = $("#" + canvasId);
        this.ctx = this.canvas[0].getContext('2d');
        this.calcAreas();
        this.draw();
        this.leftButtonsTableParent = $("#leftButtonsTableParent");
        this.rightButtonsTableParent = $("#rightButtonsTableParent");
        this.leftInputsTableParent = $("#leftInputsTableParent");
        this.rightInputsTableParent = $("#rightInputsTableParent");
        this.makeButtons();
        this.makeButtonHandlers();
        this.makeInputs();
        this.scottify();
    },
    zScoreInputErrorFeedbackLeft: function(hasError){
        if (hasError){
            this.leftZInput.elt.addClass("errorBorder");
        } else {
            this.leftZInput.elt.removeClass("errorBorder");
        }
    },
    zScoreInputErrorFeedbackRight: function(hasError){
        if (hasError){
            this.rightZInput.elt.addClass("errorBorder");
        } else {
            this.rightZInput.elt.removeClass("errorBorder");
        }
    },
    zScoreInputErrorFeedback: function(which, hasError){
        if (which == "left"){
            this.zScoreInputErrorFeedbackLeft(hasError);
        }
        if (which == "right"){
            this.zScoreInputErrorFeedbackRight(hasError);
        }
        if (which == "both"){
            this.zScoreInputErrorFeedbackLeft(hasError);
            this.zScoreInputErrorFeedbackRight(hasError);
        }
    },
    leftAreaInputCallback: function(value, evt){
        //console.log("left area " + value);
        if (value >= gNormalDistribuionCalculator.minP && value < 1){
            this.leftZInput.setValue(gNormalDistribuionCalculator.inverseCdfStdNormal(value));
        }
    },
    rightAreaInputCallback: function(value, evt){
        //console.log("right area " + value);
        if (value >= gNormalDistribuionCalculator.minP && value < 1){
            this.rightZInput.setValue(gNormalDistribuionCalculator.inverseCdfStdNormal(value));
        }
    },
    leftZInputCallback: function(value, evt){
        if (isNaN(value)){
            this.zScoreInputErrorFeedback("left", true);
        } else {
            var value1 = value;
            var outOfRange = false;
            if (value > gNormalDistribuionCalculator.maxZ){
                value1 = gNormalDistribuionCalculator.maxZ;
                outOfRange = true;
            }
            if (value < gNormalDistribuionCalculator.minZ){
                value1 = gNormalDistribuionCalculator.minZ;
                outOfRange = true;
            }
            this.zScoreInputErrorFeedback("left", outOfRange);
            if (value1 == this.leftZ){
                return;
            }
            if (value1 > this.rightZ){
                this.rightZInput.setValue(value1);
                this.zScoreInputErrorFeedback("right", outOfRange);
            }
            this.setLeftZ(value1);
        }
    },
    rightZInputCallback: function(value, evt){
        if (isNaN(value)){
            this.zScoreInputErrorFeedback("right", true);
        } else {
            var value1 = value;
            var outOfRange = false;
            if (value > gNormalDistribuionCalculator.maxZ){
                value1 = gNormalDistribuionCalculator.maxZ;
                outOfRange = true;
            }
            if (value < gNormalDistribuionCalculator.minZ){
                value1 = gNormalDistribuionCalculator.minZ;
                outOfRange = true;
            }
            this.zScoreInputErrorFeedback("right", outOfRange);
            if (value1 == this.rightZ){
                return;
            }
            if (value1 < this.leftZ){
                this.leftZInput.setValue(value1);
                this.zScoreInputErrorFeedback("left", outOfRange);
            }
            this.setRightZ(value1);
        }
    },
    makeInputs: function(){
        this.leftInputsTableParent.html(this.makeInputsAux("leftInputs", "greenLabel", "greenTable", "Left Tail"));
        this.rightInputsTableParent.html(this.makeInputsAux("rightInputs", "blueLabel", "blueTable", "Right Tail"));
        this.leftZInputParent = this.leftInputsTableParent.find("#leftInputsTdZ");
        this.leftAreaInputParent = this.leftInputsTableParent.find("#leftInputsTdArea");
        this.rightZInputParent = this.rightInputsTableParent.find("#rightInputsTdZ");
        this.rightAreaInputParent = this.rightInputsTableParent.find("#rightInputsTdArea");
        var s = Options.Figure511.inputFieldSize;
        this.leftZInput = new nonTinyTextInput({
            parentElt: this.leftZInputParent,
            id: "leftZInput",
            atts: {size: s},
            callback: function(value, evt){
                Figure511.leftZInputCallback(value, evt);
            },
            value: Figure511.leftZ
        });
        this.rightZInput = new nonTinyTextInput({
            parentElt: this.rightZInputParent,
            id: "rightZInput",
            atts: {size: s},
            callback: function(value, evt){
                Figure511.rightZInputCallback(value, evt);
            },
            value: Figure511.rightZ
        });
        this.leftAreaInput = new nonNegativeNonTinyTextInput({
            parentElt: this.leftAreaInputParent,
            id: "leftAreaInput",
            atts: {size: s},
            callback: function(value, evt){
                Figure511.leftAreaInputCallback(value, evt);
            },
            value: Figure511.leftArea
        });
        this.rightAreaInput = new nonNegativeNonTinyTextInput({
            parentElt: this.rightAreaInputParent,
            id: "rightAreaInput",
            atts: {size: s},
            callback: function(value, evt){
                Figure511.rightAreaInputCallback(value, evt);
            },
            value: Figure511.rightArea
        });
    },
    makeInputsAux: function(id, labelClassName, tableClassName, title){
        var table = HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(HtmlGen.span("z-score", {"class": labelClassName}), {align: "right"}) +
                HtmlGen.td("", {id: id + "TdZ", align: "left"})
            ) + HtmlGen.tr(
                HtmlGen.td(HtmlGen.span("Area", {"class": labelClassName}), {align: "right"}) +
                HtmlGen.td("", {id: id + "TdArea", align: "left"})
            ), {id:id, "class": tableClassName}
        );
        return HtmlGen.fieldset(
            HtmlGen.legend(title) + table
        );
    },
    showErrorMsg: function(){
        alert("Left tail must be <= to the right tail.");
    },
    setLeftZ: function(z, btnElt){
        if (btnElt){
            // z changed by button click
            // must update slider and manual inputs
            this.zScoreInputErrorFeedback("left", false);
            if (this.slider.setLower(z) == "OK"){
                this.slideCallback(z, this.rightZ);
            } else {
                //this.showErrorMsg();
                var zSlider = z;
                if (z >= this.zMax){
                    zSlider = this.zMax;
                }
                if (this.slider.setUpper(zSlider, true) != "OK"){ console.log("unexpected error 1");}
                if (this.slider.setLower(zSlider, true) != "OK"){ console.log("unexpected error 2");}
                this.slideCallback(z, z);
                this.zScoreInputErrorFeedback("right", false);
            }
        } else {
            // z changed by manual input
            // must update slider only
            if (this.slider.setLower(z) == "OK"){
                this.zChange(z, this.rightZ);
            } else {
                //this.showErrorMsg();
                var zSlider = z;
                if (z >= this.zMax){
                    zSlider = this.zMax;
                }
                if (this.slider.setUpper(zSlider, true) != "OK"){ console.log("unexpected error 1");}
                if (this.slider.setLower(zSlider, true) != "OK"){ console.log("unexpected error 2");}
                this.zChange(z, z);
            }
        }
    },
    makeLeftButtonHandler: function(z){
        return function(){
            Figure511.setLeftZ(z, this);
        }
    },
    setRightZ: function(z, btnElt){
        if (btnElt){
            // z changed by button click
            // must update slider and manual inputs
            this.zScoreInputErrorFeedback("right", false);
            if (this.slider.setUpper(z) == "OK"){
                this.slideCallback(this.leftZ, z);
            } else {
                //this.showErrorMsg();
                var zSlider = z;
                if (z <= this.zMin){
                    zSlider = this.zMin;
                }
                if (this.slider.setLower(zSlider, true) != "OK"){ console.log("unexpected error 3");}
                if (this.slider.setUpper(zSlider, true) != "OK"){ console.log("unexpected error 4");}
                this.slideCallback(z, z);
                this.zScoreInputErrorFeedback("left", false);
            }
        } else {
            // z changed by manual input
            // must update slider only
            if (this.slider.setUpper(z) == "OK"){
                this.zChange(this.leftZ, z);
            } else {
                //this.showErrorMsg();
                var zSlider = z;
                if (z <= this.zMin){
                    zSlider = this.zMin;
                }
                if (this.slider.setLower(zSlider, true) != "OK"){ console.log("unexpected error 3");}
                if (this.slider.setUpper(zSlider, true) != "OK"){ console.log("unexpected error 4");}
                this.zChange(z, z);
            }
        }
    },
    makeRightButtonHandler: function(z){
        return function(){
            Figure511.setRightZ(z, this);
        }
    },
    makeButtonHandlers: function(){
        var THIS = this;
        this.leftButtons = this.leftButtonZvalues.map(function(z, index){
            var btnElt = THIS.leftButtonsTableParent.find("#leftBtn" + index);
            btnElt.click(THIS.makeLeftButtonHandler(z));
            return btnElt;
        });
        this.rightButtons = this.rightButtonZvalues.map(function(z, index){
            var btnElt = THIS.rightButtonsTableParent.find("#rightBtn" + index);
            btnElt.click(THIS.makeRightButtonHandler(z));
            return btnElt;
        });
    },
    makeButtons: function(){
        this.leftButtonsTableParent.html(this.makeButtonsAux("leftButtonsTable", "leftBtn", this.leftButtonCaptions, "Left Tail:"));
        this.rightButtonsTableParent.html(this.makeButtonsAux("rightButtonsTable", "rightBtn", this.rightButtonCaptions, "Right Tail:"));
    },
    makeButtonsAux: function(id, btnIdPrefix, captionsArr, title){
        var mainHtml = HtmlGen.table(
            HtmlGen.tr(
                captionsArr.map(function(caption, index){
                    return HtmlGen.td(HtmlGen.btn(caption, {id: btnIdPrefix + index}));
                }).join("")
            )
            , {id: id + "Main"}
        );
        return HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.th(title) +
                HtmlGen.td(mainHtml)
            )
        );
    },
    draw: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        var gap = this.zGap;
        var zMin = this.zMin;
        var zMax = this.zMax;
        var zMin1 = zMin - gap;
        var zMax1 = zMax + gap;
        var lowerVgap = this.distanceBellCurveAxisCanvasBottom;
        var temp = CANVAS.xAxis(ctx,
            { min: zMin1, axisMin: zMin, max: zMax1, axisMax: zMax, axisLabel: "", distanceFromBottom: lowerVgap }
        );
        var underAxisHeight = temp.distanceFromBottom;
        var overAxisHeight = this.distanceBellCurvePeakCanvasTop;
        var nonCurveHeight = underAxisHeight + overAxisHeight;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = 1/Math.sqrt(2*Math.PI);
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * underAxisHeight;
        var overAxisScaled = scaleFactor * overAxisHeight;
        // left
        var plotOptionsLeft = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: Math.min(this.leftZ, zMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.leftColor
        };
        this.leftFillPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptionsLeft);
        if (this.leftZ >= zMin){
            this.leftFillPlot.fillPlot();
        }
        // right
        var plotOptionsRight = {
            xMin: zMin1, xMinPlot: Math.max(this.rightZ, zMin), xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.rightColor
        };
        this.rightFillPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptionsRight);
        if (this.rightZ <= zMax){
            this.rightFillPlot.fillPlot();
        }
        // center
        var plotOptionsCenter = {
            xMin: zMin1, xMinPlot: Math.max(zMin, this.leftZ), xMax: zMax1, xMaxPlot: Math.min(this.rightZ, zMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.centerColor, borderColor: "black"
        };
        this.centerFillPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptionsCenter);
        this.centerFillPlot.fillPlot();
        // border
        var borderPlotOptions = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: "black"
        };
        this.borderCanvasPlot = new CanvasPlot(ctx, pdfStdNormal, borderPlotOptions);
        this.borderCanvasPlot.plot();
        // draw dashed line
        var x0 = this.borderCanvasPlot.xTrafo(0);
        var y0 = this.borderCanvasPlot.yTrafo(0);
        var y1 = this.borderCanvasPlot.yTrafo(maxDensity);
        this.ctx.strokeStyle = "black";
        CANVAS.dashedLine(ctx, x0, y0, x0, y1, [6,6]);
        var hGap = this.infoBoxDistanceHorizFringeToCanvasHorizFringe;
        var leftInfoBoxCenterX = hGap + this.infoBoxWidth/2;
        var rightInfoxBoxCenterY = this.canvasWidth - this.infoBoxWidth/2 - hGap;
        var infoY = this.infoBoxDistanceCenterToCanvasTop;
        this.drawInfoBox("Green Area", this.leftArea, this.leftZ, leftInfoBoxCenterX, infoY, this.leftColor);
        this.drawInfoBox("Blue Area", this.rightArea, this.rightZ, rightInfoxBoxCenterY, infoY, this.rightColor);
        this.drawInfoBox("Grey Area", this.centerArea, "invalid", this.canvasWidth/2, infoY, this.centerColor);
        ctx.textAlign = "center";
        ctx.font = this.titleFont;
        ctx.fillStyle = "black";
        ctx.fillText(this.title, this.canvasWidth/2, this.titleTopMargin);
        // draw axis again, because the ticks got covered in the meantime
        CANVAS.xAxis(ctx,
            { min: zMin1, axisMin: zMin, max: zMax1, axisMax: zMax, axisLabel: "", distanceFromBottom: lowerVgap }
        );
    },
    drawInfoBox: function(title, area, zScore, centerX, centerY, color){
        var ctx = this.ctx;
        var w = this.infoBoxWidth;
        var h = this.infoBoxHeight;
        var font = this.infoBoxFont;
        var fontBig = this.infoBoxHeadingFont;
        var areaFormat = this.infoBoxAreaFormat;
        var zFormat = this.infoBoxZscoreFormat;
        var hBox = h;
        if (zScore == "invalid"){
            hBox *= 0.75;
        }
        ctx.fillStyle = color;
        ctx.fillRect(centerX - w/2, centerY - h/2, w, hBox);
        ctx.fillStyle = "white";
        ctx.font = fontBig;
        ctx.textAlign = "center";
        ctx.fillText(title, centerX, centerY - 0.18*h);
        ctx.font = font;
        var areaStr = "Area = " + areaFormat.sprintf(area).trim();
        ctx.fillText(areaStr, centerX, centerY + 0.085*h);
        if (zScore == "invalid"){
            return;
        }
        var zStr = "z-score = " + zFormat.sprintf(zScore).trim();
        ctx.fillText(zStr, centerX, centerY + 0.32*h);
    },
    scottify: function(){
        var targetTable = this.slider.elt.parent().parent().parent().parent();
        var newTable1 = H.table00(
            H.tr(H.td("", {id: "leftZField", width: "50%"}) + H.tdRight("", {id: "rightZField", width: "50%"}))
            , {"class": "fullWidth"}
        );
        var newTable1a = H.table00(
            H.tr(
                H.td("Left tail must be &le; to the right tail", {id: "leftWarning", width: "50%", "class": "warning"}) +
                H.tdRight("Right tail must be &ge; to the left tail", {id: "rightWarning", width: "50%", "class": "warning"})
            )
            , {"class": "fullWidth"}
        );
        var newTable2 = H.table00(
            H.tr(H.td("", {id: "leftButtons", width: "50%"}) + H.tdRight("", {id: "rightButtons", width: "50%"}))
            , {"class": "fullWidth"}
        );
        var newTr1 = H.tr(H.td(newTable1, {"class": "fullWidth"}));
        var newTr1a= H.tr(H.td(newTable1a,{"class": "fullWidth"}));
        var newTr2 = H.tr(H.td(newTable2, {"class": "fullWidth"}));
        targetTable.append(newTr1);
        targetTable.append(newTr1a);
        targetTable.append(newTr2);
        var leftBtnsTable   = $("#leftButtonsTableParent").children().eq(0).detach();
        var rightBtnsTable = $("#rightButtonsTableParent").children().eq(0).detach();
        var leftAdoptiveParent = $("#leftButtons");
        var rightAdoptiveParent = $("#rightButtons");
        leftAdoptiveParent.append(leftBtnsTable);
        rightAdoptiveParent.append(rightBtnsTable);
        var leftAdoptiveChild = $("#leftZInput").detach();
        var rightAdoptiveChild = $("#rightZInput").detach();
        leftAdoptiveParent = $("#leftZField");
        rightAdoptiveParent = $("#rightZField");
        leftAdoptiveParent.append(leftAdoptiveChild);
        rightAdoptiveParent.append(rightAdoptiveChild);
        $("#lowerTable").parent().html("");
        //
        var upSymbol = HtmlSymbols.triagBigUp;
        var downSymbol = HtmlSymbols.triagBigDown;
        var leftPlus   = H.btn(upSymbol,   {id: "leftPlus",   "class": "plusMinusBtn"});
        var rightPlus  = H.btn(upSymbol,   {id: "rightPlus",  "class": "plusMinusBtn"});
        var leftMinus  = H.btn(downSymbol, {id: "leftMinus",  "class": "plusMinusBtn"});
        var rightMinus = H.btn(downSymbol, {id: "rightMinus", "class": "plusMinusBtn"});
        leftAdoptiveParent.append(leftPlus).append(leftMinus);
        rightAdoptiveParent.append(rightPlus).append(rightMinus);
        $("#leftPlus").click(  this.makeLeftPlusHandler());
        $("#rightPlus").click( this.makeRightPlusHandler());
        $("#leftMinus").click( this.makeLeftMinusHandler());
        $("#rightMinus").click(this.makeRightMinusHandler());
    },
    makeLeftPlusHandler: function(){
        return function(){
            var oldZ = Figure511.leftZ;
            var stepping = Options.Figure511.stepping;
            var newZ = oldZ + stepping;
            newZ = stepping * Math.round(newZ/stepping);
            if (newZ > Figure511.rightZ){
                return;
            }
            Figure511.setLeftZ(newZ, null);
            var format = Options.Figure511.format;
            Figure511.leftZInput.setValue(newZ, format);
        }
    },
    makeRightPlusHandler: function(){
        return function(){
            var oldZ = Figure511.rightZ;
            var stepping = Options.Figure511.stepping;
            var newZ = oldZ + stepping;
            newZ = stepping * Math.round(newZ/stepping);
            Figure511.setRightZ(newZ, null);
            var format = Options.Figure511.format;
            Figure511.rightZInput.setValue(newZ, format);
        }
    },
    makeLeftMinusHandler: function(){
        return function(){
            var oldZ = Figure511.leftZ;
            var stepping = Options.Figure511.stepping;
            var newZ = oldZ - stepping;
            newZ = stepping * Math.round(newZ/stepping);
            Figure511.setLeftZ(newZ, null);
            var format = Options.Figure511.format;
            Figure511.leftZInput.setValue(newZ, format);
        }
    },
    makeRightMinusHandler: function(){
        return function(){
            var oldZ = Figure511.rightZ;
            var stepping = Options.Figure511.stepping;
            var newZ = oldZ - stepping;
            newZ = stepping * Math.round(newZ/stepping);
            if (newZ < Figure511.leftZ){
                return;
            }
            Figure511.setRightZ(newZ, null);
            var format = Options.Figure511.format;
            Figure511.rightZInput.setValue(newZ, format);
        }
    }
};
/*******************************************************************************************************
 F63 (Example of a Sampling Distribution of Means)
*******************************************************************************************************/
F63 = {
    numShowing: 1,
    width: 500,
    title: "Example of a Sampling Distribution of Means",
    People: {
        Judy: 20,
        Mark: 18,
        Sam: 21,
        Lora: 22,
        John: 24
    },
    Samples: [
        ["Judy", "Judy"],
        ["Judy", "Mark"],
        ["Judy", "Sam"],
        ["Judy", "Lora"],
        ["Judy", "John"],
        ["Mark", "Judy"],
        ["Mark", "Mark"],
        ["Mark", "Sam"],
        ["Mark", "Lora"],
        ["Mark", "John"],
        ["Sam", "Judy"],
        ["Sam", "Mark"],
        ["Sam", "Sam"],
        ["Sam", "Lora"],
        ["Sam", "John"],
        ["Lora", "Judy"],
        ["Lora", "Mark"],
        ["Lora", "Sam"],
        ["Lora", "Lora"],
        ["Lora", "John"],
        ["John", "Judy"],
        ["John", "Mark"],
        ["John", "Sam"],
        ["John", "Lora"],
        ["John", "John"],
    ],
    makeMainTable: function(){
        var sum = 0;
        var content = H.tr(H.th("Sample Number ...") + H.th("...includes") + H.th("...has a " + H.overBar("x") + " age of"));
        for (var row=1; row<=this.Samples.length; row++){
            var sample = this.Samples[row-1];
            var age1 = this.People[sample[0]];
            var age2 = this.People[sample[1]];
            var xbar = 0.5*(age1 + age2);
            var xbarFo = "%4.1f".sprintf(xbar);
            var includes = "{" + sample[0] + ", " + sample[1] + "}";
            if (row <= this.numShowing){
                content += H.tr(H.tdCenter(row, {id: "sampNum" + row}) + H.tdCenter(includes, {id: "includes" + row}) + H.tdCenter(xbarFo));
                sum += xbar;
            } else {
                content += H.tr(H.tdCenter("&nbsp;", {id: "sampNum" + row}) + H.tdCenter("&nbsp;", {id: "includes" + row}) + H.tdCenter("&nbsp;"));
            }
        }
        var meanOfMeans = sum / this.numShowing;
        var momfo = "%5.2f".sprintf(meanOfMeans);
        //var mu = H.withIndex("&mu;", H.overBar("x"));
        var mu = '&mu;<sub style="font-size: 100%">x&#772;</sub>';
        content += H.tr(H.th("The mean of the sampling means (" +mu+ ") is:", {colspan: 2}) + H.th(momfo, {id: "meanOfMeans"}), {id: "meanOfMeansRow"});
        return H.table00(content, {id: "mainTable", width: this.width});
    },
    makeHtml: function(){
        function w(content, id){
            if (arguments.length < 1)
                return H.tr(H.td(content));
            return H.tr(H.td(content, {id: id}));
        }
        var head = H.table(H.tr(H.td(this.title, {"class": "title"})), {align: "center"});
        var addIndexLbl = H.span("", {id: "addIndexLbl", "class": "addRemove"});
        var addBtn = H.btn("Add Sample Number: " + addIndexLbl, {id: "addBtn"});
        var removeIndexLbl = H.span("", {id: "removeIndexLbl", "class": "addRemove"});
        var removeBtn = H.btn("Remove Sample Number: " + removeIndexLbl, {id: "removeBtn"});
        var btns = H.table(H.tr(H.tdCenter(addBtn) + H.tdCenter(removeBtn)), {"class": "fullWidth"});
        return H.table(w(head) + w(btns) + w(this.makeMainTable(), "mainTableParentTd"), {id: "F63"});
    },
    run: function(){
        gUniverseElt.html(this.makeHtml());
        this.fixSpacing();
        this.fixButtonCaptions();
        $("#addBtn").click(function(){
            F63.numShowing++;
            $("#mainTableParentTd").html(F63.makeMainTable());
            F63.fixButtonCaptions();
            F63.fixSpacing();
        });
        $("#removeBtn").click(function(){
            F63.numShowing--;
            $("#mainTableParentTd").html(F63.makeMainTable());
            F63.fixButtonCaptions();
            F63.fixSpacing();
        });
    },
    fixSpacing: function(){
        var elts = $("#mainTable tr");
        var index = elts.length - 2;
        var tds = elts.eq(index).find("td");
        tds.css("padding-bottom", 10);
    },
    fixButtonCaptions: function(){
        if (this.numShowing < this.Samples.length){
            $("#addIndexLbl").html(this.numShowing + 1);
            $("#addBtn")[0].removeAttribute("disabled");
            //$("#addBtn").css("color", "");
        } else {
            $("#addIndexLbl").html("");
            $("#addBtn")[0].setAttribute("disabled", "disabled");
            //$("#addBtn").css("color", "#999");
        }
        if (this.numShowing >= 2){
            $("#removeIndexLbl").html(this.numShowing);
            $("#removeBtn")[0].removeAttribute("disabled");
            //$("#removeBtn").css("color", "");
            //$("#removeBtn").css("cursor", "");
        } else {
            $("#removeIndexLbl").html("");
            $("#removeBtn")[0].setAttribute("disabled", "disabled");
            //$("#removeBtn").css("color", "#999");
            //$("#removeBtn").css("cursor", "default");
        }
    }
};
/*******************************************************************************************************
F87 Comparison of Two-Tailed Critical Values
*******************************************************************************************************/
F87 = {
    arrowHeadLength: 15,
    arrowThickness: 8,
    zColor: "#555",
    tColor: "#22f",
    gap: 0.3,
    zMin: -5,
    zMax: 5,
    maxSampleSize: 250,
    distanceBellCurveAxisCanvasBottom: 35,
    distanceBellCurvePeakCanvasTop: 1,
    canvasWidth: 700,
    canvasHeight: 400,
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: ["&alpha; = .01", "&alpha; = .05", "&alpha; = .10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    sampleSize: 5,
    sampleSliderMove: function(value){
        this.app.sampleSize = value;
        this.valElt.html(value);
        this.app.draw();
    },
    alphaButtonClick: function(i){
        this.app.draw();
    },
    run: function(){
        if (gNormalDistribuionCalculator == null){
            gNormalDistribuionCalculator = new NdCalc();
        }
        this.SPDF = new StudentPDF(this.maxSampleSize);
        var alphaButtonBar = new ButtonBar({
            buttonLabels: this.alphaButtonCaptions,
            headerLabel: "Set the Desired Value of &alpha;:",
            headerClass: "lineBreakDisabled",
            headerStyle: {"padding-right": "10px"},
            selectedIndex: this.initiallyChosenAlphaIndex,
            idPrefix: "alpha",
            name: "alphaButtonBar",
            app: this,
            //tableStyle: {"background-color": "rgb(199, 199, 199)"},
            btnClass: "alphaButton",
            callback: this.alphaButtonClick
        });
        var btns = alphaButtonBar.html;
        var btnsTable = H.table(H.tr(H.td(btns, {"class": "fullWidth"})));
        var slider = new Slider({min: 5, max: this.maxSampleSize, step: 1, value: this.sampleSize, id: "sampleSizeSlider", callback: this.sampleSliderMove});
        var leftSpacer = H.td("", {"class": "leftSliderTableSpacer"});
        var sliderTable = H.table(
            H.tr(
                H.thLeft("Adjust the Sampe Size:", {"class": "lineBreakDisabled"}) + leftSpacer +
                H.td(slider.html, {"class": "fullWidth"}) + 
                H.tdRight("", {id: "sampleSizeSliderValue", "class": "sliderValue"})
            ), {id: "sliderTable", "class": "fullWidth"}
        );
        var canv = H.canvas({width: this.canvasWidth, height: this.canvasHeight, id: "canvas"});
        var topCanvasCaption = H.table(
            H.tr(H.tdCenter("Comparison of Two-Tailed Critical Values", {id: "infoRow1"})) +
            H.tr(H.tdCenter("", {id: "infoRow2"}))
            , {id: "topCanvasCaptionTable", align: "center"}
        );
        var html = H.table(
            H.trtd(btns) + H.trtd(sliderTable) + H.trtd(topCanvasCaption) + H.trtd(canv)
            , {id: "F87"}
        );
        gUniverseElt.html(html);
        slider.init();
        alphaButtonBar.init();
        slider.valElt = $("#sampleSizeSliderValue");
        slider.app = this;
        slider.valElt.html(this.sampleSize);
        this.ctx = $("#canvas")[0].getContext('2d');
        this.draw();
    },
    draw: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        var gap = this.gap;
        var zMin = this.zMin;
        var zMax = this.zMax;
        var zMin1 = zMin - gap;
        var zMax1 = zMax + gap;
        var lowerVgap = this.distanceBellCurveAxisCanvasBottom;
        var temp = CANVAS.xAxis(ctx,
            { min: zMin1, axisMin: zMin, max: zMax1, axisMax: zMax, axisLabel: "",
            distanceFromBottom: lowerVgap, minorStep: 1, majorStep: 1 }
        );
        var labels = temp.labels;
        var underAxisHeight = temp.distanceFromBottom;
        var overAxisHeight = this.distanceBellCurvePeakCanvasTop;
        var nonCurveHeight = underAxisHeight + overAxisHeight;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = 1/Math.sqrt(2*Math.PI);
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * underAxisHeight;
        var overAxisScaled = scaleFactor * overAxisHeight;
        // zPlot
        var zPlotOptions = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.zColor, lineWidth: 2
        };
        this.zCanvasPlot = new CanvasPlot(ctx, pdfStdNormal, zPlotOptions);
        this.zCanvasPlot.plot();
        // tPlot
        var tPlotOptions = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.tColor, lineWidth: 2
        };
        var studentTpdf = this.SPDF.getPDF(this.sampleSize - 1);
        this.tCanvasPlot = new CanvasPlot(ctx, studentTpdf, tPlotOptions);
        this.tCanvasPlot.plot();
        //
        var alpha = this.alphaButtonValues[this.alphaButtonBar.selectedIndex];
        var degreesOfFreedom = this.sampleSize - 1;
        var tCrit = studentTcritical[this.alphaLookup[this.alphaButtonBar.selectedIndex]][degreesOfFreedom];
        var zCrit = Math.abs(gNormalDistribuionCalculator.inverseCdfStdNormal(alpha/2));
        // left and right vertical z lines
        this.ctx.strokeStyle = this.zColor;
        var xCenter = this.zCanvasPlot.xTrafo(0);
        var xLeftZ = this.zCanvasPlot.xTrafo(-zCrit);
        var xRightZ = this.zCanvasPlot.xTrafo(zCrit);
        var y0 = this.zCanvasPlot.yTrafo(0);
        var yz = this.zCanvasPlot.yTrafo(maxDensity * 0.45);
        CANVAS.dashedLine(ctx, xLeftZ, y0, xLeftZ, yz, [6,6]);
        CANVAS.dashedLine(ctx, xRightZ, y0, xRightZ, yz, [6,6]);
        // left and right vertical t lines
        this.ctx.strokeStyle = this.tColor;
        var xLeftT = this.zCanvasPlot.xTrafo(-tCrit);
        var xRightT = this.zCanvasPlot.xTrafo(tCrit);
        var yt = this.zCanvasPlot.yTrafo(maxDensity * 0.55);
        CANVAS.dashedLine(ctx, xLeftT, y0, xLeftT, yt, [6,6]);
        CANVAS.dashedLine(ctx, xRightT, y0, xRightT, yt, [6,6]);
        // arrows and text between them, z
        this.ctx.strokeStyle = "black";
        ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(xCenter - 12, yz + 27); ctx.lineTo(xCenter - 3, yz + 27); ctx.stroke(); // minus of plusminus
        this.ctx.strokeStyle = this.zColor;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        var yz_ = yz + 28;
        var text = "z = + " + "%5.3f".sprintf(zCrit);
        ctx.fillText(text, xCenter, yz_);
        var tw = ctx.measureText(text).width;
        var delta = 4;
        dY = 5;
        var ahl = this.arrowHeadLength;
        var thick = this.arrowThickness;
        CANVAS.leftArrow(ctx, yz_ - dY, xCenter - tw/2 - delta, xLeftZ + 1, ahl, thick, this.zColor, 1.5);
        CANVAS.rightArrow(ctx, yz_ - dY, xRightZ - 1, xCenter + tw/2 + delta, ahl, thick, this.zColor, 1.5);
        // arrows and text between them, t
        this.ctx.strokeStyle = "black";
        var ymi = -22;
        ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(xCenter - 14, yz + ymi); ctx.lineTo(xCenter - 5, yz + ymi); ctx.stroke(); // minus of plusminus
        this.ctx.strokeStyle = this.tColor;
        ctx.textAlign = "center";
        //ctx.fillStyle = "black";
        var yt_ = yt + 15;
        var text2 = "t = + " + "%5.3f".sprintf(tCrit);
        ctx.fillText(text2, xCenter, yt_);
        var tw2 = ctx.measureText(text2).width;
        var delta = 4;
        dY = 5;
        CANVAS.leftArrow(ctx, yt_ - dY, xCenter - tw2/2 - delta, xLeftT + 1, ahl, thick, this.tColor, 1.5);
        CANVAS.rightArrow(ctx, yt_ - dY, xRightT - 1, xCenter + tw2/2 + delta, ahl, thick, this.tColor, 1.5);
        $("#infoRow2").html("for " + H.italic("t") + " and " + H.italic("z") +
            " with &alpha; = " + "%4.2f".sprintf(alpha) + " and " + degreesOfFreedom + " df");
    }
};

/*******************************************************************************************************
 F111 (towards F test)
*******************************************************************************************************/
F111 = {
    dotRadius: 6,
    meanLineLength: 80,
    meanLineThickness: 3,
    grandMeanDashing: [4, 4],
    grandMeanColor: "#000",
    grandMeanFont: "10pt Arial",
    grandMeanLineThickness: 3,
    canvasFont: "bold 12pt Arial",
    yAxisLabel: "Number of Tweets",
    canvasHeight: 380,
    maxTweets: 20,
    times: ["September 2010", "October 2010", "November 2010", "December 2010"],
    data : [
        {
            name: "Conservative",
            initialTweets: [8,5,6,3],
            color: Options.F111.conservativeColor,
            color3: Options.F111.conservativeTextColor
        },
        {
            name: "Liberal",
            initialTweets: [15,14,13,9],
            color: Options.F111.liberalColor,
            color3: Options.F111.liberalTextColor
        },
        {
            name: "NDP",
            initialTweets: [19,14,18,8],
            color: Options.F111.ndpColor,
            color3: Options.F111.ndpTextColor
        }
    ],
    run: function(){
        var maxTweets = this.maxTweets;
        var times = this.times;
        var data = this.data;
        var opts = UTIL.range(1, maxTweets);
        var optsHtml = opts.map(function(choice){return H.option(choice); }).join("");
        function makeSelector(idSel, idTd, color, last, nonFirst){
            var className = "tbody";
            if (last){
                className += " lastColumn";
            } else {
                className += " notLastColumn";
            }
            if (nonFirst){
                className += " notFirstColumn";
            }
            var atts = {"class": className, id: idTd, style: Style.toString({"background-color": color})};
            return H.tdCenter(H.sel(optsHtml, {id: idSel}), atts);
        }
        function makeRow(timeIndex){
            var trContent = H.thLeft(times[timeIndex], {"class": "lineBreakDisabled rowHead upper", id: "rowHead" + timeIndex});
            for (var i=0; i<data.length; i++){
                var crimeFamily = data[i];
                crimeFamily.tweets = crimeFamily.initialTweets.concat([]); // copy so we can reset later
                var idTrunk = crimeFamily.name + timeIndex;
                var idSel = idTrunk + "Selector";
                var idTd = idTrunk + "Td";
                trContent += makeSelector(idSel, idTd, crimeFamily.color, i == data.length - 1, i != 0);
            }
            return H.tr(trContent, {id: "row" + timeIndex});
        }
        var upperTrs = UTIL.range(0, times.length-1).map(makeRow).join("");
        function makeLowerRow(title, idTrunk, argColor){
            var className = "lineBreakDisabled rowHead lower";
            var trContent = H.thLeft(title, {"class": className, id: idTrunk + "RowHead"});
            for (var i=0; i<data.length; i++){
                var crimeFamily = data[i];
                var id = crimeFamily.name + idTrunk;
                var color = arguments.length < 3 ? crimeFamily.color3: argColor;
                var tdClassName = "summaryBody";
                var last = ( i == data.length - 1);
                if (last){
                    tdClassName += " lastColumn";
                }
                trContent += H.tdCenter("", {id: id, style: Style.toString({color: color}), "class": tdClassName})
            }
            return H.tr(trContent, {id: "row" + idTrunk});
        }
        var lowerTrs = [
            makeLowerRow("Mean", "Mean"),
            makeLowerRow("Variance", "Var"),
            makeLowerRow("Sample Size", "SaSi"),
            makeLowerRow("Grand Mean", "Grand", "black")
        ].join("");
        var btnRowContent = H.th("", {id: "emptyTopLeftCorner"});
        for (var i=0; i<data.length; i++){
            var crimeFamily = data[i];
            var id = crimeFamily.name + "Button";
            var color = crimeFamily.color3;
            var btn = H.btn(crimeFamily.name, {id: id, style: Style.toString({color: color}), "class": "crimeFamilyButton"});
            btnRowContent += H.tdCenter(btn, {id: id + "Td", "class": "buttonTd"});
        }
        var btnRow = H.tr(btnRowContent, {id: "buttonRow"});
        var main = H.table00(btnRow + upperTrs + lowerTrs, {id: "mainTable"});
        var canvasTd = H.td("", {id: "canvasTd"});
        var html = H.table00(
            H.tr(canvasTd + H.td("", Style.attachToAtts({id: "grandMeanCanvasLabel"}, {display: "block"}))) +
            H.tr(H.td(main) + H.td(""))
            , {id: "F111"}
        );
        gUniverseElt.html(html);
        this.grandMeanCanvasLabel = $("#grandMeanCanvasLabel");
        if (navigator.userAgent.indexOf("Firefox") != -1){
            //$("table#F111 table#mainTable select").css({"padding-top": "1px"})
        }
        var width = $("table#F111 table#mainTable").width();
        var canvasHtml = H.canvas({id: "canvas", width: width, height: this.canvasHeight, style: "display: block;"});
        $("table#F111 td#canvasTd").html(canvasHtml);
        var ctx = $("table#F111 td#canvasTd canvas#canvas")[0].getContext("2d");
        this.ctx = ctx;
        var parentLeft = $("table#F111").offset().left;
        function getSelectorSettings(){
            var times = this.app.times;
            var result = new Array(times.length);
            for (var t=0; t<times.length; t++){
                result[t] = this.sel[t][0].selectedIndex + 1;
            }
            return result;
        }
        function setSelectors(values){
            if (arguments.length < 1){
                values = this.tweets;
            }
            for (var t=0; t<values.length; t++){
                this.sel[t][0].selectedIndex = values[t] - 1;
            }
        }
        function setRandom(){
            var rands = new Array(this.tweets.length);
            for (var t=0; t<rands.length; t++){
                rands[t] = 1 + Math.floor(Math.random() * this.app.maxTweets);
            }
            this.set(rands);
            this.tweets = rands;
        }
        function btnClick(){
            var elt = $(this);
            var myIndex = elt.attr("data-index");
            THIS.data[myIndex].setRandom();
            THIS.action();
        }
        var THIS = this;
        for (var i=0; i<data.length; i++){
            var crimeFamily = data[i];
            var name = crimeFamily.name;
            var id = name + "Button";
            var color = crimeFamily.color3;
            var btnElt = $("#" + id);
            crimeFamily.btn = btnElt;
            var w = btnElt.width();
            var bLeft = btnElt.offset().left;
            var x = bLeft - parentLeft + w/2;
            crimeFamily.x = x;
            crimeFamily.sel = new Array(this.times.length);
            for (var t=0; t<this.times.length; t++){
                var sId = name + t + "Selector";
                crimeFamily.sel[t] = $("#" + sId);
                crimeFamily.sel[t].change(function(){
                    THIS.action();
                });
            }
            crimeFamily.app = this;
            crimeFamily.get = getSelectorSettings;
            crimeFamily.set = setSelectors;
            crimeFamily.set();
            crimeFamily.setRandom = setRandom;
            btnElt.attr("data-index", i);
            btnElt.click(btnClick);
            crimeFamily.meanTd  = $("#" + name + "Mean");
            crimeFamily.varTd   = $("#" + name + "Var");
            crimeFamily.SaSiTd  = $("#" + name + "SaSi");
            crimeFamily.GrandTd = $("#" + name + "Grand");
        }
        crimeFamily = data[data.length - 1];
        var resetBtn = H.btn("Reset All", {id: "resetButton"});
        crimeFamily.GrandTd.html(resetBtn);
        $("#resetButton").click(function(){
            F111.run();
        });
        this.action();
    },
    action: function(){
        var data = this.data;
        function withBarAndIndex(letter, index){
            //return H.withIndex(H.overBar(H.italic(letter)), index);
            //return H.withIndex(H.overBar(letter), index);
            //return H.overlineSpan(H.withIndex(H.italic(letter), index));
            //return H.withIndex(H.overlineSpan(H.italic(letter)), index);
            if (navigator.userAgent.indexOf("Chrome") != -1){
                return H.withIndex(H.overlineSpan(letter), index);
            } else {
                return H.overlineSpan(H.withIndex(H.italic(letter), index));
            }            
        }
        function withIndex(letter, index){
            return H.withIndex(H.italic(letter), index);
        }
        function withIndexSquared(letter, index){
            return H.withIndex(H.italic(letter), index) + H.sup("2");
        }
        function xWithBarAndIndex(index){
            return withBarAndIndex("x", index);
        }
        function nWithIndex(index){
            return withIndex("n", index);
        }
        function sWithIndexSquared(index){
            return withIndexSquared("s", index);
        }
        var grandTotal = 0;
        var grandSampleSize = 0;
        for (var i=0; i<data.length; i++){
            var familyIndex = i + 1;
            var crimeFamily = data[i];
            var color = crimeFamily.color3;
            var currentTweets = crimeFamily.get();
            var mean = currentTweets.mean();
            var meanFo = "%5.2f".sprintf(mean);
            crimeFamily.mean = mean;
            crimeFamily.meanFo = meanFo;
            crimeFamily.meanTd.html(xWithBarAndIndex(familyIndex) + " = " + meanFo);
            var variance = currentTweets.varianceE();
            var variFo = "%5.2f".sprintf(variance);
            crimeFamily.variance = variance;
            crimeFamily.variFo = variFo;
            crimeFamily.varTd.html(sWithIndexSquared(familyIndex) + " = " + variFo);
            var sampleSize = crimeFamily.sel.length;
            crimeFamily.sampleSize = sampleSize;
            crimeFamily.SaSiTd.html(nWithIndex(familyIndex) + " = " + sampleSize);
            grandTotal += currentTweets.sum();
            grandSampleSize += sampleSize;
        }
        var grandMean = grandTotal / grandSampleSize;
        var grandMeanFo = "%5.2f".sprintf(grandMean);
        this.grandMean = grandMean;
        this.grandMeanFo = grandMeanFo;
        crimeFamily = data[0];
        //var xDoubleBar = H.overlineSpan(H.overBar("x"));
        //crimeFamily.GrandTd.html(xDoubleBar + " = " + grandMean);
        var itx = H.italic("x");
        itx = "x";
        var pad = (navigator.userAgent.indexOf("Chrome") != -1) ? 3 : 1;
        var thickness = (navigator.userAgent.indexOf("Chrome") != -1) ? 1 : 2;
        crimeFamily.GrandTd.html(H.table00(H.tr(
            H.td(H.overlineSpan(itx), Style.toAtts({"border-top": thickness + "px solid black", "padding-top": pad + "px"})) +
            H.td(" = " + grandMeanFo, Style.toAtts({"padding-left": "5px"}))
        )))
        this.repaint();
    },
    repaint: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var maxTweets = this.maxTweets;
        // yAxis
        var epsLo = 0.05;
        var epsHi = 0.04;
        var yMin = -epsLo * maxTweets;
        var yMax = (1 + epsHi) * maxTweets;
        var dfl = 62;   // distance of y axis from the left canvas edge
        var axisOptions = {
            min: yMin, max: yMax, axisMin: 0, axisMax: maxTweets,
            distanceFromLeft: dfl, labelLeftOfAxisWhenLeftGapGreaterThan: 0, narrowness: 0.6,
            axisLabel: this.yAxisLabel, labelFont: "bold 12pt Arial"
        };
        var temp = CANVAS.yAxis(ctx, axisOptions);
        var y0 = temp.trafo(0);
        var x0 = dfl;
        // xAxis
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(ctx.canvas.width, y0);
        ctx.stroke();
        var data = this.data;
        var h = 20;
        for (var i=0; i<data.length; i++){
            var crimeFamily = data[i];
            var color = crimeFamily.color3;
            var x = crimeFamily.x;
            // marker on axis
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y0 - h/2);
            ctx.lineTo(x, y0 + h/2);
            ctx.stroke();
            // dots
            var tw = crimeFamily.get();
            crimeFamily.tweets = tw;
            ctx.fillStyle = color;
            for (var t=0; t<tw.length; t++){
                var y = temp.trafo(tw[t]);
                ctx.beginPath();
                ctx.arc(x, y, this.dotRadius, 0, 2*Math.PI);
                ctx.fill();
            }
            // mean line
            y = temp.trafo(crimeFamily.mean);
            var x0 = x - this.meanLineLength/2;
            var x1 = x + this.meanLineLength/2;
            ctx.lineWidth = this.meanLineThickness;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
            ctx.stroke();
            // mean line text
            ctx.textAlign = "right";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = this.canvasFont;
            ctx.fillText(crimeFamily.meanFo, x0 - 8, y + 5);
        }
        // grand mean line
        y = temp.trafo(this.grandMean);
        x0 = dfl;
        x1 = ctx.canvas.width;
        ctx.lineWidth = this.grandMeanLineThickness;
        ctx.strokeStyle = this.grandMeanColor;
        CANVAS.dashedLine(ctx, x0, y, x1, y, this.grandMeanDashing);
        // grand mean numerical
        this.grandMeanCanvasLabel.html(this.grandMeanFo);
        this.grandMeanCanvasLabel.css("padding-top", y - 11);
        // grand mean label
        ctx.font = this.grandMeanFont;
        ctx.textAlign = "left";
        ctx.fillStyle = "black";
        ctx.fillText("Grand Mean", x0 + 6, y - 6);
    }
};
/*******************************************************************************************************
 Figure79 (Two Tailed Hypothesis Test)
*******************************************************************************************************/
var Figure79 = {
    backgroundColor: "white",
    title: "Example of Two-Tailed Hypothesis Test",
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    canvasWidth : 700,
    canvasHeight : 431,
    canvasId : "theCanvas",
    canvasElt : null,
    ctx : null,
    distMeanSlider : null,
    distStdSlider : null,
    sampleMeanSlider : null,
    sliderTableId : "sliderTable",
    sliderTableElt : null,
    zMin: -3.6,
    zMax: 3.6,
    zGap: 0.3,
    initialDistMean: 15,
    initialDistStd: 0.27,
    initialChosenAlphaIndex: 1,
    initialSampleZ : 0,
    leftZ: -1,
    rightZ: 1,
    distanceBellCurveAxisCanvasBottom: 70,
    distanceBellCurvePeakCanvasTop: 126,
    vLineExcess: 35,
    failToRejectAboveMax: 18,
    resultAboveFailToReject: 46,
    rejectGap: 21,
    leftColor: "rgb(153, 0, 0)",
    rightColor: "rgb(153, 0, 0 )",
    centerColor: "rgb(217, 217, 217)",
    resultColor: "#555",
    arrowHeadLength: 15,
    arrowThickness: 8,
    sampleMeanDotColor: "blue",
    sampleMeanDotRadius: 4,
    sampleMeanFont: "11pt Arial",
    resultFont: "14pt Arial",
    //nullHypImgSrc: "data:image/png; .. deleted to save space
    //nullHypImg: null,
    //initNullHypImg: function(){
    //    this.nullHypImg = new Image();
    //    this.nullHypImg.src = this.nullHypImgSrc;
    //},
    distMeanSliderMove: function(value){
        this.distMean = value;
        this.remakeSampleMeanSlider();
        this.draw();
    },
    distStdSliderMove: function(value){
        this.distStd = value;
        this.remakeSampleMeanSlider();
        this.draw();
    },
    sampleMeanSliderMove: function(value){
        var z = (value - this.distMean) / this.distStd;
        this.sampleMean = value;
        this.sampleZ = z;
        this.draw();
    },
    makeSampleMeanSlider: function(z0){
        var step = this.distStd <= 0.08 ? 0.001 : (this.distStd <= 0.02 ? 0.005 : 0.01);
        this.sampleZ = z0;
        var delta = 0.3;
        var zMin = this.zMin + delta;
        var zMax = this.zMax - delta;
        var min = this.distMean + zMin * this.distStd;
        var max = this.distMean + zMax * this.distStd;
        min = step * Math.round(min / step);
        max = step * Math.round(max / step);
        var value = this.distMean + z0 * this.distStd;
        value = Math.round(value/step) * step;
        this.sampleMean = value;
        this.sampleMeanSlider = new Slider({min: min, max: max, value: value, step: step, id: "sampleMeanSlider", callback: function(value){Figure79.sampleMeanSliderMove.call(Figure79, value);}});
        return HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.th("Sample&nbsp;Mean&nbsp;Value:") +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.td(this.sampleMeanSlider.html, {"class": "fullWidth"}) +
                HtmlGen.td("", {"class": "spacer"})
            ) , {"class": "fullWidth", id: "sampleMeanSliderTable"}
        );
    },
    remakeSampleMeanSlider: function(){
        var parentElt = this.sampleMeanSliderTableElt.parent();
        parentElt.html(this.makeSampleMeanSlider(this.sampleZ));
        this.sampleMeanSliderTableElt = parentElt.find("#sampleMeanSliderTable");
        this.sampleMeanSlider.adjustTableCss(this.sampleMeanSliderTableElt);
        this.sampleMeanSlider.init();
    },
    makeDistSliders: function(){
        this.distMeanSlider = new Slider({min: -20, max: 20, value: this.distMean, id: "distMeanSlider", callback: function(value){Figure79.distMeanSliderMove.call(Figure79, value);}});
        this.distStdSlider = new Slider({min: 0.01, max: 3, value: this.distStd, id: "distStdSlider", callback: function(value){Figure79.distStdSliderMove.call(Figure79, value);}});
        function sliderRow(label, sliderDiv){
            return HtmlGen.tr(
                HtmlGen.thLeft(label) +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.td(sliderDiv, {"class": "fullWidth"}) +
                HtmlGen.td("", {"class": "spacer"})
            );
        }
        //var label1 = HtmlGen.table(HtmlGen.trtd("Distribution") + HtmlGen.trtd("Mean&nbsp;Value"));
        //var label2 = HtmlGen.table(HtmlGen.trtd("Distribution") + HtmlGen.trtd("Std&nbsp;Dev"));
        var label1 = "&mu;"
        var label2 = "&sigma;"
        var tdReset = H.td(H.btn("Reset", {id: "resetMuSigma"}));
        var t1 = HtmlGen.table(
            sliderRow(label1, this.distMeanSlider.html)
            , {"class": "fullWidth", id: "distMeanSliderTable"}
        );
        var t2 = HtmlGen.table(
            sliderRow(label2, this.distStdSlider.html)
            , {"class": "fullWidth", id: "distStdSliderTable"}
        );
        return HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(t1, {width: "50%"}) + HtmlGen.td(t2, {width: "50%"}) + tdReset
            )
            , {"class": "fullWidth", id: this.sliderTableId}
        );
    },
    setAlpha: function(i){
        this.chosenAlphaIndex = i;
        this.alpha = this.alphaButtonValues[i];
        this.zCritical = this.zValues[i];
        this.leftZ = -this.zCritical;
        this.rightZ = this.zCritical;
        var rejectString = "%4.2f".sprintf(this.alpha);
        this.rejectAreaElt.html(rejectString);
        var failString = "%4.2f".sprintf(1 - this.alpha);
        this.failAreaElt.html(failString);
        this.alphaTableElt.find("button").removeClass("bold");
        this.alphaButtons[i].addClass("bold");
        this.draw();
    },
    makeAlphaSelector: function(){
        var spacer = HtmlGen.td("", {"class": "spacer"});
        var lbl = HtmlGen.td("Alpha&nbsp;Value:", {"class": "bold"});
        var btns = this.alphaButtonCaptions.map(function(alpha, index){
            return HtmlGen.td(HtmlGen.btn("&alpha;&nbsp;=&nbsp;" + alpha, {id: "alphaButton" + index}));
        }).join("");
        var rejectTd = HtmlGen.td("Reject&nbsp;Area&nbsp;=&nbsp;" + HtmlGen.span("", {id: "rejectArea"}), {"class": "bold"});
        var failTd = HtmlGen.td("Fail&nbsp;to&nbsp;Reject&nbsp;Area&nbsp;=&nbsp;" + HtmlGen.span("", {id: "failArea"}), {"class": "bold"});
        return HtmlGen.table(HtmlGen.tr(lbl + btns + spacer + rejectTd + spacer + failTd), {id: "alphaTable"});
    },
    makeAlphaButtonHandler: function(index){
        return function(){
            Figure79.setAlpha(index);
        };
    },
    makeAlphaButtonHandlers: function(){
        this.alphaButtons = [];
        for (var i=0; i<this.alphaButtonValues.length; i++){
            var btn = $("#alphaButton" + i);
            this.alphaButtons.push(btn);
            btn.click(this.makeAlphaButtonHandler(i));
        }
    },
    run: function(){
        this.run1(this.initialDistMean, this.initialDistStd, this.initialSampleZ, this.initialChosenAlphaIndex);
    },
    run1: function(distMean, distStd, sampleZ, chosenAlphaIndex){
        this.distMean = distMean;
        this.distStd = distStd;
        if (gNormalDistribuionCalculator == null){
            gNormalDistribuionCalculator = new NdCalc();
        }
        this.zValues = this.alphaButtonValues.map(function(alpha){ return -gNormalDistribuionCalculator.inverseCdfStdNormal(alpha/2); })
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var canvasId = this.canvasId;
        var canvHtml = HtmlGen.canvas({width: canvasWidth, height: canvasHeight, id: canvasId});
        var itH = H.italic("H");
        var itmu = H.italic("&mu;");
        var itA = H.italic("A");
        var nullHypotString = H.withIndex(itH, "0") + ":&nbsp; " + H.withIndex(itmu, itA) + " = " + H.withIndex(itmu, "0");
        var leftOverCanvasInfo = H.span("", {id: "leftOverCanvasInfo", "class": "overCanvasInfo"});
        var midOverCanvasInfo = H.span(nullHypotString , {id: "midOverCanvasInfo", "class": "overCanvasInfo"});
        var rightOverCanvasInfo = H.span("", {id: "rightOverCanvasInfo", "class": "overCanvasInfo"});
        var canvasParent = H.div(
            canvHtml + leftOverCanvasInfo + midOverCanvasInfo + rightOverCanvasInfo
            , {id: "canvasParent", style: "position: relative; z-index: 0;"}
        );
        var distSliders = this.makeDistSliders();
        var alphaSelector = this.makeAlphaSelector();
        var smSlider = this.makeSampleMeanSlider(sampleZ);
        gUniverseElt.html(HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(this.title), {align: "center", "class": "bold blue"}) +
            HtmlGen.trtd(distSliders) +
            HtmlGen.trtd(alphaSelector, {id: "alphaSelectorTd"}) +
            HtmlGen.trtd(smSlider) +
            HtmlGen.trtd(canvasParent)
        , {cellSpacing: 0, cellPadding: 0, id: "Figure79"}));
        this.canvasElt = $("#" + canvasId); 
        this.ctx = this.canvasElt[0].getContext('2d');
        if (!this.ctx){
            alert('you have to use a newer browser to view this page');
            return;
        }
        //
        this.distMeanSlider.init();
        this.distStdSlider.init();
        this.sampleMeanSlider.init();
        this.sliderTableElt = $("#" + this.sliderTableId);
        this.sampleMeanSliderTableElt = $("#sampleMeanSliderTable");
        this.distMeanSlider.adjustTableCss(this.sliderTableElt);
        this.sampleMeanSlider.adjustTableCss(this.sampleMeanSliderTableElt);
        $("#alphaTable").parent().css("background-color", this.backgroundColor);
        this.rejectAreaElt = $("#rejectArea");
        this.failAreaElt = $("#failArea");
        this.alphaTableElt = $("#alphaTable");
        this.makeAlphaButtonHandlers();
        //this.initNullHypImg();
        $("#resetMuSigma").click(this.resetMuSigmaClick);
        this.setAlpha(chosenAlphaIndex);
        var midInfoWidth = 130;
        $("#midOverCanvasInfo").css({
            width: midInfoWidth,
            height: 27,
            left: this.canvasWidth/2 - midInfoWidth/2,
            top: 13,
            textAlign: "center"
        });
    },
    resetMuSigmaClick: function(){
        Figure79.resetMuSigma();
    },
    resetMuSigma: function(){
        this.run1(this.initialDistMean, this.initialDistStd, this.sampleZ, this.chosenAlphaIndex);
    },
    draw: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        var gap = this.zGap;
        var zMin = this.zMin;
        var zMax = this.zMax;
        var zMin1 = zMin - gap;
        var zMax1 = zMax + gap;
        var lowerVgap = this.distanceBellCurveAxisCanvasBottom;
        var temp = CANVAS.xAxis(ctx,
            { min: zMin1, axisMin: zMin, max: zMax1, axisMax: zMax, axisLabel: "", distanceFromBottom: lowerVgap, minorStep: 1, majorStep: 1, distNumberLabelsAxis: 37 }
        );
        var labels = temp.labels;
        ctx.font = temp.font;
        ctx.textAlign = "center";
        for (var i=0; i<labels.length; i++){
            var lbl = labels[i];
            ctx.fillText("%5.2f".sprintf(this.distMean + this.distStd * lbl.x), lbl.txtX, lbl.txtY - 18);
        }
        var underAxisHeight = temp.distanceFromBottom;
        var overAxisHeight = this.distanceBellCurvePeakCanvasTop;
        var nonCurveHeight = underAxisHeight + overAxisHeight;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = 1/Math.sqrt(2*Math.PI);
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * underAxisHeight;
        var overAxisScaled = scaleFactor * overAxisHeight;
        // left
        var plotOptionsLeft = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: Math.min(this.leftZ, zMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.leftColor
        };
        this.leftFillPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptionsLeft);
        if (this.leftZ >= zMin){
            this.leftFillPlot.fillPlot();
        }
        // right
        var plotOptionsRight = {
            xMin: zMin1, xMinPlot: Math.max(this.rightZ, zMin), xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.rightColor
        };
        this.rightFillPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptionsRight);
        if (this.rightZ <= zMax){
            this.rightFillPlot.fillPlot();
        }
        // center
        var plotOptionsCenter = {
            xMin: zMin1, xMinPlot: Math.max(zMin, this.leftZ), xMax: zMax1, xMaxPlot: Math.min(this.rightZ, zMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.centerColor, borderColor: "black"
        };
        this.centerFillPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptionsCenter);
        this.centerFillPlot.fillPlot();
        // border
        var borderPlotOptions = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: "black"
        };
        this.borderCanvasPlot = new CanvasPlot(ctx, pdfStdNormal, borderPlotOptions);
        this.borderCanvasPlot.plot();
        // draw dashed line
        var x00 = this.borderCanvasPlot.xTrafo(0);
        var x0 = x00;
        var x0 = this.borderCanvasPlot.xTrafo(0);
        var y0 = this.borderCanvasPlot.yTrafo(0);
        var y1 = this.borderCanvasPlot.yTrafo(maxDensity);
        this.ctx.strokeStyle = "black";
        CANVAS.dashedLine(ctx, x0, y0, x0, y1, [6,6]);
        // left vertical line
        var xLeft = this.borderCanvasPlot.xTrafo(this.leftZ);
        y1 -= this.vLineExcess;
        ctx.beginPath();
        ctx.moveTo(xLeft, y0);
        ctx.lineTo(xLeft, y1);
        ctx.stroke();
        // right vertical line
        var xRight = this.borderCanvasPlot.xTrafo(this.rightZ);
        ctx.beginPath();
        ctx.moveTo(xRight, y0);
        ctx.lineTo(xRight, y1);
        ctx.stroke();
        // fail to reject text with arrows
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        var yFailToReject = this.borderCanvasPlot.yTrafo(maxDensity) - this.failToRejectAboveMax;
        var ftr = "Fail to Reject";
        ctx.fillText(ftr, x00, yFailToReject);
        var ftrWidth = ctx.measureText(ftr).width;
        var delta = 4;
        dY = 5;
        var ahl = this.arrowHeadLength;
        var thick = this.arrowThickness;
        CANVAS.leftArrow(ctx, yFailToReject - dY, x00 - ftrWidth/2 - delta, xLeft + 1, ahl, thick);
        CANVAS.rightArrow(ctx, yFailToReject - dY, xRight - 1, x00 + ftrWidth/2 + delta, ahl, thick);
        // half alpha text
        var yAlpha = this.borderCanvasPlot.yTrafo(maxDensity * 0.6);
        var alphaString = "/2 = %5.3f".sprintf(this.alpha/2);
        var alphaStringWidth = ctx.measureText(alphaString).width;
        //ctx.clearRect(xLeft - 0.5*alphaStringWidth, yAlpha - ahl, alphaStringWidth, 19);
        //ctx.fillText(alphaString, xLeft, yAlpha);
        //CANVAS.alphaChar(ctx, xLeft - 0.5*alphaStringWidth-8, yAlpha-5, 0.35);
        //ctx.clearRect(xRight - 0.5*alphaStringWidth, yAlpha - ahl, alphaStringWidth, 19);
        //ctx.fillText(alphaString, xRight, yAlpha);
        //CANVAS.alphaChar(ctx, xRight - 0.5*alphaStringWidth-8, yAlpha-5, 0.35);
        var alphaInfoHeight = 20;
        var alphaInfoDeltaTop = 16;
        var alphaLabelWidth = alphaStringWidth + 20;
        $("#leftOverCanvasInfo").css({
            width: alphaLabelWidth,
            height: alphaInfoHeight,
            left: xLeft - alphaLabelWidth/2,
            top: yAlpha - alphaInfoDeltaTop,
            "background-color": "white",
            "padding-top": "2px",
            "white-space":  "nowrap"
        });
        $("#leftOverCanvasInfo").html("&alpha;" + alphaString);
        $("#rightOverCanvasInfo").css({
            width: alphaLabelWidth,
            height: alphaInfoHeight,
            left: xRight - alphaLabelWidth/2,
            top: yAlpha - alphaInfoDeltaTop,
            "background-color": "white",
            "padding-top": "2px",
            "white-space":  "nowrap"
        });
        $("#rightOverCanvasInfo").html("&alpha;" + alphaString);
        // reject arrows
        var rejectY = this.borderCanvasPlot.yTrafo(maxDensity);
        CANVAS.leftArrow(ctx, rejectY, xLeft, this.rejectGap, ahl, thick, "red", 1);
        CANVAS.rightArrow(ctx, rejectY, ctx.canvas.width - this.rejectGap, xRight, ahl, thick, "red", 1);
        var txt = "Reject";
        var rejw = ctx.measureText(txt).width;
        // reject text left
        ctx.clearRect(this.rejectGap + ahl + 8, rejectY-12, rejw + 4, 19);
        //console.log([this.rejectGap + ahl + 8, rejectY, rejw + 4, 19].join(",   "));
        ctx.fillStyle = "black";
        ctx.textAlign = "start";
        ctx.fillText(txt, this.rejectGap + ahl + 10, rejectY + 4);
        ctx.textAlign = "end";
        ctx.clearRect(ctx.canvas.width - this.rejectGap - ahl - 10 - rejw - 2, rejectY-12, rejw + 4, 19);
        ctx.fillText(txt, ctx.canvas.width - this.rejectGap - ahl - 10, rejectY + 4);
        // blue dot
        var blueX = this.borderCanvasPlot.xTrafo(this.sampleZ);
        ctx.fillStyle = this.sampleMeanDotColor;
        ctx.beginPath();
        ctx.arc(blueX, y0, this.sampleMeanDotRadius, 0, 2*Math.PI);
        ctx.fill();
        // blue sample mean info
        ctx.textAlign = "center";
        ctx.font = this.sampleMeanFont;
        txt = "x = " + "%5.2f".sprintf(this.sampleMean).trim();
        var w = ctx.measureText(txt).width;
        var sampMeanTxtY = ctx.canvas.height - 17;
        ctx.fillText(txt, blueX, sampMeanTxtY);
        ctx.fillText("z = %4.2f".sprintf(this.sampleZ), blueX, ctx.canvas.height - 1);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        var barY = sampMeanTxtY - 10;
        var barX0 = blueX - w/2 - 1;
        var barX1 = barX0 + 10;
        ctx.moveTo(barX0, barY);
        ctx.lineTo(barX1, barY);
        ctx.stroke();
        // result info
        var beliefInNull = this.sampleZ >= this.leftZ && this.sampleZ <= this.rightZ;
        var resultStr = beliefInNull ? "Result: Fail to Reject the Null" : "Result: Reject the Null";
        var yResult = yFailToReject - this.resultAboveFailToReject;
        ctx.fillStyle = this.resultColor;
        ctx.font = this.resultFont;
        ctx.textAlign = "center";
        ctx.fillText(resultStr, ctx.canvas.width/2, yResult);
        // null hypothesis cation from image
        //var sourceWidth = this.nullHypImg.width;
        //var sourceHeight = this.nullHypImg.height;
        //var targetWidth = sourceWidth;
        //var targetHeight = sourceHeight;
        //var targetX = ctx.canvas.width/2 - targetWidth / 2;
        //var targetY = yResult - 23 - targetHeight;
        //ctx.drawImage(this.nullHypImg, 0, 0, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
        // draw axis again
        CANVAS.xAxis(ctx,
            { min: zMin1, axisMin: zMin, max: zMax1, axisMax: zMax, axisLabel: "", distanceFromBottom: lowerVgap, minorStep: 1, majorStep: 1, distNumberLabelsAxis: 37 }
        );
    }
};
/*******************************************************************************************************
 Figure 102 (2 independent samples comparison of means t-test)
*******************************************************************************************************/
F102 = {
    groupInitialValues : [
        {
            mean: 3.5,
            vari: 2,
            sampSize: 30
        },
        {
            mean: 3.5,
            vari: 2,
            sampSize: 30
        }
    ],
    alphaButtonValues: [0.01, 0.05, 0.1],
    //alphaButtonCaptions: ["&alpha; = 0.01", "&alpha; = 0.05", "&alpha; = 0.10"],
    alphaButtonCaptions: ["0.01", "0.05", "0.10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    alphaButtonWidth: 50,
    leftColor: "rgb(255, 180, 180)",
    rightColor: "rgb(255, 180, 180)",
    centerColor: "white",
    leftT: -2,
    rightT: 2,
    tGap: 0.3,
    tMin: -4.4,
    tMax: 4.4,
    distanceBellCurveAxisCanvasBottom: 53,
    distanceBellCurvePeakCanvasTop: 2,
    dotRadius: Options.F102.dotRadius,
    dotColor: "green",
    id: "F102",
    formats: {
        mean: "%4.2f",
        variance:  "%4.2f",
        t:  "%5.3f",
        ci: "%4.2f"
    },
    sliderValueEltMinWidth: 40,
    canvasWidth: 820,
    canvasHeight: 380,
    colHeadColors: ["red", "blue"],
    groups: null,
    greenFont: "11pt Arial",
    canvasIndexFont: "9pt Arial",
    makeMathLeft: function(){
        var container = this.top.find("#mathLeft");
        function bar(what, index){
            return M._overBar3(M._sub(M.i(what), M.n(index))); 
        }
        function ind(what, index){
            return M._sub(M.i(what), M.n(index)); 
        }
        var x1m = bar("x", 1);
        var x2m = bar("x", 2);
        var s1 = ind("s", 1);
        var s2 = ind("s", 2);
        var n1 = ind("n", 1);
        var n2 = ind("n", 2);
        var numerator = x1m + M.minus + x2m;
        var s1s = M._squared(s1);
        var s2s = M._squared(s2);
        var n1Recip = M._frac(M.one, n1);
        var n2Recip = M._frac(M.one, n2);
        var n11 = M._withParens(n1 + M.minus + M.one);
        var n21 = M._withParens(n2 + M.minus + M.one);
        var n122 = M._withParens(n1 + M.plus + n2 + M.minus + M.two);
        var subNumerator = n11 + s1s + M.plus + n21 + s2s;
        var factor1 = M._frac(subNumerator, n122);
        var factor2 = M._withParens(n1Recip + M.plus + n2Recip);
        var radicant = factor1 + M.cross + factor2;
        var denom = M.sqrt(radicant);
        var rhs = M._frac(numerator, denom);
        var formula = M.row(M.i("t") + M.equals + rhs);
        container.html(M.mathBlockRight(formula));
    },
    makeMathRight: function(color1, color2, x1Val, x2Val, s1Val, s2Val, n1Val, n2Val, resultVal){
        var container = this.top.find("#mathRight");
        var sty1 = {style: "color: " + color1 + ";"};
        var sty2 = {style: "color: " + color2 + ";"};
        var x1 = M.n(x1Val, sty1);
        var x2 = M.n(x2Val, sty2);
        var s1 = M.n(s1Val, sty1);
        var s2 = M.n(s2Val, sty2);
        var n1 = M.n(n1Val, sty1);
        var n2 = M.n(n2Val, sty2);
        var numerator = x1 + M.minus + x2;
        var n1Recip = M._frac(M.one, n1);
        var n2Recip = M._frac(M.one, n2);
        var n11 = M._withParens(n1 + M.minus + M.one);
        var n21 = M._withParens(n2 + M.minus + M.one);
        var n122 = M._withParens(n1 + M.plus + n2 + M.minus + M.two);
        var subNumerator = n11 + s1 + M.plus + n21 + s2;
        var factor1 = M._frac(subNumerator, n122);
        var factor2 = M._withParens(n1Recip + M.plus + n2Recip);
        var radicant = factor1 + M.cross + factor2;
        var denom = M.sqrt(radicant);
        var lhs = M._frac(numerator, denom);
        var formula = M.row(M.equals + lhs + M.equals + M.n(resultVal));
        container.html(M.mathBlockLeft(formula));
    },
    updateMath: function(){
        var x1 = this.groups[0].sliMean.get();
        var x2 = this.groups[1].sliMean.get();
        var s1 = this.groups[0].sliVari.get();
        var s2 = this.groups[1].sliVari.get();
        var n1 = this.groups[0].sliSampSize.get();
        var n2 = this.groups[1].sliSampSize.get();
        var degreesOfFreedom = n1 + n2 - 2;
        var pooled = ((n1-1)*s1 + (n2-1)*s2)/degreesOfFreedom;
        var variance = pooled * (1/n1 + 1/n2);
        var std = Math.sqrt(variance);
        var meanDiff = x1 - x2;
        var result = meanDiff / std;
        var resultFormatted = this.formats.t.sprintf(result).trim();
        this.makeMathRight(this.colHeadColors[0], this.colHeadColors[1], x1, x2, s1, s2, n1, n2, resultFormatted);
        M.render();
        this.meanDiff = meanDiff;
        this.std = std;
        this.df = degreesOfFreedom;
        var tCritical = studentTcritical[this.alphaLookup[this.chosenAlphaIndex]][degreesOfFreedom];
        this.leftT = -tCritical;
        this.rightT = tCritical;
        this.t = result;
    },
    callbacks: {
        mean: function(slider, value){
            //console.log("mean, group " + (slider.group.index+1) + ", value " + value);
            slider.valueElt.html(value);
        },
        variance: function(slider, value){
            //console.log("variance, group " + (slider.group.index+1) + ", value " + value);
            slider.valueElt.html(value);
        },
        sampSize: function(slider, value){
            //console.log("samp size, group " + (slider.group.index+1) + ", value " + value);
            slider.valueElt.html(value);
        }
    },
    sliderCallback: function(val){
        this.group.obj.callbacks[this.sliderType].call(this.group.obj, this, val);
        this.group.obj.updateMath();
        this.group.obj.repaint();
    },
    makeSliderHtml: function(initialValues){
        var colHeads = new Array(2);
        var groups = new Array(2);
        for (var i=0; i<=1; i++){
            var colHead = H.th("Group " + (i+1) + "&nbsp;&nbsp;&nbsp;", {colspan: 4, style: "color: " +this.colHeadColors[i]+ ";"});
            colHeads[i] = colHead;
            var sliMean     = new Slider({min: 1, max: 5,   value: initialValues[i].mean,     step: 0.01, id: "grp" + i + "MeanSlider", callback: this.sliderCallback});
            var sliVari     = new Slider({min: 1, max: 3,   value: initialValues[i].vari,     step: 0.01, id: "grp" + i + "VariSlider", callback: this.sliderCallback});
            var sliSampSize = new Slider({min: 2, max: 120, value: initialValues[i].sampSize, step: 1,    id: "grp" + i + "SampSizeSlider", callback: this.sliderCallback});
            var group = {
                sliMean: sliMean,
                sliVari: sliVari,
                sliSampSize: sliSampSize,
                index: i,
                obj: this
            }
            groups[i] = group;
            sliMean.group = group;
            sliVari.group = group;
            sliSampSize.group = group;
            sliMean.sliderType = "mean";
            sliVari.sliderType = "variance";
            sliSampSize.sliderType = "sampSize";
            groups[i].get = function(){
                return {
                    mean: this.sliMean.get(),
                    vari: this.sliVari.get(),
                    sampSize: this.sliSampSize.get()
                }
            }
        }
        function sliderRow(label, sliDiv1, valId1, sliDiv2, valId2){
            return H.tr(
                H.thRight(H.span(label, {"class": "lineBreakDisabled"})) +
                H.td("", {"class": "spacer"}) +
                H.td(sliDiv1, {width: "50%"}) +
                //H.td("", {"class": "spacer"}) +
                H.tdRight("", {id: valId1}) +
                H.td("", {"class": "spacer"}) +
                H.td(sliDiv2, {width: "50%"}) +
                //H.td("", {"class": "spacer"}) +
                H.tdRight("", {id: valId2})
            );
        }
        var btnSty = "width: 85%;";
        var btn1 = H.btn("Reset All", {id: "resetAllBtn", style: btnSty});
        var btn2 = H.btn("Reset Group 1", {id: "resetG1Btn", style: btnSty});
        var btn3 = H.btn("Reset Group 2", {id: "resetG2Btn", style: btnSty});
        var empty = H.td("");
        function resetBtnTd(b){
            return H.tdCenter(b);
        }
        var resetRow = H.tr(resetBtnTd(btn1) + empty + resetBtnTd(btn2) + empty + empty + resetBtnTd(btn3) + empty);
        var html = H.table(
            H.tr(H.th("") + colHeads[0] + colHeads[1]) +
            sliderRow("Sample Means:"    , groups[0].sliMean.html,     "mean0", groups[1].sliMean.html, "mean1") +
            sliderRow("Sample Variances:", groups[0].sliVari.html,     "vari0", groups[1].sliVari.html, "vari1") +
            sliderRow("Sample Sizes:"    , groups[0].sliSampSize.html, "sampSize0", groups[1].sliSampSize.html, "sampSize1") +
            H.tr("", {height: Options.F102.xtraSpaceBetweenSlidersAndResetButtons}) +
            resetRow
            , {"class": "fullWidth", id: "sliderTable"}
        );
        this.groups = groups;
        return html;
    },
    makeAlphaButtonHandler: function(index){
        return function(){
            if (F102.chosenAlphaIndex == index){
                return;
            }
            F102.chosenAlphaIndex = index;
            F102.updateMath();
            F102.repaint();
            var elt = $(this);
            elt.parents("table").first().find("button").removeClass("bold").width(F102.alphaButtonWidth);
            elt.addClass("bold");
        }
    },
    alphaButtonsTableHtml: function(){
        var THIS = this;
        return H.table(
            H.tr(H.th("Alpha (&alpha;) Value", {"class": "lineBreakDisabled"})) + 
            this.alphaButtonValues.map(function(alpha, index){
                return H.tr(H.tdCenter(H.btn(THIS.alphaButtonCaptions[index], {id: "alphaButton" + index, "class": "lineBreakDisabled alphaButton"})));
            }).join("")
        );
    },
    makeHtml: function(initialValues){
        var upper = H.table(
            H.tr(
                H.td(this.makeSliderHtml(initialValues), {"class": "fullWidth"}) +
                H.td(this.alphaButtonsTableHtml())
            )
            , {"class": "fullWidth", id: "upper"}
        );
        //var reset = H.table(H.tr(
        //    H.td(btn1) + H.td(btn2) + H.td(btn3)
        //), {id: "resetTable"});
        var reset = "deletme";
        var math = H.table(
            H.tr(
                H.tdRight("x", {id: "mathLeft", width: "45%"}) +
                H.tdLeft("", {id: "mathRight", width: "55%"})
            ), {id: "mathTable", "class": "fullWidth", style: Style.toString({"margin-top": Options.F102.aBitMoreSpaceBetweenFormulaAndResetButtons})}
        );
        var canv = H.canvas({id: "canvas", width: this.canvasWidth, height: this.canvasHeight});
        var leftOverCanvasInfo = H.span("", {id: "leftOverCanvasInfo", "class": "overCanvasInfo"});
        var midOverCanvasInfo = H.span("", {id: "midOverCanvasInfo", "class": "overCanvasInfo"});
        var rightOverCanvasInfo = H.span("", {id: "rightOverCanvasInfo", "class": "overCanvasInfo"});
        var canvasParent = H.div(
            canv + leftOverCanvasInfo + midOverCanvasInfo + rightOverCanvasInfo
            , {id: "canvasParent", style: "position: relative; z-index: 0;"}
        );
        return H.table00(
            H.tr(H.td(upper)) +
            //H.tr(H.td(reset)) +
            H.tr(H.td(math, {id: "mathParentTd", "class": "fullWidth"})) +
            H.tr(H.td(canvasParent))
            , {id: this.id}
        );
    },
    run: function(){
        this.run1(this.groupInitialValues);
    },
    run1: function(initialValues){
        gUniverseElt.html(this.makeHtml(initialValues));
        for (var i=0; i<= 1; i++){
            var g = this.groups[i];
            g.sliMean.init();
            g.sliVari.init();
            g.sliSampSize.init();
            g.sliMean.valueElt = $("#mean" + i);
            g.sliVari.valueElt = $("#vari" + i);
            g.sliSampSize.valueElt = $("#sampSize" + i);
            g.sliMean.valueElt.css("min-width", this.sliderValueEltMinWidth);
            g.sliVari.valueElt.css("min-width", this.sliderValueEltMinWidth);
            g.sliSampSize.valueElt.css("min-width", this.sliderValueEltMinWidth);
            this.callbacks.mean.call(    this, g.sliMean,     g.sliMean.get());
            this.callbacks.variance.call(this, g.sliVari,     g.sliVari.get());
            this.callbacks.sampSize.call(this, g.sliSampSize, g.sliSampSize.get());
        }
        this.canvas = $("#canvas");
        this.ctx = this.canvas[0].getContext('2d');
        var top = $("#" + this.id);
        this.top = top;
        var sliderTable = top.find("#sliderTable");
        this.sliderTable = sliderTable;
        this.groups[0].sliMean.adjustTableCss(sliderTable);
        this.makeMathLeft();
        var THIS = this;
        //this.scheduledCall = window.setInterval(function(){ THIS.fixMathAlignment(); }, 1000);
        this.updateMath();
        this.repaint();
        $("table#F102 .alphaButton").width(this.alphaButtonWidth);
        $("table#F102 #alphaButton" + this.chosenAlphaIndex).addClass("bold");
        //hookup alpha button handlers
        for (var i=0; i<this.alphaButtonValues.length; i++){
            var btnElt = $("#alphaButton" + i);
            btnElt.click(this.makeAlphaButtonHandler(i));
        }
        $("#leftOverCanvasInfo").css({
            width: 237,
            height: 50,
            left: 55,
            top: 30
        });
        var midInfoWidth = 80;
        $("#midOverCanvasInfo").css({
            width: midInfoWidth,
            height: 20,
            left: this.canvasWidth/2 - midInfoWidth/2,
            top: this.axisPosition - 28,
            textAlign: "center"
        });
        $("#rightOverCanvasInfo").css({
            width: this.canvasWidth*0.33,
            height: 30,
            left: this.canvasWidth * 0.66,
            top: 33
        });
        $("#resetAllBtn").click(function(){
            F102.resetAll();
        });
        $("#resetG1Btn").click(function(){
            F102.resetGroup1();
        });
        $("#resetG2Btn").click(function(){
            F102.resetGroup2();
        });
        var grey = $("#sliderTable").css("background-color");
        $("#resetTable").css("background-color", grey);
        $("#resetTable").parent().css("background-color", grey);
        $("#upper").css("background-color", grey);
        $("#F102").css("border", "3px solid " + grey);
    },
    fixMathAlignment: function(){
        //leftMath = $("#"+this.id+ " #mathLeft .MathJax_Display")
        //leftMath.css("text-align", "right");
        //rightMath = $("#"+this.id+ " #mathRight .MathJax_Display")
        //rightMath.css("text-align", "left");
    },
    repaint: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        var gap = this.tGap;
        var tMin = this.tMin;
        var tMax = this.tMax;
        var tMin1 = tMin - gap;
        var tMax1 = tMax + gap;
        var lowerVgap = this.distanceBellCurveAxisCanvasBottom;
        function makeThexAxis(){
            return CANVAS.xAxis(ctx, {
                    min: tMin1, axisMin: tMin, max: tMax1, axisMax: tMax,
                    axisLabel: "", distanceFromBottom: lowerVgap,
                    minorStep: 1, majorStep: 1, distNumberLabelsAxis: 18
                }
            );
        }
        var temp = makeThexAxis();
        var labels = temp.labels;
        //ctx.font = temp.font;
        ctx.font = Options.F102.lowerXAxisLabelsFont;
        ctx.textAlign = "center";
        ctx.fillStyle = Options.F102.lowerXAxisLabelsColor;
        for (var i=0; i<labels.length; i++){
            var lbl = labels[i];
            var lblValue = this.std * lbl.x;
            var lblValueString = lbl.x == 0 ? "0" : "%5.2f".sprintf(lblValue);
            ctx.fillText(lblValueString, lbl.txtX, lbl.txtY + 18);
        }
        var underAxisHeight = temp.distanceFromBottom;
        var overAxisHeight = this.distanceBellCurvePeakCanvasTop;
        var nonCurveHeight = underAxisHeight + overAxisHeight;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = 1;
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * underAxisHeight;
        var overAxisScaled = scaleFactor * overAxisHeight;
        var v = this.df;
        function studentPdf(t){
            // without the normalizing constant, which we don't need due to lack of y axis labels
            var exponent = -(v+1)/2;
            return Math.pow(1 + t*t/v, exponent);
        }
        // left
        var plotOptionsLeft = {
            xMin: tMin1, xMinPlot: tMin, xMax: tMax1, xMaxPlot: Math.min(this.leftT, tMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.leftColor
        };
        this.leftFillPlot = new CanvasPlot(ctx, studentPdf, plotOptionsLeft);
        if (this.leftT >= tMin){
            this.leftFillPlot.fillPlot();
        }
        // right
        var plotOptionsRight = {
            xMin: tMin1, xMinPlot: Math.max(this.rightT, tMin), xMax: tMax1, xMaxPlot: tMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.rightColor
        };
        this.rightFillPlot = new CanvasPlot(ctx, studentPdf, plotOptionsRight);
        if (this.rightT <= tMax){
            this.rightFillPlot.fillPlot();
        }
        // center
        var plotOptionsCenter = {
            xMin: tMin1, xMinPlot: Math.max(tMin, this.leftT), xMax: tMax1, xMaxPlot: Math.min(this.rightT, tMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.centerColor, borderColor: "black"
        };
        this.centerFillPlot = new CanvasPlot(ctx, studentPdf, plotOptionsCenter);
        this.centerFillPlot.fillPlot();
        // border
        var borderPlotOptions = {
            xMin: tMin1, xMinPlot: tMin, xMax: tMax1, xMaxPlot: tMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: "black"
        };
        this.borderCanvasPlot = new CanvasPlot(ctx, studentPdf, borderPlotOptions);
        this.borderCanvasPlot.plot();
        // left vertical line
        ctx.strokeStyle = "black";
        var xLeft = this.borderCanvasPlot.xTrafo(this.leftT);
        var y0 = this.borderCanvasPlot.yTrafo(0);
        this.axisPosition = y0;
        var y1 = this.borderCanvasPlot.yTrafo(0.4);
        ctx.beginPath();
        ctx.moveTo(xLeft, y0);
        ctx.lineTo(xLeft, y1);
        ctx.stroke();
        // right vertical line
        var xRight = this.borderCanvasPlot.xTrafo(this.rightT);
        ctx.beginPath();
        ctx.moveTo(xRight, y0);
        ctx.lineTo(xRight, y1);
        ctx.stroke();
        // t critical labels
        ctx.fillStyle = "black";
        var yT = y1-6;
        var tFormatted = this.formats.t.sprintf(this.rightT).trim();
        var tPlus = "+" + tFormatted;
        var tMinus = "-" + tFormatted;
        var tPlusWidth = ctx.measureText(tPlus).width;
        var tMinusWidth = ctx.measureText(tMinus).width;
        ctx.fillText(tMinus, xLeft, yT);
        ctx.fillText(tPlus, xRight, yT);
        // green dot
        var greenX = this.borderCanvasPlot.xTrafo(this.t);
        ctx.fillStyle = this.dotColor;
        ctx.beginPath();
        ctx.arc(greenX, y0, this.dotRadius, 0, 2*Math.PI);
        ctx.fill();
        // green sample means diff info
        ctx.textAlign = "center";
        ctx.font = this.greenFont;
        txt = "x    x  = " + "%4.2f".sprintf(this.meanDiff);
        var w = ctx.measureText(txt).width;
        var txtY = ctx.canvas.height - 19;
        //ctx.fillText(txt, greenX, txtY);
        ctx.fillText("t = %5.3f".sprintf(this.t), greenX, ctx.canvas.height - 1);
        /*ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        var barY = txtY - 10;
        var barX0 = greenX - w/2 - 1;
        var barX1 = barX0 + 12;
        ctx.moveTo(barX0, barY);
        ctx.lineTo(barX1, barY);
        ctx.stroke();
        ctx.font = this.canvasIndexFont;
        ctx.fillText("1", barX0 + 12, barY + 15);
        ctx.fillText("2", barX0 + 35, barY + 15);
        ctx.moveTo(barX0 + 15, barY + 6);
        ctx.lineTo(barX1 + 11, barY + 6);
        ctx.stroke();
        barX0 += 23;
        var barX1 = barX0 + 12;
        ctx.moveTo(barX0, barY);
        ctx.lineTo(barX1, barY);
        ctx.stroke();*/
        //
        var eltLeft = $("#leftOverCanvasInfo");
        var mu1 = "&mu;" + H.sub(1);
        var mu2 = "&mu;" + H.sub(2);
        var hSpace = repeatString("&nbsp;", 12);
        var h0 = hSpace + "H" + H.sub("0");
        var hA = hSpace + "H" + H.sub("A");
        var br = "<br />";
        var br1 = H.div("", Style.toAtts({height: Options.F102.spaceAboveResult}));
        var line1 = h0 + ": " + mu1 + " = " + mu2 + br;
        var line2 = hA + ": " + mu1 + " &ne; " + mu2 + br + br1;
        var line3 = "Result: ";
        var rejectNull = this.t < this.leftT || this.t > this.rightT;
        if (rejectNull){
            line3 += H.span("Reject the Null", {"class": "reject"});
        } else {
            line3 += H.span("Fail to Reject the Null", {"class": "failReject"});
        }
        line3 += br;
        eltLeft.html(line1 + line2 + line3);
        var eltCenter = $("#midOverCanvasInfo");
        eltCenter.html(mu1 + " &ndash; " + mu2 + " = 0");
        var eltRight = $("#rightOverCanvasInfo");
        var ciLeft  = this.meanDiff - this.rightT * this.std;
        var ciRight = this.meanDiff + this.rightT * this.std;
        var formats = this.formats;
        function fo(x){
            if (x >= 0){
                return " " + formats.ci.sprintf(x).trim();
            } else {
                return "&ndash;" + formats.ci.sprintf(-x).trim();
            }
        }
        var padBot = (navigator.userAgent.indexOf("Firefox") != -1) ? "6px" : "1px";
        var ciAtts = Style.attachToAtts({"class": "lineBreakDisabled"}, {"padding-left": "4px"});
        var ci = H.table(
            H.tr(
                H.thRight(this.xWithBarAndIndex(1) + " &ndash; " + this.xWithBarAndIndex(2) + ": ") +
                H.td(this.fixMinus("%4.2f".sprintf(this.meanDiff)), ciAtts)
            ) + H.tr(
                H.thRight("95% CI: ", Style.toAtts({"padding-bottom": padBot})) +
                H.td(fo(ciLeft) + " &le; (" + mu1 + " &ndash; " + mu2 + ") &le; " + fo(ciRight), ciAtts)
            )
        );
        eltRight.html(ci);
        makeThexAxis();
        /*CANVAS.xAxis(ctx, {
                min: tMin1, axisMin: tMin, max: tMax1, axisMax: tMax,
                axisLabel: "", distanceFromBottom: lowerVgap,
                minorStep: 1, majorStep: 1, distNumberLabelsAxis: 37
            }
        );*/
    },
    withBarAndIndex: function(letter, index){
        if (navigator.userAgent.indexOf("Chrome") != -1){
            return H.withIndex(H.overlineSpan(letter), index);
        } else {
            return H.overlineSpan(H.withIndex(H.italic(letter), index));
        }
    },
    xWithBarAndIndex: function(index){
        return this.withBarAndIndex("x", index);
    },
    fixMinus: function(str){
        if (str.charAt(0) == "-"){
            return "&ndash;" + str.slice(1);
        }
        return str;
    },
    resetGroup1: function(){
        this.cleanup();
        this.run1([
            this.groupInitialValues[0],
            this.groups[1].get()
        ]);
    },
    resetGroup2: function(){
        this.cleanup();
        this.run1([
            this.groups[0].get(),
            this.groupInitialValues[1]
        ]);
    },
    resetAll: function(){
        this.cleanup();
        this.chosenAlphaIndex = this.initiallyChosenAlphaIndex;
        this.run();
    },
    cleanup: function(){
        //window.clearInterval(this.scheduledCall);
    }
};
/*******************************************************************************************************
F103 (paired t test)
*******************************************************************************************************/
F103 = {
    leftColor: "rgb(255, 180, 180)",
    rightColor: "rgb(255, 180, 180)",
    centerColor: "white",
    sdBarCanvasFont: Options.F103.lowerXAxisLabelsFont,
    tGap: 0.3,
    tMin: -4.4,
    tMax: 4.4,
    distanceBellCurveAxisCanvasBottom: 64,
    distanceBellCurvePeakCanvasTop: 80,
    dotRadius: Options.F103.dotRadius,
    dotColor: "green",
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: ["&alpha; = .01", "&alpha; = .05", "&alpha; = .10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    alphaTableLabel: "Confidence Level:",
    canvasWidth: 520,
    canvasHeight: 380,
    ddsColor: "rgb(33,33,199)",
    dColor: "rgb(160,23,23)",
    sdColor: "rgb(216,130,44)",
    sdBarColor: "rgb(170,40,222)",
    tColor: "rgb(0, 125, 0)",
    rejectColor: "rgb(0, 160, 0)",
    failRejectColor: "rgb(160, 0, 0)",
    data1Initial: [3,4,2,6,3,4,7,1,3,4],
    data2Initial: [5,4,6,6,5,5,6,3,5,4],
    selectorChoices : UTIL.range(1, 10),
    sampleSize: 10,
    alphaButtonClick: function(i){
        var alpha = this.app.alphaButtonValues[i];
        this.app.alpha = alpha;
        this.app.action();
    },
    run: function(){
        this.alpha = this.alphaButtonValues[this.initiallyChosenAlphaIndex];
        this.dBar = H.overlineSpan(H.italic("D"));
        var dBar = this.dBar;
        this.SPDF = new StudentPDF(this.sampleSize);
        this.diffs = new Array(this.sampleSize);
        this.dds = new Array(this.sampleSize);
        this.ddSquareds = new Array(this.sampleSize);
        this.diffElts = new Array(this.sampleSize);
        this.ddElts = new Array(this.sampleSize);
        this.ddSquaredElts = new Array(this.sampleSize);
        var opts = this.selectorChoices.map(function(choice){return H.option(choice); }).join("");
        function makeSelector(id){
            return H.tdCenter(H.sel(opts, {id: id}), {"class": "tbody"});
        }
        function makeRow(i){
            var td1 = H.thCenter(i + 1, {"class": "rowHead"});
            var td2 = makeSelector("awA" + i);
            var td3 = makeSelector("awB" + i);
            var td4 = H.tdCenter("", {id: "diff" + i, "class": "tbody"});
            var td5 = H.tdCenter("", {id: "dd" + i, "class": "tbody"});
            var td6 = H.tdCenter("", {id: "ddSquared" + i, "class": "tbody"});
            return H.tr(td1 + td2 + td3 + td4 + td5 + td6);
        }
        var abtn = H.btn(H.table(H.tr(H.td("Awareness")) + H.tr(H.td("Week 1 (A)"))), {id: "weekAbtn"});
        var bbtn = H.btn(H.table(H.tr(H.td("Awareness")) + H.tr(H.td("Week 3 (B)"))), {id: "weekBbtn"});
        var itd = H.italic("d");
        var head = H.tr(
            H.thCenter("Participant", {"class": "rowHead colHead"}) +
            H.th(abtn, {"class": "colHead"}) + H.th(bbtn, {"class": "colHead"}) + H.thCenter("Difference (" + itd + ")", {"class": "colHead"}) +
            H.thCenter("(" +itd+ " &ndash; " + dBar + ")", {"class": "colHead"}) +
            H.thCenter("(" +itd+ " &ndash; " + dBar + ")" + H.sup("2"), {"class": "colHead"})
        );
        var foot1 = H.tr(
            H.tdCenter("", {id: "participFoot1"}) + H.td("") + H.td("") +
            H.tdCenter("", {id: "dFoot1"}) +
            H.tdCenter("", {id: "ddFoot1"}) +
            H.tdCenter("", {id: "ddsFoot1"})
            , {"class": "summary1"}
        );
        var foot2 = H.tr(
            H.tdCenter("", {id: "participFoot2"}) + H.td("") + H.td("") +
            H.tdCenter("", {id: "dFoot2"}) +
            H.tdCenter("", {id: "ddFoot2"}) +
            H.tdCenter("", {id: "ddsFoot2"})
            , {"class": "summary2"}
        );
        var lower = H.table00(head +
            UTIL.range(0, this.sampleSize - 1).map(function(i) {return makeRow(i);}).join("") +
            foot1 + foot2
            , {id: "lower", "class": "fullWidth"}
        );
        var alphaButtonBar = new ButtonBar({
            buttonLabels: this.alphaButtonCaptions,
            headerLabel: this.alphaTableLabel,
            headerClass: "lineBreakDisabled",
            headerStyle: {"padding-right": "10px"},
            selectedIndex: this.initiallyChosenAlphaIndex,
            idPrefix: "alpha",
            name: "alphaButtonBar",
            app: this,
            //tableStyle: {"background-color": "rgb(199, 199, 199)"},
            btnClass: "alphaButton",
            callback: this.alphaButtonClick
        });
        var btns = alphaButtonBar.html;
        var df = this.sampleSize - 1;
        this.df = df;
        var tTable = H.table(H.tr(
            H.th("Critical Value of " + H.withIndex(H.italic("t"), "("+df+")") + ":") +
            H.th("", {id: "tCritical", valign: "top"})
        ))
        var alphaAndT = H.table(
            H.trtd(btns) +
            H.tr("", {height: 2}) +
            H.trtd(tTable)
        );
        var leftOverCanvasInfo = H.span("", {id: "leftOverCanvasInfo", "class": "overCanvasInfo"});
        var midOverCanvasInfo = H.span(H.withIndex(H.italic("&mu;"), this.dBar) + " = 0 ", {id: "midOverCanvasInfo", "class": "overCanvasInfo"});
        var rightOverCanvasInfo = H.span("", {id: "rightOverCanvasInfo", "class": "overCanvasInfo"});
        var canvasParent = H.div(
            H.canvas({width: this.canvasWidth, height: this.canvasHeight, id: "canvas"})
            + leftOverCanvasInfo + midOverCanvasInfo + rightOverCanvasInfo
            , {id: "canvasParent", style: "position: relative; z-index: 0;"}
        );
        
        var upper = H.table(H.tr(
            H.td(canvasParent) +
            H.td(H.table(
                H.tr(H.td(alphaAndT)) +
                H.tr(H.tdCenter("", {id: "calculationsTableParentTd"}))
            ))
        ));
        var html = H.table00(H.trtd(upper)+H.trtd(lower, {"class": "fullWidth"}), {id: "F103"});
        gUniverseElt.html(html);
        $("#leftOverCanvasInfo").css({
            width: 160,
            height: 50,
            left: 40,
            top: 20
        });
        var ww = 50;
        $("#midOverCanvasInfo").css({
            width: ww,
            height: 18,
            left: this.canvasWidth/2 - ww/2,
            top: this.canvasHeight - 28
        });
        $("#rightOverCanvasInfo").css({
            width: 230,
            height: 30,
            left: this.canvasWidth -270,
            top: 20
        });
        alphaButtonBar.init();
        var sel = new Array(this.sampleSize);
        for (var i=0; i<this.sampleSize; i++){
            sel[i] = [$("#awA" + i), $("#awB" + i)];
            this.diffElts[i] = $("#diff" + i);
            this.ddElts[i] = $("#dd" + i);
            this.ddSquaredElts[i] = $("#ddSquared" + i);
        }
        this.SEL = {
            elts: sel,
            app: this,
            get: function(){
                var n = this.app.sampleSize;
                var result = new Array(n);
                for (var i=0; i<n; i++){
                    result[i] = [this.elts[i][0][0].selectedIndex + 1, this.elts[i][1][0].selectedIndex + 1];
                }
                return result;
            },
            setRandom: function(column){
                // column is 0 or 1 for awareness week a, b resp
                var n = this.app.sampleSize;
                var k = this.app.selectorChoices.length;
                for (var i=0; i<n; i++){
                    var random = Math.floor(k * Math.random());
                    this.elts[i][column][0].selectedIndex = random;
                }
            },
            attachHandlers: function(){
                var app = this.app;
                var n = app.sampleSize;
                //var S = this;
                for (var column=0; column<2; column++){
                    for (var i=0; i<n; i++){
                        this.elts[i][column].change(this.makeHandler(column, i));
                    }
                }
            },
            makeHandler: function(column, i){
                var app = this.app;
                return function(evt){
                    app.action(column, i, this.selectedIndex, evt);
                }
            },
            setInitial: function(){
                var app = this.app;
                var n = app.sampleSize;
                for (var i=0; i<n; i++){
                    this.elts[i][0][0].selectedIndex = app.data1Initial[i]-1;
                    this.elts[i][1][0].selectedIndex = app.data2Initial[i]-1;
                }
            }
        };
        this.SEL.attachHandlers();
        this.SEL.setInitial();
        this.ctx = $("#canvas")[0].getContext("2d");
        this.action();
        var THIS = this;
        $("#weekAbtn").click(function(){
            THIS.SEL.setRandom(0);
            THIS.action();
        });
        $("#weekBbtn").click(function(){
            THIS.SEL.setRandom(1);
            THIS.action();
        });
        //$("#debug2").html(frataLR("left = ", "x", "y", " = right"));
        //$("#debug2").html(frata("x", "y"));
    },
    fixMinus: function(str){
        if (str.charAt(0) == "-"){
            return "&ndash;" + str.slice(1);
        }
        return str;
    },
    action: function(week, participant, score, evt){
        //console.log("week " + week + " parti " + participant + " score " + score);
        var n = this.sampleSize;
        var scores = this.SEL.get();
        var sumDiffs = 0;
        for (var i=0; i<n; i++){
            var score1 = scores[i][0];
            var score2 = scores[i][1];
            var diff = score2 - score1;
            this.diffs[i] = diff;
            this.diffElts[i].html(diff);
            sumDiffs += diff;
        }
        var meanDiff = sumDiffs/n;
        this.meanDiff = meanDiff;
        var meanDiffFormatted = this.fixMinus("%3.1f".sprintf(meanDiff));
        this.meanDiffFormatted = meanDiffFormatted;
        var ssd = 0;
        for (var i=0; i<n; i++){
            diff = this.diffs[i];
            var dd = diff - meanDiff;
            this.dds[i] = dd;
            this.ddElts[i].html("%4.2f".sprintf(dd));
            var ddSquared = dd * dd;
            this.ddSquareds[i] = ddSquared;
            this.ddSquaredElts[i].html("%5.2f".sprintf(ddSquared));
            ssd += ddSquared;
        }
        this.ssd = ssd;
        var ssdFormatted = "%4.2f".sprintf(ssd);
        this.ssdFormatted = ssdFormatted;
        $("#participFoot1").html(H.italic("n") + " = " + n);
        $("#dFoot1").html(H.italic("&Sigma;d") + " = " + sumDiffs);
        //$("#dFoot2").html(H.table(H.tr(        using handmade math instead, see below
        //        H.td(H.overBar("D") + " = ") +
        //        H.td(M.mathInlineLeft(M._frac(M.Sigma + M.i("d"), M.i("n")))) +
        //        H.td(" = " + H.span("%3.1f".sprintf(meanDiff), {style: Style.toString({"font-weight": "bold", color: D.dColor})}))
        //)));
        var left = this.dBar + " = ";
        var numer = H.italic("&Sigma;d");
        var deno = H.italic("n");
        var right = " = " + H.span(meanDiffFormatted, {style: Style.toString({"font-weight": "bold", color: this.dColor})});
        $("#dFoot2").html(H.frataLR(left, numer, deno, right));
        $("#ddFoot1").html(H.italic("&Sigma;") + "(" + H.italic("d") + " &ndash; " + this.dBar + ") = 0.0");
        var ssdStr = H.italic("&Sigma;") + "(" + H.italic("d") + " &ndash; " + this.dBar + ")" + H.sup("2") + " = ";
        ssdStr += H.span(ssdFormatted, {style: Style.toString({"font-weight": "bold", color: this.ddsColor})});
        $("#ddsFoot1").html(ssdStr);
        //
        var alpha = this.alphaButtonValues[this.alphaButtonBar.selectedIndex];
        var degreesOfFreedom = this.sampleSize - 1;
        var tCrit = studentTcritical[this.alphaLookup[this.alphaButtonBar.selectedIndex]][degreesOfFreedom];
        this.tCrit = tCrit;
        $("#tCritical").html("&#x00B1;" + "%5.3f".sprintf(tCrit));
        $("#calculationsTableParentTd").html(this.makeCalculationsTableHtml());
        M.render();
        this.repaint();
    },
    makeCalculationsTableHtml: function(){
        var n = this.sampleSize;
        var df = this.df;
        var meanDiff = this.meanDiff;
        var meanDiffFormatted = this.meanDiffFormatted;
        var ssd = this.ssd;
        var ssdFormatted = this.ssdFormatted;
        var vc = {valign: "center", "class": "eq"};
        var EQ = H.tdCenter(" = ", vc);
        function row(one, two, three, four){
            return H.tr(H.td(one, vc) + EQ + H.td(two, vc) + EQ + H.td(three, vc) + EQ + H.td(four, vc));
        }
        var dBar = this.dBar;
        //var boto = Style.toAtts({"border-top": "1px solid black"});
        //var botoSmall = Style.attachToAtts({"class": "dbarindex"}, {"border-top": "1px solid black", "font-size": "85%"});
        //var dBarBetter = H.span(H.table00(H.tr(H.td(H.italic("D"), boto))));
        var its = H.italic("s");
        var itD = H.italic("D");
        var itd = H.italic("d");
        //var sdBar = H.withIndex(its, dBar);
        /*var sdBar = H.table00(
            H.tr(H.td(its, {rowspan: 2}) + H.td(" &nbsp; ")) +
            H.tr(H.td(itD, botoSmall))
            , {"class": "sdBarDeno", style: Style.toString({"margin-top": "-13px"})}
        );*/
        var sdBar = H.withIndex(its, dBar);
        function stybo(color){
            return Style.toAtts({"font-weight": "bold", color: color});
        }
        function sty(color){
            return Style.toAtts({color: color});
        }
        var sqrtn = M.mathInlineCenter(M.sqrt(M.i("n")));
        //sqrtn = H.italic("n") + H.sup("1/2");
        var sqrtnVal = Math.sqrt(n);
        var sqrtnValFo = "%4.2f".sprintf(sqrtnVal);
        var devi = H.withIndex(its, itd);
        var deviValue = Math.sqrt(ssd/df);
        var deviValueFo = "%4.2f".sprintf(deviValue);
        var stdErrVal = deviValue/Math.sqrt(n);
        var stdErrValFo = "%4.2f".sprintf(stdErrVal);
        var stdErrSpan = H.span(stdErrValFo, stybo(this.sdBarColor));
        var tStat = meanDiff / stdErrVal;
        var tStatFo = this.fixMinus("%4.2f".sprintf(tStat));
        this.standardDeviation = deviValue;
        this.standardError = stdErrVal;
        this.tStat = tStat;
        var r3cell1 = M.mathBlockCenter(M._sub(M.i("s"), M.i("d")));
        var numer = M.sum + M._squaredWithParens(M.i("d") + M.minus + M._overBar2(M.i("D")));
        var deno = M.i("n") + M.minus + M.one;
        var r3cell2 = M.mathBlockCenter(M.sqrt(M._frac(numer, deno)));
        var r3cell3 = M.mathBlockCenter(M.sqrt(M._frac(M.n(ssdFormatted, stybo(this.ddsColor)), M.n(df))));
        var r3cell4 = M.mathBlockCenter(M.n(deviValueFo, stybo(this.sdColor)));
        var row3 = row(r3cell1, r3cell2, r3cell3, r3cell4);
        var row2 = row(
            M.mathBlockCenter(M._sub(M.i("s"), M._overBar(M.i("D")))),
            M.mathBlockCenter(M._frac(M._sub(M.i("s"), M.i("d")), M.sqrt(M.i("n")))),
            M.mathBlockCenter(M._frac(M.n(deviValueFo), M.n(sqrtnValFo), stybo(this.sdColor))),
            M.mathBlockCenter(M.n(stdErrValFo, stybo(this.sdBarColor)))
        );
        var row1 = row(
            M.mathBlockCenter(M.i("t")),
            M.mathBlockCenter(M._frac(M._overBar2(M.i("D")), M._sub(M.i("s"), M._overBar2(M.i("D"))))),
            M.mathBlockCenter(M._frac(M.n(meanDiffFormatted), M.n(stdErrValFo), stybo(this.dColor), stybo(this.sdBarColor))),
            //frata(meanDiffFormatted, stdErrSpan, {"font-weight": "bold", color: this.dColor}),
            M.mathBlockCenter(M.n(tStatFo, stybo(this.tColor)))
            //H.span(tStatFo, stybo(this.tColor))
        );
        return H.table([row1, row2, row3].join(""), {id: "calculationsTable"});
    },
    repaint: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        var gap = this.tGap;
        var tMin = this.tMin;
        var tMax = this.tMax;
        var tMin1 = tMin - gap;
        var tMax1 = tMax + gap;
        var lowerVgap = this.distanceBellCurveAxisCanvasBottom;
        var temp = CANVAS.xAxis(ctx, {
                min: tMin1, axisMin: tMin, max: tMax1, axisMax: tMax,
                axisLabel: "", distanceFromBottom: lowerVgap,
                minorStep: 1, majorStep: 1//, distNumberLabelsAxis: 37
            }
        );
        var labels = temp.labels;
        ctx.font = this.sdBarCanvasFont;
        ctx.textAlign = "center";
        ctx.fillStyle = this.sdBarColor;
        for (var i=0; i<labels.length; i++){
            var lbl = labels[i];
            ctx.fillText("%5.2f".sprintf(this.standardError * lbl.x), lbl.txtX, lbl.txtY + 18);
        }
        var underAxisHeight = temp.distanceFromBottom;
        var overAxisHeight = this.distanceBellCurvePeakCanvasTop;
        var nonCurveHeight = underAxisHeight + overAxisHeight;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = 1;
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * underAxisHeight;
        var overAxisScaled = scaleFactor * overAxisHeight;
        var v = this.df;
        function studentPdf(t){
            // without the normalizing constant, which we don't need due to lack of y axis labels
            var exponent = -(v+1)/2;
            return Math.pow(1 + t*t/v, exponent);
        }
        // left
        var leftT = -this.tCrit;
        var rightT = this.tCrit;
        var plotOptionsLeft = {
            xMin: tMin1, xMinPlot: tMin, xMax: tMax1, xMaxPlot: Math.min(leftT, tMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.leftColor
        };
        this.leftFillPlot = new CanvasPlot(ctx, studentPdf, plotOptionsLeft);
        if (leftT >= tMin){
            this.leftFillPlot.fillPlot();
        }
        // right
        var plotOptionsRight = {
            xMin: tMin1, xMinPlot: Math.max(rightT, tMin), xMax: tMax1, xMaxPlot: tMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.rightColor
        };
        this.rightFillPlot = new CanvasPlot(ctx, studentPdf, plotOptionsRight);
        if (rightT <= tMax){
            this.rightFillPlot.fillPlot();
        }
        // center
        var plotOptionsCenter = {
            xMin: tMin1, xMinPlot: Math.max(tMin, leftT), xMax: tMax1, xMaxPlot: Math.min(rightT, tMax),
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.centerColor, borderColor: "black"
        };
        this.centerFillPlot = new CanvasPlot(ctx, studentPdf, plotOptionsCenter);
        this.centerFillPlot.fillPlot();
        // border
        var borderPlotOptions = {
            xMin: tMin1, xMinPlot: tMin, xMax: tMax1, xMaxPlot: tMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: "black"
        };
        this.borderCanvasPlot = new CanvasPlot(ctx, studentPdf, borderPlotOptions);
        this.borderCanvasPlot.plot();
        // left vertical line
        ctx.strokeStyle = "black";
        var xLeft = this.borderCanvasPlot.xTrafo(leftT);
        var y0 = this.borderCanvasPlot.yTrafo(0);
        this.axisPosition = y0;
        var y1 = this.borderCanvasPlot.yTrafo(0.35);
        ctx.beginPath();
        ctx.moveTo(xLeft, y0);
        ctx.lineTo(xLeft, y1);
        ctx.stroke();
        // right vertical line
        var xRight = this.borderCanvasPlot.xTrafo(rightT);
        ctx.beginPath();
        ctx.moveTo(xRight, y0);
        ctx.lineTo(xRight, y1);
        ctx.stroke();
        // t critical labels
        ctx.fillStyle = "black";
        var yT = y1-6;
        var tFormatted = "%5.3f".sprintf(rightT).trim();
        var tPlus = "+" + tFormatted;
        var tMinus = "-" + tFormatted;
        var tPlusWidth = ctx.measureText(tPlus).width;
        var tMinusWidth = ctx.measureText(tMinus).width;
        ctx.fillText(tMinus, xLeft, yT);
        ctx.fillText(tPlus, xRight, yT);
        // green dot
        var greenX = this.borderCanvasPlot.xTrafo(this.tStat);
        ctx.fillStyle = this.dotColor;
        ctx.beginPath();
        ctx.arc(greenX, y0, this.dotRadius, 0, 2*Math.PI);
        ctx.fill();
        // over canvas, left
        var eltLeft = $("#leftOverCanvasInfo");
        var dBar = this.dBar;
        var itmu = H.italic("&mu;");
        var itD = H.italic("D");
        var mudBar = H.withIndex(itmu, dBar);
        var h0 = "H" + H.sub("0");
        var hA = "H" + H.sub("A");
        var dBarValueStyle = Style.toString({color: this.dColor, "font-weight": "bold"});
        var colon = H.td(":", {"class": "colon"});
        eltLeft.html(H.table(
            H.tr(H.th(h0) + colon + H.td(mudBar, {"class": "hypothesis"}) + H.td("= 0", {"class": "hypothesis"})) +
            H.tr(H.th(hA) + colon + H.td(mudBar, {"class": "hypothesis"}) + H.td("&ne; 0", {"class": "hypothesis"})) +
            H.tr(H.th(dBar) + colon + H.td(this.meanDiffFormatted, {style: dBarValueStyle, colspan: 2}))
        ));
        // over canvas, right
        var eltRight = $("#rightOverCanvasInfo");
        var confLevelStr = Math.round(100*(1-this.alpha)) + "% CI";
        var lbl1 = "Result", resu;
        var rejectNull = this.tStat < leftT || this.tStat > rightT;
        if (rejectNull){
            resu = H.span("Reject the Null", {"class": "reject"});
        } else {
            resu = H.span("Fail to Reject the Null", {"class": "failReject"});
        }
        var ciLeft  = this.meanDiff - this.tCrit * this.standardError;
        var ciRight = this.meanDiff + this.tCrit * this.standardError;
        var formats = this.formats;
        var ciFormat = "%4.2f";
        function fo(x){
            if (x >= 0){
                return " " + ciFormat.sprintf(x).trim();
            } else {
                return "&ndash;" + ciFormat.sprintf(-x).trim();
            }
        }
        var ci = "&nbsp;" + fo(ciLeft) + " &le; " + mudBar + " &le; " + fo(ciRight);
        var pabo5 = {"padding-bottom": "5px"};
        var spabo5 = Style.toString(pabo5);
        var colon2 = H.td(":", Style.attachToAtts({"class": "colon"}, pabo5));
        eltRight.html(H.table00(
            H.tr(H.th(lbl1) + colon + H.td(resu)) +
            H.tr("", {height: "5px"}) +
            H.tr(H.th(confLevelStr, {"class": "lineBreakDisabled", style: spabo5}) + colon2 + H.td(ci))
        ));
    }
};

/*******************************************************************************************************
 Figure 34 (Skewed and non-skewed distributions)
*******************************************************************************************************/
F34 = {
    histogramOptions : {
        leftGap: 78,
        rightGap: 22,
        bottomGap: 40,
        yNarrowness: 0.6,
        xAxisLabel: "Tuition Amount ($)",
        yAxisLabel: "Probability"
    },
    sampSize1 : 5000,
    sampSize2 : 10000,
    forbidValuesBelow: 500,
    forbidValuesOver: 9500,
    color1 : "#9f9ecc",
    color2 : "#cc9eb8",
    color1a: "#6666cc",
    color2a: "#996699",
    color3 : "#9c6d9e",
    normalAction: function(){
        function icdf(p){
            return 4600 + 1000*gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        this.action(icdf, this.sampSize1, "Normal Distribution");
    },
    positiveAction: function(){
        function icdf(p){
            return 3200 + 1000*(0.75+p*p) * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        this.action(icdf, this.sampSize1, "Positively Skewed Distribution");
    },
    negativeAction: function(){
        function icdf(p){
            var q = 1 - p;
            return 6000 + 1000*(0.75+q*q) * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        this.action(icdf, this.sampSize1, "Negatively Skewed Distribution");
    },
    normally: function(elt){
        this.buttons.removeClass("chosen");
        $(elt).addClass("chosen");
        this.normalAction();
    },
    positively: function(elt){
        this.buttons.removeClass("chosen");
        $(elt).addClass("chosen");
        this.positiveAction();
    },
    negatively: function(elt){
        this.buttons.removeClass("chosen");
        $(elt).addClass("chosen");
        this.negativeAction();
    },
    normallyVsPositively: function(elt){
        this.buttons.removeClass("chosen");
        $(elt).addClass("chosen");
        function icdfPosi(p){
            return 3200 + 1000*(0.75+p*p) * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        function icdfNormal(p){
            return 4600 + 1000*gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        this.biAction(icdfNormal, icdfPosi, 10000, "Normal versus Positively Skewed Distribution", "Normal", "Positive",
            this.color1, this.color2, this.color1a, this.color2a
        );
    },
    normallyVsNegatively: function(elt){
        this.buttons.removeClass("chosen");
        $(elt).addClass("chosen");
        function icdfNega(p){
            var q = 1 - p;
            return 6000 + 1000*(0.75+q*q) * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        function icdfNormal(p){
            return 4600 + 1000*gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        this.biAction(icdfNormal, icdfNega, 10000, "Normal versus Negatively Skewed Distribution", "Normal", "Negative",
            this.color1, this.color2, this.color1a, this.color2a
        );
    },
    positivelyVsNegatively: function(elt){
        this.buttons.removeClass("chosen");
        $(elt).addClass("chosen");
        function icdfPosi(p){
            return 3200 + 1000*(0.75+p*p) * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        function icdfNega(p){
            var q = 1 - p;
            return 6000 + 1000*(0.75+q*q) * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        }
        this.biAction(icdfPosi, icdfNega, 10000, "Positively versus Negatively Skewed Distribution", "Positive", "Negative",
            this.color1, this.color2, this.color1a, this.color2a
        );
    },
    run: function(){
        if (gNormalDistribuionCalculator == null){
            gNormalDistribuionCalculator = new NdCalc();
        }
        var THIS = this;
        function multiLineBtn(line1, line2, id){
            return H.td(H.btn(H.table00(H.tr(H.tdCenter(line1)) + H.tr(H.tdCenter(line2)), {align: "center"}), {id: id}), {"class": "buttonTd"});
        }
        var btn1 = multiLineBtn("Normally", "Distributed", "normally");
        var btn2 = multiLineBtn("Positively", "Skewed", "positively");
        var btn3 = multiLineBtn("Negatively", "Skewed", "negatively");
        var btn4 = multiLineBtn("Normal vs.", "Positive Skew", "normallyVsPositively");
        var btn5 = multiLineBtn("Normal vs.", "Negative Skew", "normallyVsNegatively");
        var btn6 = multiLineBtn("Positive vs.", "Negative Skew", "positivelyVsNegatively");
        var lower = H.table(
            H.tr(
                H.thLeft("Generate a Population that is: ", {"class": "header"}) + btn1 + btn2 + btn3 
            ) +
            H.tr(
                H.thLeft("Compare Multiple Distributions: ", {"class": "header"}) + btn4 + btn5 + btn6 
            )
            , {id: "lower"}
        );
        var upper = H.table(H.trtd("title", {id: "title"}) + H.trtd("", {id: "canvasParent"}))
        var html = H.table(H.trtd(upper, {id: "upperParent"}) + H.trtd(lower), {id: "F34"});
        gUniverseElt.html(html);
        var canvasWidth = $("#F34").width();
        var canvasHtml = H.canvas({id: "canvas", width: canvasWidth, height: Options.F34.canvasHeight});
        $("#canvasParent").html(canvasHtml);
        this.ctx = $("#canvas")[0].getContext("2d");
        $("#normally").click(function(){ THIS.normally.call(THIS, this); });
        $("#positively").click(function(){ THIS.positively.call(THIS, this); });
        $("#negatively").click(function(){ THIS.negatively.call(THIS, this); });
        $("#normallyVsPositively").click(function(){ THIS.normallyVsPositively.call(THIS, this); });
        $("#normallyVsNegatively").click(function(){ THIS.normallyVsNegatively.call(THIS, this); });
        $("#positivelyVsNegatively").click(function(){ THIS.positivelyVsNegatively.call(THIS, this); });
        this.buttons = $("#lower button");
        $("#normally").addClass("chosen");
        this.titleElt = $("td#title");
        this.normalAction();
    },
    action: function(icdf, sampleSize, title){
        var ctx = this.ctx;
        CANVAS.erase(ctx);
        var binCount = 40;
        var options = {
            asProbabilities: true,
            forbidValuesBelow: this.forbidValuesBelow,
            forbidValuesOver: this.forbidValuesOver
        };
        var temp = pdfHistogram(ctx, sampleSize, binCount, icdf, this.histogramOptions, options);
        var hist = temp.hist;
        var values = temp.values;
        var minVal = temp.lo;
        var maxVal = temp.hi;
        var mean = values.mean();
        var median = values.sortASC().quantile(0.5);
        var t1 = title + " (" + H.italic("N") + " = " + americanNumberFormat("" + sampleSize) + ")";
        var t2 = "Mean = $ " + americanNumberFormat("" + Math.round(mean)) + " and Median = $ " + americanNumberFormat("" + Math.round(median));
        var t = H.table(
            H.tr(H.thCenter(t1, {"class": "titleFirstRow"})) +
            H.tr(H.tdCenter(t2), {"class": "titleSecondRow"}) +
            H.tr(H.tdCenter("&nbsp;"), {"class": "titleSecondRow"})
            , {"class": "fullWidth"}
        );
        this.titleElt.html(t);
        this.hist = hist;
        this.values = values;
        this.minVal = minVal;
        this.maxVal = maxVal;
    },
    biAction: function(icdf1, icdf2, sampleSize, title, title1, title2, hColor1, hColor2, tColor1, tColor2){
        var ctx = this.ctx;
        CANVAS.erase(ctx);
        var binCount = 40;
        var histOpts1 = jQuery.extend({color: hColor1}, this.histogramOptions);
        var histOpts2 = jQuery.extend({color: hColor2}, this.histogramOptions);
        var histOpts3 = jQuery.extend({color: this.color3}, this.histogramOptions);
        var options = {
            asProbabilities: true,
            forbidValuesBelow: this.forbidValuesBelow,
            forbidValuesOver: this.forbidValuesOver,
            sampleSize: sampleSize,
            binCount: binCount
        };
        var temp = TwoPdfsHistogram(ctx, icdf1, histOpts1, icdf2, histOpts2, options, histOpts3)
        var hist1 = temp.hist1;
        var values1 = temp.values1;
        var hist2 = temp.hist2;
        var values2 = temp.values2;
        var mean1 = values1.mean();
        var median1 = values1.sortASC().quantile(0.5);
        var mean2 = values2.mean();
        var median2 = values2.sortASC().quantile(0.5);
        var t1 = title + " (" + H.italic("N") + " = " + americanNumberFormat("" + sampleSize) + ")";
        var t2 = title1 + ": " + "Mean = $ " + americanNumberFormat("" + Math.round(mean1)) + " and Median = $ " + americanNumberFormat("" + Math.round(median1));
        var t3 = title2 + ": " + "Mean = $ " + americanNumberFormat("" + Math.round(mean2)) + " and Median = $ " + americanNumberFormat("" + Math.round(median2));
        var t = H.table(
            H.tr(H.thCenter(t1, {"class": "titleFirstRow"})) +
            H.tr(H.tdCenter(t2, Style.attachToAtts({"class": "titleColoredSecondRow"}, {color: tColor1}))) +
            H.tr(H.tdCenter(t3, Style.attachToAtts({"class": "titleColeredThirdRow"}, {color: tColor2})))
            , {"class": "fullWidth"}
        );
        this.titleElt.html(t);
        
    }
};


/*******************************************************************************************************
  F84 (Confidence Internval for the Mean of LSAT Scores)
*******************************************************************************************************/
F84 = {
    title: "Confidence Internval for the Mean of LSAT Scores",
    sliderMin: Options.F84.sampSizeSliderMin,
    sliderMax: Options.F84.sampSizeSliderMax,
    sliderInitial: Options.F84.sampSizeSliderInitial,
    sampSizeSliderTitle: Options.F84.sampSizeSliderTitle,
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    initiallyChosenAlphaIndex: 1,
    initialKnownUnknownIndex: 0,
    modes : {
        known: 0,
        unknown: 1
    },
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    significanceButtonsTitle: Options.F84.significanceButtonsTitle,
    sliderLeftSpacing: Options.F84.sliderLeftSpacing,
    canvasWidth: Options.F84.canvasWidth,
    canvasHeight: Options.F84.canvasHeight,
    popMean: Options.F84.popMean,
    popStd: Options.F84.popStd,
    sliderValEltMinWidth: "41px",
    zMin: -4.6,
    zMax: 4.6,
    zGap: 0.3,
    makeInverseNormalCDF: function(){
        var mu = this.popMean;
        var sigma = this.popStd;
        return function(p){
            return mu + sigma * gNormalDistribuionCalculator.inverseCdfStdNormal(p);
        };
    },
    sliderCallback: function(value, mode){
        this.valElt.html(value);
        this.app.sampleSize = value;
        this.app.action(true);
    },
    alphaButtonClick: function(btnIndex){
        //var alpha = this.app.alphaButtonValues[btnIndex];
        //this.app.alpha = alpha;
        this.app.reset();
    },
    setMode: function(i){
        this.mode = ["known", "unknown"][i];
    },
    knownUnknownButtonClick: function(i){
        this.app.setMode(i);
        this.app.reset();
    },
    run: function(){
        if (gNormalDistribuionCalculator == null){
            gNormalDistribuionCalculator = new NdCalc();
        }
        this.icdf = this.makeInverseNormalCDF();
        this.run1(this.sliderInitial, this.initiallyChosenAlphaIndex, this.initialKnownUnknownIndex, 0, 0);
    },
    run1: function(sliVal, alphaIndex, knownUnknownIndex, coverCount, nonCoverCount){
        this.sample = null;
        this.coveringCIcounter = coverCount;
        this.nonCoveringCIcounter = nonCoverCount;
        this.setMode(knownUnknownIndex);
        this.sampleSize = sliVal;
        var THIS = this;
        this.alpha = this.alphaButtonValues[alphaIndex];
        var slider = new Slider({min: this.sliderMin, max: this.sliderMax, value: sliVal, id: "sampSizeSlider", step: 1, callback: this.sliderCallback});
        slider.app = this;
        var spacer = H.td("", Style.toAtts({"min-width": this.sliderLeftSpacing, width: this.sliderLeftSpacing}));
        var sliderTable = H.table(
            H.tr(
                H.thLeft(this.sampSizeSliderTitle, {"class": "lineBreakDisabled"}) + spacer +
                H.td(slider.html, {id: "sliderTd", "class": "fullWidth"}) +
                H.tdRight("", Style.attachToAtts({id: slider.id + "Value", width: this.sliderValEltMinWidth}, {"min-width": this.sliderValEltMinWidth, width: this.sliderValEltMinWidth}))
            )
            , {id: "sliderTable", "class": "fullWidth"}
        );
        var alphaButtonBar = new ButtonBar({
            buttonLabels: this.alphaButtonCaptions,
            headerLabel: this.significanceButtonsTitle,
            headerClass: "lineBreakDisabled",
            headerStyle: {"padding-right": "10px"},
            selectedIndex: alphaIndex,
            idPrefix: "alpha",
            name: "alphaButtonBar",
            app: this,
            //tableStyle: {"background-color": "rgb(199, 199, 199)"},
            btnClass: "alphaButton",
            chosenButtonClass: "chosen bold",
            callback: this.alphaButtonClick
        });
        var btns = alphaButtonBar.html;
        var btnRow = H.table00(H.tr(
            H.td(btns) + H.tdRight(H.btn("Generate the sample", {id: "goBtn"}))
        ), {"class": "fullWidth"});
        var knownUnknown = new ButtonBar({
            buttonLabels: ["Known", "Unknown"],
            headerLabel: Options.F84.knownUnknownButtonsTitle,
            headerClass: "lineBreakDisabled",
            headerStyle: {"padding-right": "10px"},
            selectedIndex: knownUnknownIndex,
            idPrefix: "knownUnknown",
            name: "knownUnknownButtonBar",
            app: this,
            //tableStyle: {"background-color": "rgb(199, 199, 199)"},
            btnClass: "knownUnknownButton",
            chosenButtonClass: "chosen bold",
            callback: this.knownUnknownButtonClick
        });
        var reset = H.table00(H.tr(
            H.td(H.btn("Reset Sample"), {id: "resetSampleBtn", "class": "resetBtn"}) +
            H.td(H.btn("Reset All"), {id: "resetAllBtn", "class": "resetBtn"})
        ));
        var firstRow = H.table00(H.tr(
            H.td(knownUnknown.html) + H.tdRight(reset, {id: "resetTd"})
        ), {"class": "fullWidth"});
        var lower = H.table(
            H.trtd(firstRow) +
            H.trtd(sliderTable, {"class": "fullWidth"}) +
            H.trtd(btnRow, {"class": "fullWidth"})
            , {"class": "fullWidth", id: "lower"}
        );
        var canvHtml = H.canvas({id: "canvas", width: this.canvasWidth, height: this.canvasHeight});
        var leftOverCanvasInfo = H.span("", {id: "leftOverCanvasInfo", "class": "overCanvasInfo"});
        var midOverCanvasInfo = H.span(H.boldItalic("&mu;") , {id: "midOverCanvasInfo", "class": "overCanvasInfo"});
        var rightOverCanvasInfo = H.span("", {id: "rightOverCanvasInfo", "class": "overCanvasInfo"});
        var canvasParent = H.div(
            canvHtml + leftOverCanvasInfo + midOverCanvasInfo + rightOverCanvasInfo
            , {id: "canvasParent", style: "position: relative; z-index: 0;"}
        );
        var html = H.table(
            H.tr(H.th(this.title, {"class": "title"})) +
            H.tr(H.td(canvasParent, {id: "canvasParentTd", "class": "fullWidth"})) +
            H.tr(H.td(lower))
            , {id: "F84"}
        );
        gUniverseElt.html(html);
        slider.init();
        this.ctx = $("#canvas")[0].getContext("2d");
        slider.valElt = $("#" + slider.id + "Value");
        slider.app = this;
        slider.valElt.html(slider.get());
        $("#midOverCanvasInfo").css({
            width: 10,
            height: 15,
            left: this.canvasWidth/2 - 5,
            "background-color": "white",
            "padding-top": "0",
            "margin-top": "0",
            "white-space":  "nowrap"
        });
        $("#leftOverCanvasInfo").css({
            width: 150,
            height: 20,
            left: 30,
            top: 30,
            "background-color": "white",
            "padding-top": "2px",
            "white-space":  "nowrap"
        });
        $("#rightOverCanvasInfo").css({
            width: 150,
            height: 20,
            left: this.canvasWidth - 320,
            top: 30,
            "background-color": "white",
            "padding-top": "2px",
            "white-space":  "nowrap"
        });
        alphaButtonBar.init();
        knownUnknown.init();
        $("#goBtn").click(function(){
            THIS.action.call(THIS);
        });
        $("#resetSampleBtn").click(function(){
            THIS.reset.call(THIS);
        });
        $("#resetAllBtn").click(function(){
            THIS.run.call(THIS);
        });
        if (Options.F84.generateSampleOnStartUp) {
            this.action();
        } else {
            this.drawCanvasBackground();
        }
    },
    reset: function(){
        this.run1(this.sampleSize, this.alphaButtonBar.selectedIndex, this.modes[this.mode], 0, 0);
    },
    drawCanvasBackground: function(){
        var ctx = this.ctx;
        CANVAS.erase(ctx);
        //preparations
        var gap = this.zGap;
        var zMin = this.zMin;
        var zMax = this.zMax;
        var zMin1 = zMin - gap;
        var zMax1 = zMax + gap;
        var popMean = this.popMean;
        var popStd = this.popStd;
        function trafo(z){
            return popMean + popStd * z;
        }
        //var xMin = trafo(zMin), xMax = trafo(zMax), xMin1 = trafo(zMin1), xMax1 = trafo(zMax1);
        var lowerVgap = Options.F84.distanceBellCurveAxisCanvasBottom;
        //axis
        var temp = CANVAS.xAxis(ctx, {
            min: zMin1, axisMin: zMin, max: zMax1, axisMax: zMax,
            axisLabel: "", distanceFromBottom: lowerVgap,
            majorStep: 1, minorStep: 1,
            labelAdjustmentFunction: function(str, num){
                return trafo(num);
            }
        });
        var underAxisHeight = temp.distanceFromBottom;
        var overAxisHeight = Options.F84.distanceBellCurvePeakCanvasTop;
        var nonCurveHeight = underAxisHeight + overAxisHeight;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = 1/Math.sqrt(2*Math.PI);
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * underAxisHeight;
        var overAxisScaled = scaleFactor * overAxisHeight;
        $("#midOverCanvasInfo").css({
            top: totalHeight - underAxisHeight + 17
        });
        var plotOptions = {
            xMin: zMin1, xMinPlot: zMin, xMax: zMax1, xMaxPlot: zMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: "black"
        };
        this.canvasPlot = new CanvasPlot(ctx, pdfStdNormal, plotOptions);
        this.canvasPlot.plot();
        // draw dashed line
        var x0 = this.canvasPlot.xTrafo(0);
        var y0 = this.canvasPlot.yTrafo(0);
        var y1 = this.canvasPlot.yTrafo(maxDensity);
        this.ctx.strokeStyle = "black";
        CANVAS.dashedLine(ctx, x0, y0, x0, y1, [6,6]);
        CANVAS.dashedLine(ctx, x0, y0 + 40, x0, ctx.canvas.height, [6,6]);
    },
    drawCI: function(){
        var ctx = this.ctx;
        var fromBot = Options.F84.distanceCIfromBottom;
        var barLen = Options.F84.lengthCIsideBars;
        var popMean = this.popMean;
        var popStd = this.popStd;
        var plot = this.canvasPlot;
        function trafo(z){
            return popMean + popStd * z;
        }
        function invTrafo(x){
            return (x - popMean)/popStd;
        }
        function xToCanvas(x){
            return plot.xTrafo(invTrafo(x));
        }
        var y = ctx.canvas.height - fromBot;
        var left = xToCanvas(this.ciLo);
        var right = xToCanvas(this.ciHi);
        ctx.strokeStyle = Options.F84.ciLineColor;
        ctx.lineWidth = Options.F84.ciLineWidth;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
        ctx.beginPath(); ctx.moveTo(left, y - 0.5*barLen); ctx.lineTo(left, y + 0.5*barLen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(right, y - 0.5*barLen); ctx.lineTo(right, y + 0.5*barLen); ctx.stroke();
        var cih = Options.F84.ciOvalHeight;
        var ciw = Options.F84.ciOvalWidth;
        ctx.fillStyle = Options.F84.ciCenterColor;
        var centerX = xToCanvas(this.ciCenter);
        ctx.beginPath();
        ctx.moveTo(centerX + ciw, y);
        var N = 50;
        var factor = 2*Math.PI/N;
        for (var i=0; i<=N; i++){
            var xxx = centerX + ciw * Math.cos(factor * i);
            var yyy = y + cih * Math.sin(factor * i);
            ctx.lineTo(xxx, yyy);
        }
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        var angle1 = factor * N / 8;
        var angle2 = 3 * angle1;
        var angle3 = 5 * angle1;
        var angle4 = 7 * angle1;
        function aux(a1, a2){
            ctx.beginPath();
            ctx.moveTo(centerX + 0.85 * ciw * Math.cos(a1), 1.2 + y + 0.62 * cih * Math.sin(a1));
            ctx.lineTo(centerX + 0.85 * ciw * Math.cos(a2), 1.2 + y + 0.62 * cih * Math.sin(a2));
            ctx.stroke();
        }
        aux(angle1, angle3);
        aux(angle2, angle4);
        ctx.beginPath();
        var barWidth = 10;
        var dy = -6.2;
        ctx.moveTo(centerX-barWidth/2, y + dy);
        ctx.lineTo(centerX+barWidth/2, y + dy);
        ctx.stroke();
    },
    action: function(dontGenerateNewSample){
        var sample;
        if (dontGenerateNewSample){
            if (this.sample == null){
                return;
            }
            sample = this.sample;
        } else {
            sample = generateSample(this.sampleSize, this.icdf);
            this.sample = sample;
        }
        var mean = sample.mean();
        var meanFormatted = "%10.2f".sprintf(mean).trim();
        var alpha = this.alpha;
        var zCrit = Math.abs(gNormalDistribuionCalculator.inverseCdfStdNormal(alpha/2));
        var degreesOfFreedom = this.sampleSize - 1;
        var tCrit = studentTcritical[this.alphaLookup[this.alphaButtonBar.selectedIndex]][degreesOfFreedom];
        var crit = this.mode == "known" ? zCrit : tCrit;
        var critFormatted = "%5.3f".sprintf(crit);
        var devi = this.mode == "known" ? this.popStd : sample.stdDevE();
        var standardError = devi / Math.sqrt(this.sampleSize);
        var ciLo = mean - crit * standardError;
        var ciHi = mean + crit * standardError;
        this.ciLo = ciLo;
        this.ciCenter = mean;
        this.ciHi = ciHi;
        var ciLoFo = "%10.2f".sprintf(ciLo).trim();
        var ciHiFo = "%10.2f".sprintf(ciHi).trim();
        var confidenceInterval = ciLoFo + " &le; " + H.italic("&mu;") + " &le; " + ciHiFo;
        if (!dontGenerateNewSample){
            if (ciLo <= this.popMean && this.popMean <= ciHi){
                this.coveringCIcounter++;
            } else {
                this.nonCoveringCIcounter++;
            }
        }
        var totalSamplesCounter = this.coveringCIcounter + this.nonCoveringCIcounter;
        var ciCoverage = this.coveringCIcounter / totalSamplesCounter;
        var ciCoverageFormatted = "%5.2f".sprintf(100 * ciCoverage) + "%";
        var ciPercentFormatted = "%5.2f".sprintf(100 * (1 - alpha)) + "% CI:";
        var deviFormatted = "%5.3f".sprintf(devi);
        var seFormatted = "%5.3f".sprintf(standardError);
        var statLabel = H.italic(this.mode == "known" ? "z" : "t") + "&ndash;value" + H.sub("(" + H.italic("&alpha;") + ")") + ":";
        var deviLabel = this.mode == "known" ? "Population " + H.italic("&sigma;") + ":" : "Sample " + H.italic("s") + ":";
        //var sMeanLabel = "Sample " + H.overlineSpan(H.italic("x")) + ":";
        //var sMeanLabel = "Sample " + H.overBar(H.italic("x")) + ":";
        /*var sMeanLabel = H.table00(H.tr(
            H.td("Sample") +
            H.td(H.table(H.trtd(H.italic("x"), Style.attachToAtts({id: "xBar"}, {"border-top": "1px solid black"})))) +
            H.td(":")
        ));*/
        var sMeanLabel = "Sample " + H.overBar("x") + ":";
        function infoRow(lbl, value){
            return H.tr(H.thRight(lbl) + H.tdLeft(value));
        }
        var leftTable = H.table(
            infoRow(sMeanLabel, meanFormatted) +
            infoRow(deviLabel, deviFormatted) +
            infoRow("Standard Error:", seFormatted) +
            infoRow(statLabel, critFormatted)
        );
        var rightTable = H.table(
            infoRow(ciPercentFormatted, confidenceInterval) +
            infoRow("CI Coverage:", ciCoverageFormatted) +
            infoRow("Number of Samples:", totalSamplesCounter)
        );
        $("#leftOverCanvasInfo").html(leftTable);
        $("#rightOverCanvasInfo").html(rightTable);
        this.drawCanvasBackground();
        this.drawCI();
    }
};
/*******************************************************************************************************
 Single Sample z and t test
*******************************************************************************************************/
var SSZT = {
    alphaButtonValues: [0.01, 0.05, 0.1, 0.15],
    alphaButtonCaptions: [".01", ".05", ".10", ".15"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent", "fifteenPercent"],
    indexOfInitiallySelectedTest: 0,
    sampSizeSlider: null,
    popMeanSlider: null,
    popStdSlider: null,
    sampMeanSlider: null,
    sampStdSlider: null,
    samplePropSlider: null,
    popPropSlider: null,
    sliderTableWidth: 820,
    sampSizeSliderOptions: { min: 25, max: 225, value: 100, step: 1 },
    popMeanSliderOptions: { min: 50, max: 100, value: 85, step: 0.5 },
    popStdSliderOptions: { min: 4, max: 18, value: 6, step: 0.1 },
    sampMeanSliderOptions: { min: 50, max: 100, value: 90, step: 0.5},
    sampStdSliderOptions: { min: 4, max: 18, value: 6, step: 0.1 },
    samplePropSliderOptions: { min: 0.01, max: 0.99, value: 0.78, step: 0.01 },
    popPropSliderOptions: { min: 0.01, max: 0.99, value: 0.83, step: 0.01 },
    sliderTableLeftSpacerWidth: 7,
    sliderTableRightSpacerWidth: 7,
    useBoldMath: true,
    mathAuxOneLine: function(testStatName, firstTerm, secondTerm, thirdTerm, fourthTerm){
        var mathClass = this.useBoldMath ? {"class": "bold"} : {};
        var math = M.mathBlockLeft(M.row([M.i(testStatName, mathClass), firstTerm, secondTerm, thirdTerm, fourthTerm].join(M.equals)), mathClass);
        var elt = $("#math"); 
        elt.html(math);
        M.render();
    },
    mathAuxMultiLine: function(testStatName, firstTerm, secondTerm, thirdTerm, fourthTerm){
        var mathClass = this.useBoldMath ? {"class": "bold"} : {};
        function aux(rhs){
            return H.td(M.mathBlockLeft(M.row(M.equals + rhs), mathClass));
        }
        var sty = {style: "width: 5px;"};
        var math = H.table(
            H.tr(H.td(M.mathBlockLeft(M.row(M.i(testStatName, mathClass) + M.equals + firstTerm), mathClass), {colspan: 2})) +
            H.tr(H.td("", sty) + aux(secondTerm)) +
            H.tr(H.td("", sty) + aux(thirdTerm)) +
            H.tr(H.td("", sty) + aux(fourthTerm))
        );
        var elt = $("#math"); 
        elt.html(math);
        M.render();
    },
    mathAuxTwoLine: function(testStatName, firstTerm, secondTerm, thirdTerm, fourthTerm){
        var sty = {style: "width: 5px;"};
        var mathClass = this.useBoldMath ? {"class": "bold"} : {};
        var math = H.table(
            //H.tr(H.td(M.mathBlockLeft(M.row(M.i(testStatName, {"class": "bold italic"}) + M.equals + firstTerm + M.equals + secondTerm)), {colspan: 2})) +
            //H.tr(H.td(M.mathBlockLeft(M.row(M.i(testStatName, {"class": "bold"}) + M.equals + firstTerm + M.equals + secondTerm)), {colspan: 2})) +
            H.tr(H.td(M.mathBlockLeft(M.row(M.i(testStatName, mathClass) + M.equals + firstTerm + M.equals + secondTerm), mathClass), {colspan: 2})) +
            H.tr(H.td("", sty) + H.td(M.mathBlockLeft(M.row(M.equals + thirdTerm + M.equals + fourthTerm), mathClass), {}))
        );
        var elt = $("#math"); 
        elt.html(math);
        M.render();
    },
    zMeanTest: {
        title: "Single Sample z-test for a mean",
        sliderVisibilities: {
            sampSizeSlider: true,
            popMeanSlider: true,
            popStdSlider: true,
            sampMeanSlider: true,
            sampStdSlider: false,
            samplePropSlider: false,
            popPropSlider: false
        },
        run: function(){
            //console.log("running " + this.title);
            var F = this.obj;
            var mathClass = F.useBoldMath ? {"class": "bold"} : {};
            var sigma = F.useBoldMath ? M.boldSigma : M.sigma;
            var xBar = M._overBar2(M.i("x", mathClass));
            var mu0 = M._sub(M.i("&mu;", mathClass), M.zero);
            var diff = xBar + M.minus + mu0;
            var deno = M._frac(sigma, M.sqrt(M.i("n", mathClass)));
            var firstTerm = M._frac(diff, deno);
            
            var xBarN = M.n(F.sampleMean);
            var mu0N = M.n(F.popMean);
            diff = xBarN + M.minus + mu0N;
            deno = M._div(M.n(F.popStd), M.sqrt(M.n(F.sampleSize)));
            var secondTerm = M._frac(diff, deno);
            
            var diffN = F.sampleMean - F.popMean;
            if (diffN >= 0){
                var diffFormatted = (diffN == Math.round(diffN)) ? diffN : "%10.1f".sprintf(diffN).trim();
                diff = M.n(diffFormatted);
            } else {
                var diffFormatted = (diffN == Math.round(diffN)) ? -diffN : "%10.1f".sprintf(-diffN).trim();
                diff = M.row(M.minus + M.n(diffFormatted));
            }
            var sqrt = Math.sqrt(F.sampleSize);
            var fo = "%10.3f";
            var sqrtFo = fo.sprintf(sqrt).trim();
            deno = M._div(M.n(F.popStd), M.n(sqrtFo));
            var thirdTerm = M._frac(diff, deno);
            
            var z = diffN / F.popStd * sqrt;
            var fourthTerm = z >= 0 ?
                M.n(fo.sprintf(z).trim()) :
                M.row(M.minus + M.n(fo.sprintf(-z).trim()));
            F[Options.SSZT.whichMathAux]("z", firstTerm, secondTerm, thirdTerm, fourthTerm);
            // results
            F.nullHypotElt.html("&mu; = " + F.popMean);
            F.altHypoElt.html("&mu; &ne; " + F.popMean);
            F.resultAlphaElt.html(F.alpha);
            var zCrit = Math.abs(gNormalDistribuionCalculator.inverseCdfStdNormal(F.alpha/2));
            var plusMinus = "&#177;";
            var fo = "%10.3f";
            var zCritFo = plusMinus + fo.sprintf(zCrit).trim();
            F.critValElt.html(zCritFo);
            var zFo = z >= 0 ? fo.sprintf(z).trim() : "&ndash;" + fo.sprintf(-z).trim();
            F.testStatElt.html(zFo);
            var rejectNull = Math.abs(z) > zCrit;
            if (rejectNull){
                F.decisionElt.html(H.span("Reject the Null", {"class": "reject"}));
            } else {
                F.decisionElt.html(H.span("Fail to Reject the Null", {"class": "failReject"}));
            }
        }
    },
    tMeanTest: {
        title: "Single Sample t-test for a mean",
        sliderVisibilities: {
            sampSizeSlider: true,
            popMeanSlider: true,
            popStdSlider: false,
            sampMeanSlider: true,
            sampStdSlider: true,
            samplePropSlider: false,
            popPropSlider: false
        },
        run: function(){
            //console.log("running " + this.title);
            var F = this.obj;
            var mathClass = F.useBoldMath ? {"class": "bold"} : {};
            var xBar = M._overBar2(M.i("x", mathClass));
            var mu0 = M._sub(M.i("&mu;", mathClass), M.zero);
            var diff = xBar + M.minus + mu0;
            var deno = M._frac(M.i("s", mathClass), M.sqrt(M.i("n", mathClass)));
            var firstTerm = M._frac(diff, deno);
            
            var xBarN = M.n(F.sampleMean);
            var mu0N = M.n(F.popMean);
            diff = xBarN + M.minus + mu0N;
            deno = M._div(M.n(F.sampleStd), M.sqrt(M.n(F.sampleSize)));
            var secondTerm = M._frac(diff, deno);

            var diffN = F.sampleMean - F.popMean;
            if (diffN >= 0){
                var diffFormatted = (diffN == Math.round(diffN)) ? diffN : "%10.1f".sprintf(diffN).trim();
                diff = M.n(diffFormatted);
            } else {
                var diffFormatted = (diffN == Math.round(diffN)) ? -diffN : "%10.1f".sprintf(-diffN).trim();
                diff = M.row(M.minus + M.n(diffFormatted));
            }
            var sqrt = Math.sqrt(F.sampleSize);
            var fo = "%10.3f";
            var sqrtFo = fo.sprintf(sqrt).trim();
            deno = M._div(M.n(F.sampleStd), M.n(sqrtFo));
            var thirdTerm = M._frac(diff, deno);

            var t = diffN / F.sampleStd * sqrt;
            var fourthTerm = t >= 0 ?
                M.n(fo.sprintf(t).trim()) :
                M.row(M.minus + M.n(fo.sprintf(-t).trim()));
            F[Options.SSZT.whichMathAux]("t", firstTerm, secondTerm, thirdTerm, fourthTerm);
            // results
            F.nullHypotElt.html("&mu; = " + F.popMean);
            F.altHypoElt.html("&mu; &ne; " + F.popMean);
            F.resultAlphaElt.html(F.alpha);
            var degreesOfFreedom = F.sampleSize - 1;
            var tCrit = studentTcritical[F.alphaLookup[F.alphaButtonBar.selectedIndex]][degreesOfFreedom];
            var plusMinus = "&#177;";
            var fo = "%10.3f";
            var tCritFo = plusMinus + fo.sprintf(tCrit).trim();
            F.critValElt.html(tCritFo);
            var tFo = t >= 0 ? fo.sprintf(t).trim() : "&ndash;" + fo.sprintf(-t).trim();
            F.testStatElt.html(tFo);
            var rejectNull = Math.abs(t) > tCrit;
            if (rejectNull){
                F.decisionElt.html(H.span("Reject the Null", {"class": "reject"}));
            } else {
                F.decisionElt.html(H.span("Fail to Reject the Null", {"class": "failReject"}));
            }
        }
    },
    zPropTest: {
        title: "Single Sample z-test for a proportion",
        sliderVisibilities: {
            sampSizeSlider: true,
            popMeanSlider: false,
            popStdSlider: false,
            sampMeanSlider: false,
            sampStdSlider: false,
            samplePropSlider: true,
            popPropSlider: true
        },
        run: function(){
            //console.log("running " + this.title);
            var F = this.obj;
            var mathClass = F.useBoldMath ? {"class": "bold"} : {};
            var pHat = M._overHat("p", mathClass);
            var p0 = M._sub(M.i("p", mathClass), M.n(0));
            var diff = pHat + M.minus + p0;
            var numera = p0 + M._withParens(M.one + M.minus + p0);
            var deno = M.sqrt(M._frac(numera, M.i("n", mathClass)));
            var firstTerm = M._frac(diff, deno);
            
            var pHatN = M.n(F.sampleProp);
            var p0N = M.n(F.popProp);
            diff = pHatN + M.minus + p0N;
            numera = p0N + M._withParens(M.one + M.minus + p0N);
            deno = M.sqrt(M._div(numera, M.n(F.sampleSize)));
            var secondTerm = M._frac(diff, deno);
            
            var diffN = F.sampleProp - F.popProp;
            var fo = "%10.3f";
            diff = diffN >= 0 ?
                M.n(fo.sprintf(diffN).trim()) :
                M.row(M.minus + M.n(fo.sprintf(-diffN).trim()));
            var temp = F.popProp * (1 - F.popProp);
            var sqrt = Math.sqrt(temp / F.sampleSize);
            var sqrtFo = M.n("%7.3f".sprintf(sqrt).trim());
            var thirdTerm = M._frac(diff, sqrtFo);
            
            var z = diffN / sqrt;
            
            var fourthTerm = z >= 0 ?
                M.n(fo.sprintf(z).trim()) :
                M.row(M.minus + M.n(fo.sprintf(-z).trim()));
            F[Options.SSZT.whichMathAux]("z", firstTerm, secondTerm, thirdTerm, fourthTerm);
            // results
            F.nullHypotElt.html("p = " + F.popProp);
            F.altHypoElt.html("p &ne; " + F.popProp);
            F.resultAlphaElt.html(F.alpha);
            var zCrit = Math.abs(gNormalDistribuionCalculator.inverseCdfStdNormal(F.alpha/2));
            var plusMinus = "&#177;";
            var fo = "%10.3f";
            var zCritFo = plusMinus + fo.sprintf(zCrit).trim();
            F.critValElt.html(zCritFo);
            var zFo = z >= 0 ? fo.sprintf(z).trim() : "&ndash;" + fo.sprintf(-z).trim();
            F.testStatElt.html(zFo);
            var rejectNull = Math.abs(z) > zCrit;
            if (rejectNull){
                F.decisionElt.html(H.span("Reject the Null", {"class": "reject"}));
            } else {
                F.decisionElt.html(H.span("Fail to Reject the Null", {"class": "failReject"}));
            }
        }
    },
    testNames: ["zMeanTest", "tMeanTest", "zPropTest"],
    runningTest: null,
    sampSizeSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.sampleSize = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
	popMeanSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.popMean = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
	popStdSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.popStd = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
	sampMeanSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.sampleMean = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
	sampStdSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.sampleStd = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
	samplePropSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.sampleProp = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
	popPropSliderCallback: function(value){
	   this.valElt.html(value);
       this.obj.popProp = value;
       if (!this.obj.omitMath){
           this.obj.runningTest.run();
       }
    },
    makeRhoHat: function(){
        return M.mathInlineCenter(M.row(M._overHat("&rho;")));
    },
    makeHtml: function(){
        var sliderNameTrunks = ["sampSize", "popMean", "popStd", "sampMean", "sampStd", "sampleProp", "popProp"];
        var sliderNames = sliderNameTrunks.map(function(nameTrunk, index){
            return nameTrunk + "Slider";
        });
        var valueIds = sliderNameTrunks.map(function(nameTrunk, index){
            return nameTrunk + "Val";
        });
        var callbackNames = sliderNames.map(function(name, index){
            return name + "Callback";
        });
        var THIS = this;
        var optionsArr = sliderNames.map(function(name, index){
            return THIS[name + "Options"];
        });
        for (var i=0; i<sliderNames.length; i++){
            var o = optionsArr[i];
            var sName = sliderNames[i];
            var cbName = callbackNames[i];
            this[sName] = new Slider({min: o.min, max: o.max, value: o.value, step: o.step, id: sName, callback: this[cbName]});
        }
        for (var i=0; i<sliderNames.length; i++){
            var sName = sliderNames[i];
            this[sName].obj = this;
            this[sName].valId = valueIds[i];
        }
        //function sp(w){ return H.td("", {style: "min-width: " + w + "px;"}); }
        //var leftSpacer = sp(this.sliderTableLeftSpacerWidth);
        //var rightSpacer = sp(this.sliderTableRightSpacerWidth);
        var leftSpacer = H.td("", {"class": "leftSliderTableSpacer"});
        var rightSpacer = H.td("", {"class": "rightSliderTableSpacer"});
        function row(label, sliDiv, valId){
            return H.tr(
                H.thLeft(label, {"class": "lineBreakDisabled"}) + leftSpacer +
                H.td(sliDiv, {"class": "fullWidth"}) + rightSpacer +
                H.tdRight(H.span("", {id: valId, "class": "sliderValue"}), {"class": "sliderValueTd"})
            )
        }
        function it(content){
            return H.span(content, {style: "font-style: italic;"});
        }
        function boit(content){
            return H.span(content, {style: "font-style: italic; font-weight: bold"});
        }
        var sliderLabels = [
            "Adjust the Sample Size (" + it("n") + "):",
            "Adjust the Population Mean (" + it("&mu;") + "):",
            "Adjust the Population Standard Deviation (" + it("&sigma;") + "):",
            "Adjust the Sample Mean (" + it(H.overBar("x")) + "):",
            "Adjust the Sample Standard Deviation (" + it("s") + "):",
            "Adjust the Sample Proportion (" + M.mathInlineCenter(M.row(M._overHat("p"))) + "):",
            "Adjust the Population Proportion (" + it(H.withIndex("p", "0")) + "):"
        ];
        var trs = new Array(sliderNames.length);
        for (var i=0; i<sliderNames.length; i++){
            var sName = sliderNames[i];
            var slider = this[sName];
            trs[i] = row(sliderLabels[i], slider.html, slider.valId);
        }
        // put alpha buttons into first row of slidertable, using colspan
        var alphaButtonBar = new ButtonBar({
            buttonLabels: this.alphaButtonCaptions,
            omitHeader: true,
            selectedIndex: this.initiallyChosenAlphaIndex,
            idPrefix: "alpha",
            name: "alphaButtonBar",
            app: this,
            //tableStyle: {"background-color": "rgb(199, 199, 199)"},
            btnClass: "alphaButton",
            chosenButtonClass: "bold chosen",
            callback: this.alphaButtonClick
        });
        var btns = alphaButtonBar.html;
        var firstRow = H.tr(
            H.thLeft("Set the desired Significance Level (&alpha;):", {"class": "lineBreakDisabled"}) + leftSpacer +
            H.td(btns, {"class": "fullWidth"}) + H.td("") + H.td("")
            
        );
        // the td with btns in it should better have colspan 3, and the 2 empty tds at end removed.
        // for some reason, that makes the sliders too short (unless in firefox) 
        var sliderTable = H.table(firstRow + trs.join(""), {id: "sliderTable", "class": "fullWidth"});
        var choices = this.testNames.map(function(testName, index){
            return THIS[testName].title;
        });
        var testSelectLabel = "Select the appropriate test: ";
        testSelectLabel = "Select the appropriate Test: ";
        var typeSelectHtml = H.table(
            H.tr(
                H.thLeft(testSelectLabel) +
                H.td(H.select(choices, {id: "testSelector"}), {id: "testSelectorTd"})
            ), {id: "testSelectorTable"}
        );
        var resetBtn = H.btn("Reset All", {"class": "lineBreakDisabled", id: "resetButton"});
        var upper = H.table(
            H.tr(H.td(typeSelectHtml) + H.tdRight(resetBtn))
            , {id: "upperTable", "class": "fullWidth"}
        );
        var leftTable = H.table00(
            H.tr(H.td(upper, {"class": "fullWidth"})) +
            H.tr(H.td(sliderTable))
            , {id: "leftTable",  style: "width: " + this.sliderTableWidth + "px;"}
        );
        /*var html = H.table(
            H.tr(
                H.td(leftTable) +
                H.td(mathHtml)
            )
        );*/
        var results = H.table(
            H.tr(H.thLeft(H.withIndex("H", 0) + ":") + H.tdRight("", {id: "nullHypothesis"})) +
            H.tr(H.thLeft(H.withIndex("H", "A") + ":") + H.tdRight("", {id: "alternativeHypothesis"})) +
            H.tr(H.thLeft("Alpha (&alpha;):") + H.tdRight("", {id: "resultAlpha"})) +
            H.tr(H.thLeft("Critical Value:") + H.tdRight("", {id: "criticalValue"})) +
            H.tr(H.thLeft("Test Statistic:") + H.tdRight("", {id: "testStatistic"})) +
            H.tr(H.thLeft("Decision:") + H.tdRight("", {id: "decision"}))
            , {id: "results"}
        );
        var lower = H.table(
            H.tr(
                H.td("", {id: "math"}) +
                H.tdRight(results, {id: "tdResults"})
            )
            , {id: "lower", "class": "fullWidth"}
        );
        var html = H.table00(
            H.tr(H.td(leftTable)) +
            H.tr(H.td(lower))
            , {id: "SSZT"}
        );
        return html;
    },
    run: function(){
        if (Options.SSZT.useBoldMath == "always"){
            this.useBoldMath = true;
        } else {
            if (Options.SSZT.useBoldMath == "never"){
                this.useBoldMath = false;
            } else {
                if (Options.SSZT.useBoldMath == "firefox"){
                    if (navigator.userAgent.indexOf("Firefox") == -1){
                        this.useBoldMath = false;
                    } else {
                        this.useBoldMath = true;
                    }
                } else {
                    console.log("invalid option for useBoldMath in single sample z and t test (SSZT): " + Options.SSZT.useBoldMath);
                    this.useBoldMath = false;
                }
            }
        }
        if (gNormalDistribuionCalculator == null){
            gNormalDistribuionCalculator = new NdCalc();
        }
        this.run1(this.indexOfInitiallySelectedTest);
    },
    run1: function(testIndex){
        this.omitMath = true;
        this.alpha = this.alphaButtonValues[this.initiallyChosenAlphaIndex];
        this.runningTest = this[this.testNames[testIndex]];
        gUniverseElt.html(this.makeHtml());
        this.nullHypotElt = $("#nullHypothesis");
        this.altHypoElt = $("#alternativeHypothesis");
        this.resultAlphaElt = $("#resultAlpha");
        this.critValElt = $("#criticalValue");
        this.testStatElt = $("#testStatistic");
        this.decisionElt = $("#decision");
        var selectorElt = $("#testSelector");
        var selectorOptions = selectorElt.find("option");
        var THIS = this;
        this.testNames.map(function(testName, index){
            selectorOptions.eq(index).attr("value", testName);
            THIS[testName].obj = THIS;
            THIS[testName].index = index;
        });
        this.selectorElt = selectorElt;
        selectorElt.change(this.testSelectionChange);
        var allSliders = [this.sampSizeSlider, this.popMeanSlider, this.popStdSlider, this.sampMeanSlider, this.sampStdSlider, this.samplePropSlider, this.popPropSlider];
        allSliders.map(function (s){
            s.init();
        });
        allSliders.map(function (s){
            s.valElt = $("#" + s.valId);
        });
        allSliders.map(function(s) {
            s.callback(s.get());
        });
        selectorElt[0].selectedIndex = testIndex;
        this.testSelectionChange.call(selectorElt[0]);
        this.alphaButtonBar.init();
        //var bg = this.sampMeanSlider.backgroundColor;
        var bg = Options.SSZT.backgroundColor;
        $("#sliderTable").css("background-color", bg);
        $("#upperTable").css("background-color", bg);
        $("table#SSZT").css("border", Options.SSZT.borderAroundEverything);
        $("#resetButton").click(function(){SSZT.run();});
        //window.setTimeout(function(){M.render();}, 200);
        this.omitMath = false;
        //this.runningTest.run();
        window.setTimeout(function(){SSZT.runningTest.run();}, 200);
        $("#testSelector").customSelect({selectBoxWidth: 350});
    },
    alphaButtonClick: function(index, evt, domElt){
        this.app.alpha = this.app.alphaButtonValues[index];
        this.app.runningTest.run();
    },
    testSelectionChange: function(){
        var testName = this.options[this.selectedIndex].value;
        var test = SSZT[testName];
        var visibilities = test.sliderVisibilities;
        for (var sliderName in visibilities){
            var visible = visibilities[sliderName];
            var action = visible ? "show" : "hide";
            SSZT[sliderName].elt.parent().parent()[action]();
        }
        SSZT.runningTest = test;
        test.run();
    }
};
/*******************************************************************************************************
 F68 (Effect of Sample Size on Standard Error) 
*******************************************************************************************************/
F68 = {
    sliderLeftSpacing: Options.F68.sliderLeftSpacing,
    minimumSampleSize: Options.F68.minimumSampleSize,
    maximumSampleSize: Options.F68.maximumSampleSize,
    minimumStd: Options.F68.minimumStd,
    maximumStd: Options.F68.maximumStd,
    leftCanvasWidth: Options.F68.leftCanvasWidth,
    rightCanvasWidth: Options.F68.rightCanvasWidth,
    leftCanvasHeight: Options.F68.leftCanvasHeight,
    rightCanvasHeight: Options.F68.rightCanvasHeight,
    dotRadius: Options.F68.dotRadius,
    pops: [
        {
            name: "Blue Population",
            color: "blue",
            faintColor: Options.F68.faintBlue,
            initialSampleSize: 10,
            initialStdDev : 3,
            idTrunk: "blue"
        },
        {
            name: "Purple Population",
            color: "#800080",
            faintColor: Options.F68.faintPurple,
            initialSampleSize: 10,
            initialStdDev : 3.5,
            idTrunk: "purple"
        },
        {
            name: "Red Population",
            color: "red",
            faintColor: Options.F68.faintRed,
            initialSampleSize: 10,
            initialStdDev : 4,
            idTrunk: "red"
        }
    ],
    makeSampSizeSliderCallback: function(popIndex){
        return function(value, mode){
            //console.log(this.app.pops[popIndex].name + " " + value);
            this.valElt.html(value);
            this.app.pops[popIndex].sampSize = value;
            this.app.action(mode, "sampSize", popIndex);
        }
    },
    makeStdDevSliderCallback: function(popIndex){
        return function(value, mode){
            //console.log(this.app.pops[popIndex].name + " " + value);
            this.valElt.html(value);
            this.app.pops[popIndex].stdDev = value;
            this.app.action(mode, "stdDev", popIndex);
        }
    },
    run: function(){
        var sampSizes = this.pops.map(function(item){return item.initialSampleSize;});
        var stdDevs = this.pops.map(function(item){return item.initialStdDev;});
        this.run1(sampSizes, stdDevs);
    },
    run1: function(sampSizes, stdDevs){
        var THIS = this;
        for (var i=0; i<this.pops.length; i++){
            var pop = this.pops[i];
            var sampSize = sampSizes[i];
            var stdDev = stdDevs[i];
            pop.sampSize = sampSize;
            pop.stdDev = stdDev;
            pop.sliSampSize = new Slider({
                min: this.minimumSampleSize, max: this.maximumSampleSize, value: sampSize, step: 1,
                id: pop.idTrunk + "SampSizeSlider", callback: this.makeSampSizeSliderCallback(i)
            });
            pop.sliSampSize.app = this;
            pop.sliStdDev = new Slider({
                min: this.minimumStd, max: this.maximumStd, value: stdDev, step: 0.1,
                id: pop.idTrunk + "StdDevSlider", callback: this.makeStdDevSliderCallback(i)
            });
            pop.sliSampSize.app = this;
            pop.sliStdDev.app = this;
        }
        var reset = H.btn("Reset All", {id: "resetBtn", "class": "fullWidth"});
        var headerRow = H.tr(H.tdCenter(reset) + this.pops.map(function(pop, index){
            return H.th(pop.name, Style.attachToAtts({id: pop.idTrunk + "ColHead", "class": "sliColHead", colspan: 3}, {color: pop.color}) );
        }).join(""), {"class": "headerRow"});
        var spacer = H.td("", Style.toAtts({"min-width": this.sliderLeftSpacing, width: this.sliderLeftSpacing}));
        var sliWidth = 100/this.pops.length + "%";
        function sliderRow(lbl, sliName){
            return H.tr(H.thLeft(lbl, {"class": "lineBreakDisabled sliRowHead"}) + THIS.pops.map(function(pop, index){
                var sli = pop["sli" + sliName];
                var id = sli.id;
                return spacer + H.td(sli.html, {id: id + "Td", width: sliWidth}) + H.tdRight("val", {id: id + "Val", "class": "sliderValueElt"});
            }).join(""), {id: sliName + "Row"});
        }
        var sampRow = sliderRow("Sample Size (" + H.italic("n") + "):", "SampSize");
        var stdRow = sliderRow("Standard Deviation (" + H.italic("&sigma;") + "):", "StdDev");
        var sliderTable = H.table00(headerRow + sampRow + stdRow, {id: "sliderTable", "class": "fullWidth"});
        var info1 = H.table(
            H.tr(H.tdCenter("Sampling Distributions")) +
            H.tr(H.tdCenter("Standard Deviations (SD) and Standard Errors (SE)"))
        );
        var info2 = H.table00(
            H.tr(H.th("SD:") + this.pops.map(function(pop, index){
                return H.td("", Style.attachToAtts({id: pop.idTrunk + "SD", "class": "info " + pop.idTrunk + " firstRow"}, {color: pop.color}));
            }).join("")) +
            H.tr(H.th("SE:") + this.pops.map(function(pop, index){
                return H.td("", Style.attachToAtts({id: pop.idTrunk + "SE", "class": "info " + pop.idTrunk + " lastRow"}, {color: pop.color}));
            }).join(""))
            , {align: "center"}
        );
        var info = H.table(H.trtd(info1) + H.trtd(info2));
        var lowerLeft = H.table(
            H.tr(H.tdCenter(info)) +
            H.tr(H.td(H.canvas({id: "leftCanvas", width: this.leftCanvasWidth, height: this.leftCanvasHeight})))
        );
        
        var rightTitle = H.table(H.tr(H.tdCenter("The Effect of Sample Size")) + H.tr(H.tdCenter("on the Standard Error")));
        var overRightCanvasInfo = H.span(rightTitle, {
            id: "overRightCanvasInfo", "class": "overCanvasInfo",
            style: "left: 240px; top: 25px;"
        });
        var rightCanvasParent = H.div(
            H.canvas({id: "rightCanvas", width: this.rightCanvasWidth, height: this.rightCanvasHeight}) + overRightCanvasInfo
            , {id: "rightCanvasParent", style: "position: relative; z-index: 0;"}
        );
        
        
        var lower = H.table00(H.tr(
            H.td(lowerLeft) +
            H.td(rightCanvasParent)
        ));
        var html = H.table(
            H.tr(H.td(sliderTable)) +
            H.tr(H.td(lower))
            , {id: "F68"}
        );
        gUniverseElt.html(html);
        for (var i=0; i<this.pops.length; i++){
            var pop = this.pops[i];
            pop.sliSampSize.valElt = $("#" + pop.sliSampSize.id + "Val");
            pop.sliSampSize.init();
            pop.sliSampSize.valElt.html(pop.sampSize);
            pop.sliStdDev.valElt = $("#" + pop.sliStdDev.id + "Val");
            pop.sliStdDev.init();
            pop.sliStdDev.valElt.html(pop.stdDev);
        }
        this.leftCtx = $("#leftCanvas")[0].getContext("2d");
        this.rightCtx = $("#rightCanvas")[0].getContext("2d");
        this.action("stop");
        $("#resetBtn").click(function(){
            F68.run();
        });
        this.moc = new MouseCanvas({
            id: "rightCanvas",
            xMin : this.getRightXMin(),
            xMax : this.getRightXMax(),
            yMin : this.getRightYMin(),
            yMax : this.getRightYMax(),
            mousemove: function(xScaled, yScaled, evt, xCanvas, yCanvas){
                var xs = [];
                var ys = [];
                for (var i=0; i<THIS.pops.length; i++){
                    var pop = THIS.pops[i];
                    if (pop.sliStdDev.active) return;
                    if (pop.sliSampSize.active) return;
                    var x = pop.sampSize;
                    var y = pop.stdDev / Math.sqrt(pop.sampSize);
                    xs.push(x);
                    ys.push(y);
                }
                var me = THIS.moc;
                var wScaled = me.xMax - me.xMin;
                var hScaled = me.yMax - me.yMin;
                var wCanv = me.ctx.canvas.width;
                var hCanv = me.ctx.canvas.height;
                var wFactor = wCanv / wScaled;
                var hFactor = hCanv / hScaled;
                function closestIndex(){
                    var result = -1;
                    var dMin = Infinity;
                    for (var i=0; i<THIS.pops.length; i++){
                        var x = xs[i];
                        var y = ys[i];
                        var dx = xScaled - x;
                        var dy = yScaled - y;
                        var dxs = dx * wFactor;
                        var dys = dy * hFactor
                        var d = Math.sqrt(dxs*dxs + dys*dys);
                        if (d<dMin){
                            dMin = d;
                            result = i;
                        }
                    }
                    if (dMin > THIS.dotRadius * 1.1){
                        return -1;
                    }
                    return result;
                }
                var ci = closestIndex();
                if (ci == -1){
                    THIS.action("stop");
                } else {
                    THIS.action("slide", "", ci);
                }
            }
        });
    },
    getRightXMin: function(){
        return -9;
    },
    getRightXMax: function(){
        return this.maximumSampleSize + 2;
    },
    getRightYMin: function(){
        return 0.12;
    },
    getRightYMax: function(){
        return 1.9;
    },
    action: function(mode, sliderType, index){
        $(".info").css("border-left", "1px solid transparent");
        $(".info").css("border-right", "1px solid transparent");
        $(".info.firstRow").css("border-top", "1px solid transparent");
        $(".info.lastRow").css("border-bottom", "1px solid transparent");
        // *** left
        var ctx = this.leftCtx;
        CANVAS.erase(ctx);
        // draw axis
        var xMin = -7, xAxisMin = -6;
        var xMax = 5.5, xAxisMax = 6;
        var yMin = -0.08, yAxisMin = 0;
        var yMax = 1.06, yAxisMax = 1;
        CANVAS.xyAxis(ctx,
            { min: xMin, axisMin: xAxisMin, max: xMax, axisMax: xAxisMax, axisLabel: "" },
            { min: yMin, axisMin: yAxisMin, max: yMax, axisMax: yAxisMax, axisLabel: "", narrowness: 0.6 },
            { xValueOfYaxis : -6, allYlabels: true}
        );
        // draw plots
        this.leftCanvasPlots = [];
        for (var i=0; i<this.pops.length; i++){
            var pop = this.pops[i];
            $("#" + pop.idTrunk + "SD").html(pop.stdDev);
            $("#" + pop.idTrunk + "SE").html("%5.3f".sprintf(pop.stdDev/Math.sqrt(pop.sampSize)));
            var plotOptions = {
                xMin: xMin, xMinPlot: xAxisMin, xMax: xMax, xMaxPlot: xAxisMax,
                yMin: yMin, yMinPlot: yAxisMin, yMax: yMax, yMaxPlot: yAxisMax,
                step: 0.015, color: pop.color
            };
            function makeNormalPDF(sigma){
                return function(x){
                    return pdfStdNormal(x/sigma)/sigma;
                }
            }
            var plot = new CanvasPlot(ctx, makeNormalPDF(pop.stdDev/Math.sqrt(pop.sampSize)), plotOptions);
            this.leftCanvasPlots.push(plot);
            plot.plot();
        }
        // *** right *******************
        ctx = this.rightCtx;
        CANVAS.erase(ctx);
        // draw axis
        var xMin = this.getRightXMin(), xAxisMin = 0;
        var xMax = this.getRightXMax(), xAxisMax = this.maximumSampleSize;
        var yMin = this.getRightYMin(), yAxisMin = 0.3;
        var yMax = this.getRightYMax(), yAxisMax = 1.85;
        this.xAxisMin = xAxisMin;
        this.xAxisMax = xAxisMax;
        this.yAxisMin = yAxisMin;
        this.yAxisMax = yAxisMax;
        CANVAS.xyAxis(ctx,
            { min: xMin, axisMin: xAxisMin, max: xMax, axisMax: xAxisMax, axisLabel: "Sample Size" },
            { min: yMin, axisMin: yAxisMin, max: yMax, axisMax: yAxisMax, axisLabel: "Standard Error of the Mean     ", majorStep: 0.1, minorStep: 0.05 },
            { xValueOfYaxis : 0, yValueOfXaxis: 0.3, allYlabels: true, allXlabels: true}
        );
        this.rightCanvasPlots = [];
        for (var i=0; i<this.pops.length; i++){
            var pop = this.pops[i];
            var plotOptions = {
                xMin: xMin, xMinPlot: 1, xMax: xMax, xMaxPlot: xAxisMax,
                yMin: yMin, yMinPlot: yAxisMin, yMax: yMax, yMaxPlot: yAxisMax,
                step: 0.05, color: pop.faintColor
            };
            function makeSEfun(sigma){
                return function(n){
                    return sigma/Math.sqrt(n);
                }
            }
            var plot = new CanvasPlot(ctx, makeSEfun(pop.stdDev), plotOptions);
            this.rightCanvasPlots.push(plot);
            plot.plot();
        }
        // dots
        for (var i=0; i<this.pops.length; i++){
            var pop = this.pops[i];
            var plot = this.rightCanvasPlots[i];
            var x = pop.sampSize;
            var xc = plot.xTrafo(x);
            var y = pop.stdDev / Math.sqrt(pop.sampSize);
            var yc = plot.yTrafo(y);
            ctx.fillStyle = pop.color;
            ctx.beginPath();
            ctx.arc(xc, yc, this.dotRadius, 0, Math.PI*2);
            ctx.fill();
        }
        if (mode == "slide" /*&& sliderType == "sampSize"*/){
            this.showPoint(index);
        }
    },
    showPoint: function(index){
        pop = this.pops[index];
        plot = this.rightCanvasPlots[index];
        plot.showPoint(pop.sampSize, {
            color: pop.color, axisX: 0, axisY: this.yAxisMin
        });
        $(".info" + "." + pop.idTrunk + ".firstRow").css({
            "border-top": "1px solid black",
        });
        $(".info" + "." + pop.idTrunk + ".lastRow").css({
            "border-bottom": "1px solid black",
        });
        $(".info" + "." + pop.idTrunk).css({
            "border-left": "1px solid black",
            "border-right": "1px solid black"
        });
    }
};
/*******************************************************************************************************
 F69 (Central Limit Theorem)
*******************************************************************************************************/
F69 = {
    spaceBetweenSliders: 4,
    controls: {},
    elts: {},
    canvasWidth: 650,
    canvasHeight: 300,
    population: null,
    minSalary: 0,
    maxSalary: 172000,
    numPopulationBins: 18,
    numSampDistBins: 36,
    populationBins: null,
    sampleDistBins: null,
    populationSize: 3000,
    initialSampleSize: 100,
    initialNumberOfSamples: 500,
    populationBarColor: "rgb(159,158,204)",
    sampMeanDistBarColor: "rgb(204,211,247)",
    generateDataAux: function(size, minValue, maxValue, leftParam, rightParam){
        // use a cauchy distribution, restricted to the range [leftParam, rightParam],
        // and then scale to give [minValue, maxValue]
        var a0 = Math.atan(leftParam);
        var a1 = Math.atan(rightParam) - a0;
        var result = new Array(size);
        var scaleFactor = (maxValue - minValue)/(rightParam - leftParam);
        var b0 = minValue - scaleFactor * leftParam;
        for (var i=0; i<size; i++){
            var cauchy = Math.tan(a1 * Math.random() + a0);
            var salary = b0 + scaleFactor * cauchy;  // = minValue + scaleFactor * (cauchy - leftParam);
            result[i] = salary;
        }
        return result.sortASC();
    },
    generateDataAux2: function(size, maxValue, leftParam, rightParam, beta){
        // min is zero
        // some phantasy distribution, because the cauchy from generateDataAux initial version appeared a little too heavy tailed
        var a0 = Math.atan(leftParam);
        var a1 = Math.atan(rightParam) - a0;
        var lp1 = leftParam + beta * leftParam * leftParam * leftParam;
        var rp1 = rightParam + beta * rightParam * rightParam * rightParam;  
        var result = new Array(size);
        var scaleFactor = maxValue/(rp1 -lp1);
        var b0 = - scaleFactor * lp1;
        for (var i=0; i<size; i++){
            var cauchy = Math.tan(a1 * Math.random() + a0);
            var adjCauchy = cauchy * (1 + beta * cauchy*cauchy);
            var salary = b0 + scaleFactor * adjCauchy;
            result[i] = salary;
        }
        return result.sortASC();   // need to sort for the median to work
    },
    generatePopulation: function(){
        this.population = this.generateDataAux2(this.populationSize, this.maxSalary, -0.55, 3.7, 0.03);
        this.populationBins = this.population.binCount(this.numPopulationBins);
    },
    sampleSizeSliderCallback: function(value){
        this.valElt.html(value);
        this.app.sampleSize = value;
        this.app.go2();
    },
    numSamplesSliderCallback: function(value){
        this.valElt.html(value);
        this.app.numberOfSamples = value;
        this.app.go2();
    },
    makeHtml: function(){
        var tr1 = H.tr(H.td(
            H.table(
                H.tr(
                    H.th("Generate the Population") +
                    H.td(H.btn("Go", {id: "goButton"}))
                ), {id: "goButtonTable"}
            )
        ));
        var sampleSizeSlider = new Slider({min: 10, max: 200, value: this.initialSampleSize, step: 1, id: "sampleSizeSlider", callback: this.sampleSizeSliderCallback});
        this.controls.sampleSizeSlider = sampleSizeSlider;
        var numSamplesSlider = new Slider({min: 50, max: 2000, value: this.initialNumberOfSamples, step: 1, id: "numSamplesSlider", callback: this.numSamplesSliderCallback});
        this.controls.numSamplesSlider = numSamplesSlider;
        sampleSizeSlider.app = this;
        sampleSizeSlider.valId = "sampleSizeSliderValue";
        sampleSizeSlider.labelText = "Sample Size (" + H.italic("n") + "):";
        numSamplesSlider.app = this;
        numSamplesSlider.valId = "numSamplesSliderValue";
        numSamplesSlider.labelText = "Number of Samples to Draw:";
        
        var leftSpacer = H.td("", {"class": "leftSliderTableSpacer"});
        var rightSpacer = H.td("", {"class": "rightSliderTableSpacer"});
        var rightSpacer2 = H.td("", {"class": "rightSliderTableSpacer2"});
        function row(slider){
            return H.tr(
                H.thLeft(slider.labelText, {"class": "lineBreakDisabled"}) + leftSpacer +
                H.td(slider.html, {"class": "fullWidth"}) + rightSpacer +
                H.tdRight(H.span("", {id: slider.valId, "class": "sliderValue"}), {"class": "sliderValueTd"}) + rightSpacer2 +
                H.td(H.btn("Reset", {id: slider.id + "Reset"}))
            )
        }
        var sliderTable = H.table(
            row(sampleSizeSlider) +
            H.tr("", {height: this.spaceBetweenSliders}) +
            row(numSamplesSlider)
            , {id: "sliderTable", "class": "fullWidth"}
        );
        var tr2 = H.tr(H.td(sliderTable));
        var popCanvHtml = H.canvas({width: this.canvasWidth, height: this.canvasHeight, id: "popCanvas"});
        
        var popCanvTopInfo = H.table(
            H.tr(H.tdCenter("", {id: "popInfoRow1"})) +
            H.tr(H.tdCenter("", {id: "popInfoRow2"}))
            , {id: "popInfoTable", align: "center"}
        );
        var sampleCanvTopInfo = H.table(
            H.tr(H.tdCenter("", {id: "sampleInfoRow1"})) +
            H.tr(H.tdCenter("", {id: "sampleInfoRow2"}))
            , {id: "sampleInfoTable", align: "center"}
        );
        var trPre3 = H.tr(H.td(popCanvTopInfo));
        var tr3 = H.tr(H.td(popCanvHtml));
        var sdCanvHtml = H.canvas({width: this.canvasWidth, height: this.canvasHeight, id: "sdCanvas"});
        var trPre4 = H.tr(H.td(sampleCanvTopInfo));
        var tr4 = H.tr(H.td(sdCanvHtml));
        return H.table(tr1 + tr2 + trPre3 + tr3 + trPre4 + tr4, {id: "F69"});
    },
    go: function(){
        this.generatePopulation();
        var ctx = this.popCtx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        hist = new Histogram(ctx, this.populationBins, {
            xMin: this.minSalary,
            xMax: this.maxSalary,
            leftGap: 46,
            xUseK: false,
            color: this.populationBarColor,
            yNarrowness: 0.5,
            xNarrowness: 0.6,
            xLabelAdjustmentFunction: function(str, num){
                return americanNumberFormat(str);
            }
        });
        this.popHist = hist;
        this.elts.popInfoRow1.html("The Population (" + H.italic("N") + " = 3,000)");
        var popMean   = Math.round(this.population.mean());
        var popMedian = Math.round(this.population.quantile(0.5));
        this.elts.popInfoRow2.html("Mean = $" + americanNumberFormat("" + popMean) + " and Median = $" + americanNumberFormat("" + popMedian));
        this.go2();
    },
    go2: function(){
        var means = new Array(this.numberOfSamples);
        for (var i=0; i<this.numberOfSamples; i++){
            var sample = this.population.randomSample(this.sampleSize);//.sortASC();
            means[i] = sample.mean();
        }
        means = means.sortASC();   // need to sort for the median to work
        var minMean1 = means.min();
        var maxMean1 = means.max();
        var minMean = Math.min(minMean1, 19000);
        var maxMean = Math.max(maxMean1, 61000);
        this.sampleDistBins = means.binCount(this.numSampDistBins, minMean, maxMean);
        var ctx = this.sdCtx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        hist2 = new Histogram(ctx, this.sampleDistBins, {
            leftGap: 41,
            xMin: minMean,
            xMax: maxMean,
            xUseK: false,
            color: this.sampMeanDistBarColor,
            yNarrowness: 0.4,
            xNarrowness: 0.6,
            xLabelAdjustmentFunction: function(str, num){
                return americanNumberFormat(str);
            }
        });
        this.sampleHist = hist2;
        this.elts.sampleInfoRow1.html("The Samples (" + americanNumberFormat("" + this.numberOfSamples) +
            " Samples of " + H.italic("n") + " = " +americanNumberFormat(""+this.sampleSize)+ " each)");
        var sampleMeansMean   = Math.round(means.mean());
        var sampleMeansMedian = Math.round(means.quantile(0.5));
        this.elts.sampleInfoRow2.html("Mean = $" + americanNumberFormat(""+sampleMeansMean) + " and Median = $" + americanNumberFormat(""+sampleMeansMedian));
    },
    run: function(){
        this.numberOfSamples = this.initialNumberOfSamples;
        this.sampleSize = this.initialSampleSize;
        gUniverseElt.html(this.makeHtml());
        this.elts.popInfoRow1 = $("#popInfoRow1");
        this.elts.popInfoRow2 = $("#popInfoRow2");
        this.elts.sampleInfoRow1 = $("#sampleInfoRow1");
        this.elts.sampleInfoRow2 = $("#sampleInfoRow2");
        for (c in this.controls){
            this.controls[c].init();
            this.controls[c].valElt = $("#" + this.controls[c].valId);
            this.controls[c].setValueField = function(v){ this.valElt.html(v); }
        }
        this.controls.sampleSizeSlider.setValueField(this.sampleSize);
        this.controls.numSamplesSlider.setValueField(this.numberOfSamples);
        var popCanv = $("#popCanvas");
        this.popCtx = popCanv[0].getContext('2d');
        var sdCanv = $("#sdCanvas");
        this.sdCtx = sdCanv[0].getContext('2d');
        this.go();
        $("#sampleSizeSliderReset").click(function(){
            F69.sampleSize = F69.initialSampleSize;
            F69.controls.sampleSizeSlider.valElt.html(F69.sampleSize);
            F69.controls.sampleSizeSlider.set(F69.sampleSize);
            F69.go2();
        });
        $("#numSamplesSliderReset").click(function(){
            F69.numberOfSamples = F69.initialNumberOfSamples;
            F69.controls.numSamplesSlider.valElt.html(F69.numberOfSamples);
            F69.controls.numSamplesSlider.set(F69.numberOfSamples);
            F69.go2();
        });
        $("#goButton").click(function(){F69.go();});
        /* histogram test
        var values = [3,2,5,4,3,4,5,4,2,3,4,5,3,6,5,2,4,3,7,7,5,6,4,2,4,1,6];
        h = new Histogram(popCtx, values, {
            xMin: 100,
            xMax: 360
        });*/
    }
};


/*******************************************************************************************************
 Figure121 (regression test)
*******************************************************************************************************/
Figure121 = {
    undoStack: [],
    data00: [[84.56, 79.21],[85.86, 78.34],[73.56, 72.40],[71.11, 69.17],[72.45, 70.88],[84.09, 69.64],[84.74, 80.92],[81.09, 71.12],[85.62, 72.38],[75.33, 72.70],[85.95, 75.31],[73.20, 69.09],[79.28, 73.15],[87.73, 73.60],[82.88, 76.47]],
    canvasId: "regressionCanvas",
    canvasWidth: 700,
    canvasHeight: 510,
    canvasGap: 1.3,
    ddCanv: null,
    canvasFont: "bold 12pt Arial",
    xTotalColor: "rgb(33,33,199)",
    yTotalColor: "rgb(211,33,33)",
    xyTotalColor: "rgb(68,111,64)",
    xxTotalColor: "rgb(113,46,110)",
    yyTotalColor: "rgb(186,130,74)",
    rColor: "rgb(120,20,134)",
    tColor: "rgb(183,105,227)",
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    //r1Content: '<math style="text-align: left;" display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi style="font-weight: bold;">r</mi><mo>=</mo><mfrac><mrow><mo>&#x2211;</mo><mi>x</mi><mi>y</mi><mo>-</mo><mo stretchy="true">(</mo><mrow><mfrac><mrow><mrow><mo>&#x2211;</mo><mi>x</mi><mo>&#x2211;</mo><mi>y</mi></mrow></mrow><mrow><mi>n</mi></mrow></mfrac></mrow><mo stretchy="true">)</mo></mrow><mrow><msqrt><mo stretchy="true">(</mo><mo>&#x2211;</mo><msup><mrow><mi>x</mi></mrow><mrow><mn>2</mn></mrow></msup><mo>-</mo><mfrac><mrow><msup><mrow><mo stretchy="false">(</mo><mo>&#x2211;</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><mrow><mn>2</mn></mrow></msup></mrow><mrow><mi>n</mi></mrow></mfrac><mo stretchy="true">)</mo><mo stretchy="true">(</mo><mo>&#x2211;</mo><msup><mrow><mi>y</mi></mrow><mrow><mn>2</mn></mrow></msup><mo>-</mo><mfrac><mrow><msup><mrow><mo stretchy="false">(</mo><mo>&#x2211;</mo><mi>y</mi><mo stretchy="false">)</mo></mrow><mrow><mn>2</mn></mrow></msup></mrow><mrow><mi>n</mi></mrow></mfrac><mo stretchy="true">)</mo></msqrt></mrow></mfrac></mrow></math>',
    Point: function(x, y, index){
        this.x = x;
        this.y = y;
        this.index = index;
        this.update1();
    },
    leftHtml: function(){
        var canvasId = this.canvasId;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var canvHtml = HtmlGen.canvas({id: canvasId, width: canvasWidth, height: canvasHeight});
        var leftTable = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td("H" + HtmlGen.sub("0") + ":") + HtmlGen.td("&rho; = 0")) +
            HtmlGen.tr(HtmlGen.td("H" + HtmlGen.sub("A") + ":") + HtmlGen.td("&rho; &ne; 0"))
            , {"class": "bold"}
        );
        var eq = HtmlGen.td("&nbsp;=&nbsp;");
        var tCritical = "t" + HtmlGen.sub("crit", {id: "criticalAlphaSubscript"});
        var midTable = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td("t", {align: "right"}) + eq + HtmlGen.td("", {id: "tSummary", align: "left"})) +
            HtmlGen.tr(HtmlGen.td("df &nbsp;=&nbsp; n &ndash; 2", {align: "right"}) + eq + HtmlGen.td("", {id: "dfSummary", align: "left"})) +
            HtmlGen.tr(HtmlGen.td(tCritical, {align: "right"}) + eq + HtmlGen.td("", {id: "tCriticalSummary", align: "left"}))
            , {"class": "bold"}
        );
        //var rightTable = HtmlGen.table(
        //    HtmlGen.tr(HtmlGen.td("Result"), {align: "center", "class": "bold"}) +
        //    HtmlGen.tr(HtmlGen.td(HtmlGen.div("", {id: "resultDiv"})))
        //);
        var rightTable = HtmlGen.fieldset(
            HtmlGen.legend("Result") +
            HtmlGen.div("", {id: "resultDiv"})
        );
        var spacer = HtmlGen.td("", {"class": "spacer2"});
        var lowerTable = HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(leftTable, {valign: "center"}) + spacer +
                HtmlGen.td(midTable) + spacer +
                HtmlGen.td(rightTable, {id: "resultTd"})
            )
        );
        lowerTable = HtmlGen.fieldset(HtmlGen.legend("Summary") + lowerTable, {id: "summaryFieldset"});
        var mainTable = HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(canvHtml)) +
            HtmlGen.tr(HtmlGen.tdCenter(lowerTable))
        );
        var alphaTable = this.alphaButtonsTableHtml();
        var alphaAndResetTable = H.table(H.tr(
            H.tdLeft(alphaTable) +
            H.tdRight(H.btn("reset", {id: "resetBtn"}))
        ), {"class": "fullWidth"});
        return HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(alphaAndResetTable)) +
            HtmlGen.tr(HtmlGen.td(mainTable))
        );
    },
    makeAlphaButtonHandler: function(index){
        return function(){
            if (Figure121.chosenAlphaIndex == index){
                return;
            }
            Figure121.chosenAlphaIndex = index;
            Figure121.updateSummary();
            var elt = $(this);
            elt.parents("table").first().find("button").removeClass("bold");
            elt.addClass("bold");
        }
    },
    alphaButtonsTableHtml: function(){
        var th = HtmlGen.th("Alpha Value: ");
        var THIS = this;
        var spacer = HtmlGen.td("", {"class": "spacer"});
        return HtmlGen.table(HtmlGen.tr( th + spacer +
            this.alphaButtonValues.map(function(alpha, index){
                return HtmlGen.td(HtmlGen.btn(THIS.alphaButtonCaptions[index], {id: "alphaButton" + index}));
            }).join(spacer)
        ));
    },
    regressionTableHtml: function(){
        function headingAux(line1, line2, line3, thAtts){
            var innerTable = HtmlGen.table(
                HtmlGen.tr(HtmlGen.tdCenter(line1, thAtts)) +
                HtmlGen.tr(HtmlGen.tdCenter(line2, thAtts)) +
                HtmlGen.tr(HtmlGen.tdCenter(line3, thAtts))
                , {"class": "fullWidth"}
            );
            return HtmlGen.thCenter(innerTable, thAtts);
        }
        function headingAux2(line, thAtts){
            return headingAux("&nbsp;", "&nbsp;", line, thAtts);
        } // &#9100;
        //var addBtn = HtmlGen.eisBtn("+", Style.attachToAtts({id: "addParticipantBtn", title: "add participant"}, {}));
        var undoBtn = HtmlGen.eisBtn("&#x21b6;", Style.attachToAtts({id: "undoBtn", title: "undo remove"}, {"font-size": "20px"}));
        var tdWithAddButton = headingAux2(undoBtn, {"class": "trash upperHeading"});
        var hIndex = headingAux2("Participant", {"class": "upperHeading"});
        var hX = headingAux("High&nbsp;School", "Math&nbsp;Grade", "x", {"class": "upperHeading"});
        var hY = headingAux("University", "Math&nbsp;Grade", "y", {"class": "upperHeading"});
        var hXY = headingAux2("xy", {"class": "upperHeading"});
        var hXX = headingAux2("x" + HtmlGen.sup("2"), {"class": "upperHeading"});
        var hYY = headingAux2("y" + HtmlGen.sup("2"), {"class": "upperHeading"});
        var trHeadings = HtmlGen.tr(tdWithAddButton + hIndex + hX + hY + hXY + hXX + hYY);
        function makeRow(index){
            var td0 = HtmlGen.tdCenter(HtmlGen.img("", {
                src: "img/trash2.png",
                width: "15px",
                height: "17px",
                id: "trash" + index,
                title: "remove participant " + (index+1),
                "class": "trashImg"
            }), {"class": "trash"});
            var td1 = HtmlGen.td(HtmlGen.span(index + 1, {id: "index" + index, "class": "index"}), {align: "center"});
            var td2 = HtmlGen.td("", {id: "x" + index, align: "center", "class": "x"});
            var td3 = HtmlGen.td("", {id: "y" + index, align: "center", "class": "y"});
            var td4 = HtmlGen.td("", {id: "xy" + index, align: "center", "class": "xy"});
            var td5 = HtmlGen.td("", {id: "xx" + index, align: "center", "class": "xx"});
            var td6 = HtmlGen.td("", {id: "yy" + index, align: "center", "class": "yy"});
            return HtmlGen.tr(td0 + td1 + td2 + td3 + td4 + td5 + td6);
        }
        var emptyTdClassTotal = HtmlGen.td("", {"class": "total"});
        var emptyTd = HtmlGen.td("");
        var totalIndex = HtmlGen.td(HtmlGen.span("&Sigma;", {"class": "index"}), {align: "center", "class": "total"});
        var totalX     = HtmlGen.td("", {align: "center", "class": "x total", id: "xTotal"});
        var totalY     = HtmlGen.td("", {align: "center", "class": "y total", id: "yTotal"});
        var totalXY    = HtmlGen.td("", {align: "center", "class": "xy total", id: "xyTotal"});
        var totalXX    = HtmlGen.td("", {align: "center", "class": "xx total", id: "xxTotal"});
        var totalYY    = HtmlGen.td("", {align: "center", "class": "yy total", id: "yyTotal"});
        var totalsRow = HtmlGen.tr(totalIndex + emptyTdClassTotal + totalX + totalY + totalXY + totalXX + totalYY);
        //var xBarTd = HtmlGen.thCenter("x&#772;");
        var xBarTd = H.thCenter(H.overBar("x"));
        var xMeanTd = HtmlGen.td("", {id:  "xMean", align: "center"});
        var yMeanTd = HtmlGen.td("", {id:  "yMean", align: "center"});
        var meansRow = HtmlGen.tr(xBarTd + emptyTd + xMeanTd + yMeanTd + emptyTd + emptyTd + emptyTd);
        var sTd = HtmlGen.thCenter("s");
        var xEmpStdTd = HtmlGen.tdCenter("", {id: "xEmpStd"});
        var yEmpStdTd = HtmlGen.tdCenter("", {id: "yEmpStd"});
        var empStdRow = HtmlGen.tr(sTd + emptyTd + xEmpStdTd + yEmpStdTd + emptyTd + emptyTd + emptyTd);
        var table = HtmlGen.table(
            trHeadings +
            this.data0.map(function(item, index){
                return makeRow(index);
            }).join("") +
            totalsRow +
            meansRow +
            empStdRow
            , {id: "regressionTable", cellspacing: 0, cellpadding: 0}
        );
        return table;
    },
    rTableHtml: function(){
        return HtmlGen.table(
            HtmlGen.tr(HtmlGen.td("", {id: "r1", align: "left"})) +
            HtmlGen.tr(HtmlGen.td("", {id: "r2", align: "left"})) +
            HtmlGen.tr(HtmlGen.td("", {id: "r3", align: "left"}))
            , {id: "r"}
        );
    },
    tTableHtml: function(){
        return HtmlGen.table(
            HtmlGen.tr(HtmlGen.td("", {id: "t1", align: "left"})) +
            HtmlGen.tr(HtmlGen.td("", {id: "t2", align: "left"})) +
            HtmlGen.tr(HtmlGen.td("", {id: "t3", align: "left"}))
            , {id: "t"}
        );
    },
    calcRThtml: function(){
        return HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(this.rTableHtml(), {align: "left"}) +
                HtmlGen.td("", {"class": "spacer2", style: "border-right: 1px solid black"}) +
                HtmlGen.td("", {"class": "spacer2"}) +
                HtmlGen.td(this.tTableHtml(), {align: "right"})
            )
            , {id: "rtTable"}
        );
    },
    rightHtml: function(){
        return HtmlGen.table(
            HtmlGen.tr(HtmlGen.td(this.regressionTableHtml())) + 
            HtmlGen.tr(HtmlGen.td(this.calcRThtml()))
        );
    },
    getX: function(item){ return item.x},
    getY: function(item){ return item.y},
    getXY: function(item){ return item.xy},
    getXX: function(item){ return item.xx},
    getYY: function(item){ return item.yy},
    getRawPoint: function(item){ return [item.x, item.y]; },
    calcTotals: function(){
        var sx = 0, sy = 0; sxy = 0; sxx = 0; syy = 0;
        var n = this.data.length;
        for (var i=0; i<n; i++){
            var p = this.data[i];
            sx += p.x;
            sy += p.y;
            sxy += p.xy;
            sxx += p.xx;
            syy += p.yy;
        }
        this.totals.x  = sx;
        this.totals.y  = sy;
        this.totals.xy = sxy;
        this.totals.xx = sxx;
        this.totals.yy = sxy;
        this.formattedTotals.x  = this.Point.prototype.xTotalFormat.sprintf(sx).trim();
        this.formattedTotals.y  = this.Point.prototype.yTotalFormat.sprintf(sy).trim();
        this.formattedTotals.xy = this.Point.prototype.xyTotalFormat.sprintf(sxy).trim();
        this.formattedTotals.xx = this.Point.prototype.xxTotalFormat.sprintf(sxx).trim();
        this.formattedTotals.yy = this.Point.prototype.yyTotalFormat.sprintf(syy).trim();
        this.totalElts.x.html(this.formattedTotals.x);
        this.totalElts.y.html(this.formattedTotals.y);
        this.totalElts.xy.html(this.formattedTotals.xy);
        this.totalElts.xx.html(this.formattedTotals.xx);
        this.totalElts.yy.html(this.formattedTotals.yy);
        var xMean = sx/n;
        var yMean = sy/n;
        this.xMean = xMean;
        this.yMean = yMean;
        this.xMeanElt.html(this.Point.prototype.xMeanFormat.sprintf(xMean).trim());
        this.yMeanElt.html(this.Point.prototype.yMeanFormat.sprintf(yMean).trim());
        var sumDiffX = 0, sumDiffY = 0;
        for (var i=0; i<n; i++){
            var p = this.data[i];
            var diffX = p.x - xMean;
            var diffY = p.y - yMean;
            var sdx = diffX * diffX;
            var sdy = diffY * diffY;
            sumDiffX += sdx;
            sumDiffY += sdy;
        }
        var empStdDevX = Math.sqrt(sumDiffX/(n-1));
        var empStdDevY = Math.sqrt(sumDiffY/(n-1));
        this.empStdDevX = empStdDevX;
        this.empStdDevY = empStdDevY;
        this.xEmpStdElt.html(this.Point.prototype.stdFormat.sprintf(empStdDevX).trim());
        this.yEmpStdElt.html(this.Point.prototype.stdFormat.sprintf(empStdDevY).trim());
        $("table#fig121 td.x.total").css("color", this.xTotalColor);
        $("table#fig121 td.y.total").css("color", this.yTotalColor);
        $("table#fig121 td.xy.total").css("color", this.xyTotalColor);
        $("table#fig121 td.xx.total").css("color", this.xxTotalColor);
        $("table#fig121 td.yy.total").css("color", this.yyTotalColor);
        var enu = sxy - sx * sy / n;
        var deno = Math.sqrt((sxx-sx*sx/n)*(syy-sy*sy/n));
        var r = enu/deno;
        var rFormatted = this.Point.prototype.rFormat.sprintf(r).trim();
        this.r = r;
        this.rFormatted = rFormatted;
        $("#rnum1").text(rFormatted);
        $("#rnum2").text(rFormatted);
        $("#rnum3").text(rFormatted);
        var t = r / Math.sqrt((1 - r*r)/(this.data.length-2));
        var tFormatted = this.Point.prototype.tFormat.sprintf(t).trim();
        this.t = t;
        this.tFormatted = tFormatted;
        $("#tnum").text(tFormatted);
        this.updateSummary();
    },
    updateSummary: function(){
        var n = this.data.length;
        this.dfSummaryElt.text(n-2);
        this.tSummaryElt.text(this.tFormatted);
        var tCrit = studentTcritical[this.alphaLookup[this.chosenAlphaIndex]][n-2];
        this.tCrit = tCrit;
        var format = "%5.3f";
        var tCritFormatted = format.sprintf(tCrit).trim();
        var plusMinus = "&#177;";
        $("#tCriticalSummary").html(plusMinus + " " + tCritFormatted);
        var alpha = this.alphaButtonValues[this.chosenAlphaIndex];
        format = "(&alpha;=%4.2f)";
        var alphaFormatted = format.sprintf(alpha);
        $("#criticalAlphaSubscript").html(alphaFormatted);
        var t = this.t;
        var rejectTheNull = ( Math.abs(t) > tCrit);
        var resultDiv = $("#resultDiv");
        var resultHtml;
        if (rejectTheNull){
            resultHtml = this.rejectNullHtml();
        } else {
            resultHtml = this.failToRejectNullHtml();
        }
        resultDiv.html(resultHtml);
        this.resultDiv = resultDiv;
    },
    failToRejectNullHtml: function(){
        var line1 = "&quot;Fail to Reject";
        var line2 = "the Null&quot;"
        return HtmlGen.table(
            HtmlGen.tr(HtmlGen.tdCenter(line1, {"class": "failToRejectNull"})) +
            HtmlGen.tr(HtmlGen.tdCenter(line2, {"class": "failToRejectNull"}))
            , {id: "resultTable", "class": "failToReject"}
        );
    },
    rejectNullHtml: function(){
        var txt = "&quot;Reject the Null&quot;";
        return HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(txt, {"class": "rejectNull", valign: "center"})
            )
            , {id: "resultTable", "class": "reject"}
        );
    },
    updateRworksOnlyInFirefoxForSomeReason: function(){
        this.numx1Elt.text(this.formattedTotals.x);        this.numx2Elt.text(this.formattedTotals.x);        this.numy1Elt.text(this.formattedTotals.y);
        this.numy2Elt.text(this.formattedTotals.y);        this.numxyElt.text(this.formattedTotals.xy);        this.numxxElt.text(this.formattedTotals.xx);        this.numyyElt.text(this.formattedTotals.yy);
    },
    updateR: function(){
        function aux(id, content){
            if ($("#" + id).find("span").length > 0){
                $("#" + id).find("span").text(content);
                //console.log("has span under it");
            } else {
                //console.log("has only text under it");
                $("#" + id).text(content);
            }
        }
        // ie and chrom: give "text only" on first run, and "span" in subsequent runs
        // firefox: give "text only" always.
        aux("xnum1", this.formattedTotals.x);
        aux("xnum2", this.formattedTotals.x);
        aux("ynum1", this.formattedTotals.y);
        aux("ynum2", this.formattedTotals.y);
        aux("xynum", this.formattedTotals.xy);
        aux("xxnum", this.formattedTotals.xx);
        aux("yynum", this.formattedTotals.yy);
    },
    makeRNumericalFormula: function(){
        function styleAux(color){
            if (color){
                return "color: " + color + "; font-weight: bold;";
            } else {
                return "font-weight: bold;";
            }
        }
        var xStyle = styleAux(this.xTotalColor);
        var yStyle = styleAux(this.yTotalColor);
        var xyStyle = styleAux(this.xyTotalColor);
        var xxStyle = styleAux(this.xxTotalColor);
        var yyStyle = styleAux(this.yyTotalColor);
        var nStyle = styleAux();
        var _sx  = this.formattedTotals.x;
        var _sy  = this.formattedTotals.y;
        var _sxy = this.formattedTotals.xy;
        var _sxx = this.formattedTotals.xx;
        var _syy = this.formattedTotals.yy;
        var _n = this.data.length;
        var sx1 = M.n(_sx, {style: xStyle, id: "xnum1"});
        var sx2 = M.n(_sx, {style: xStyle, id: "xnum2"});
        var sy1 = M.n(_sy, {style: yStyle, id: "ynum1"});
        var sy2 = M.n(_sy, {style: yStyle, id: "ynum2"});
        var sxy = M.n(_sxy, {style: xyStyle, id: "xynum"});
        var sxx = M.n(_sxx, {style: xxStyle, id: "xxnum"});
        var syy = M.n(_syy, {style: yyStyle, id: "yynum"});
        var n = M.n(_n, {style: nStyle});
        var enu = sxy + M.minus + M._withParens(M._frac(sx1 + M.cross + sy1, n));
        var denoPart1 = sxx + M.minus + M._frac(M._squared(sx2), n);
        var denoPart2 = syy + M.minus + M._frac(M._squared(sy2), n);
        denoPart1 = M._withParens2(denoPart1);
        denoPart2 = M._withParens2(denoPart2);
        var denom = M.sqrt(M.row(denoPart1 + denoPart2));
        var rhs = M._frac(enu, denom);
        var formula = this.mathJaxEqn("r", rhs);
        return M.mathBlockLeft(formula);
    },
    makeRresultFormula: function(){
        function styleAux(color){
            if (color){
                return "color: " + color + "; font-weight: bold;";
            } else {
                return "font-weight: bold;";
            }
        }
        var rStyle = styleAux(this.rColor);
        var rNum = M.n(this.rFormatted, {style: rStyle, id: "rnum1"});
        var formula = this.mathJaxEqn("r", rNum);
        return M.mathBlockLeft(formula);
    },
    makeTresultFormula: function(){
        function styleAux(color){
            if (color){
                return "color: " + color + "; font-weight: bold;";
            } else {
                return "font-weight: bold;";
            }
        }
        var tStyle = styleAux(this.tColor);
        var tNum = M.n(this.tFormatted, {style: tStyle, id: "tnum"});
        var formula = this.mathJaxEqn("t", tNum);
        return M.mathBlockLeft(formula);
    },
    mathJaxEqn: function(varName, rhs){
        var lhs = M.i(varName, {style: "font-weight: bold;"});
        return M.row(lhs + M.equals + rhs);
    },
    makeRFormula: function(){
        //return this.r1Content;
        var x = M.i("x");
        var y = M.i("y");
        var n = M.i("n");
        var sx = M.sum + x;
        var sy = M.sum + y;
        var sxy = M.sum + x + y;
        var sx2 = M.sum + M._squared(x);
        var sy2 = M.sum + M._squared(y);
        var sxp2 = M._squaredWithParens(sx);
        var syp2 = M._squaredWithParens(sy);
        var enumerator = sxy + M.minus + M._withParens2(M.row(M._frac(M.row(sx + sy), n)));
        var frac1 = M._frac(sxp2, n);
        var frac2 = M._frac(syp2, n);
        var first = M._withParens2(sx2 + M.minus + frac1);
        var second = M._withParens2(sy2 + M.minus + frac2);
        var denominator = M.sqrt(first + second);
        var rhs = M._frac(enumerator, denominator);
        var formula = this.mathJaxEqn("r", rhs);
        return M.mathBlockLeft(formula);
    },
    makeNumericalTFormula: function(){
        var color = this.rColor;
        var style = "color: " + color + "; font-weight: bold;";
        var r2 = M.n(this.rFormatted, {style: style, id: "rnum2"});
        var r3 = M.n(this.rFormatted, {style: style, id: "rnum3"});
        var enu = M.one + M.minus + M._squared(r3);
        var deno = M.n(this.data.length) + M.minus + M.two;
        var root = M.sqrt(M._frac(enu, deno));
        var result = M._frac(r2, root);
        return M.mathBlockLeft(this.mathJaxEqn("t", result));
    },
    makeTFormula: function(){
        var r = M.i("r");
        var e = M.one + M.minus + M._squared(r);
        var d = M.i("n") + M.minus + M.two;
        var deno = M.sqrt(M._frac(e, d));
        var result = M._frac(r, deno);
        return M.mathBlockLeft(this.mathJaxEqn("t", result));
    },
    run: function(data0){
        if (arguments.length < 1){
            data0 = this.data00;
        }
        this.data0 = data0;
        this.totals = {
            x:  0,
            y:  0,
            xy: 0,
            xx: 0,
            yy: 0
        };
        this.formattedTotals = {
            x:  "",
            y:  "",
            xy: "",
            xx: "",
            yy: ""
        };
        this.rFormatted = "0";
        this.tFormatted = "0";
        var canvasId = this.canvasId;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var html = HtmlGen.table(
            HtmlGen.tr(
                HtmlGen.td(this.leftHtml(), {id: "leftTd", valign: "top"}) +
                HtmlGen.td(this.rightHtml(), {id: "rightTd", valign: "top"})
            )
            , {cellspacing: 0, cellpadding: 0, id: "fig121"}
        );
        gUniverseElt.html(html);
        var THIS = this;
        var xMin = Infinity;
        var xMax = -Infinity;
        var yMin = Infinity;
        var yMax = -Infinity;
        var data = this.data0.map(function(item, index){
            var x = item[0];
            var y = item[1];
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y);
            return new THIS.Point(x, y, index);
        });
        xMin -= this.canvasGap;
        xMax += this.canvasGap;
        yMin -= this.canvasGap;
        yMax += this.canvasGap;
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.data = data;
        
        
        
        var xMin = 67;
        var xAxisMin = 69;
        var xMax = 88.5;
        var xAxisMax = 88;
        var yMin = 65;
        var yAxisMin = 67;
        var yMax = 82.5;
        var yAxisMax = 82;
        var xValueOfYaxis = 69;
        var yValueOfXaxis = 67;
        this.xMin = xMin;
        this.xAxisMin = xAxisMin;
        this.xMax = xMax;
        this.xAxisMax = xAxisMax;
        this.yMin = yMin;
        this.yAxisMin = yAxisMin;
        this.yMax = yMax;
        this.yAxisMax = yAxisMax;
        this.xValueOfYaxis = xValueOfYaxis;
        this.yValueOfXaxis = yValueOfXaxis;
        
        
        
        this.ddCanv = new DragDropCanvas({
            id: canvasId,
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax,
            points: data,
            repaintCallback: function(ctx){
                THIS.calcTotals();
                THIS.updateR();
                THIS.repaint.call(THIS, ctx);
            },
            getText: function(i){
                var ii = i + 1;
                return "" + ii;
            }
        });
        this.regressionTableElt = $("#regressionTable");
        var t = this.regressionTableElt;
        for (var i=0; i<this.data.length; i++){
            var p = this.data[i];
            p.indexElt = t.find("#index" + i);
            p.xElt = t.find("#x" + i);
            p.yElt = t.find("#y" + i);
            p.xyElt = t.find("#xy" + i);
            p.xxElt = t.find("#xx" + i);
            p.yyElt = t.find("#yy" + i);
            p.update2();
        }
        this.totalElts = {
            x:  $("#xTotal"),
            y:  $("#yTotal"),
            xy: $("#xyTotal"),
            xx: $("#xxTotal"),
            yy: $("#yyTotal")
        };
        this.xMeanElt = $("#xMean");
        this.yMeanElt = $("#yMean");
        this.xEmpStdElt = $("#xEmpStd");
        this.yEmpStdElt = $("#yEmpStd");
        this.rElt = $("#r");
        this.tElt = $("#t");
        this.r1Elt = this.rElt.find("#r1");
        this.r2Elt = this.rElt.find("#r2");
        this.r3Elt = this.rElt.find("#r3");
        this.t1Elt = this.tElt.find("#t1");
        this.t2Elt = this.tElt.find("#t2");
        this.t3Elt = this.tElt.find("#t3");
        this.repaint(this.ddCanv.mc.ctx);
        $(".index").removeClass("standardBorder");
        this.rFormula = this.makeRFormula();
        this.rNumFormula = this.makeRNumericalFormula();
        this.rResultFormula = this.makeRresultFormula();
        this.tFormula = this.makeTFormula();
        this.tNumFormula = this.makeNumericalTFormula();
        this.tResultFormula = this.makeTresultFormula();
        this.r1Elt.html(this.rFormula);
        this.r2Elt.html(this.rNumFormula);
        this.r3Elt.html(this.rResultFormula);
        this.t1Elt.html(this.tFormula);
        this.t2Elt.html(this.tNumFormula);
        this.t3Elt.html(this.tResultFormula);
        //this.numx1Elt = this.r2Elt.find("#xnum1");this.numx2Elt = this.r2Elt.find("#xnum2");this.numy1Elt = this.r2Elt.find("#ynum1");this.numy2Elt = this.r2Elt.find("#ynum2");this.numxyElt = this.r2Elt.find("#xynum");this.numxxElt = this.r2Elt.find("#xxnum");this.numyyElt = this.r2Elt.find("#yynum");
        this.dfSummaryElt = $("#dfSummary");
        this.tSummaryElt = $("#tSummary");
        this.calcTotals();
        this.updateR();
        $("#alphaButton" + this.chosenAlphaIndex).addClass("bold");
        //hookup alpha button handlers
        for (var i=0; i<this.alphaButtonValues.length; i++){
            var btnElt = $("#alphaButton" + i);
            btnElt.click(this.makeAlphaButtonHandler(i));
        }
        // hookup remove handlers
        for (var i=0; i<this.data.length; i++){
            $("#trash" + i).click(this.makeRemoveHandler(i));
        }
        // add, undo handler
        //$("#addParticipantBtn").click(function(){
        //    Figure121.addParticipant.call(Figure121);
        //});
        $("#undoBtn").click(function(){
            Figure121.undo.call(Figure121);
        });
        if (navigator.userAgent.indexOf("Firefox") == -1){
            MathJax.Hub.Typeset(); // http://docs.mathjax.org/en/latest/typeset.html
            window.setTimeout(function(){
                $(".MathJax_Display").css("text-align", "left");$("#t1").css("padding-bottom", "9px");$("#t2").css("padding-bottom", "9px");
            }, 500);
        }
        $("#resetBtn").click(function(){Figure121.run.call(Figure121); });
    },
    repaint: function(ctx){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        CANVAS.xyAxis(ctx,
            { min: this.xMin, max: this.xMax, axisMin: this.xAxisMin, axisMax: this.xAxisMax, majorStep: 2, minorStep: 2,
                axisLabel: "High School Math Grade", labelFont: this.canvasFont },
            { min: this.yMin, max: this.yMax, axisMin: this.yAxisMin, axisMax: this.yAxisMax,majorStep: 2, minorStep: 2,
                axisLabel: "University Math Grade", labelFont: this.canvasFont, labelLeftOfAxisWhenLeftGapGreaterThan: 0 },
            { xValueOfYaxis: this.xValueOfYaxis, yValueOfXaxis: this.yValueOfXaxis }
        );
        this.ddCanv.repaint();
    },
    removeParticipant: function(index){
        var data1 = this.data.map(this.getRawPoint);
        var data1a = data1.slice(0, index);
        var data1b = data1.slice(index + 1, data1.length);
        var newData = data1a.concat(data1b);
        this.undoStack.push(this.data0);
        this.run(newData);
    },
    makeRemoveHandler: function(index){
        return function(){
            if (Figure121.data.length <= 3){
                alert(Options.Figure121.errorMsg);
                return;
            }
            Figure121.removeParticipant(index);
        }
    },
    addParticipant: function(){
        var data1 = this.data.map(this.getRawPoint);
        var infant = [this.xMean, this.yMean];
        var newData = data1.concat([infant]);
        this.run(newData);
    },
    undo: function(){
        if (this.undoStack.length == 0){
            return;
        }
        this.run(this.undoStack.pop());
    }
};
Figure121.Point.prototype.update1 = function(){
    this.xx = this.x*this.x;
    this.yy = this.y*this.y;
    this.xy = this.x*this.y;
}
Figure121.Point.prototype.update2 = function(){
    $(".index").removeClass("standardBorder");
    this.indexElt.addClass("standardBorder");
    this.xElt.html( this.xFormat.sprintf( this.x).trim());
    this.yElt.html( this.yFormat.sprintf( this.y).trim());
    this.xyElt.html(this.xyFormat.sprintf(this.xy).trim());
    this.xxElt.html(this.xxFormat.sprintf(this.xx).trim());
    this.yyElt.html(this.yyFormat.sprintf(this.yy).trim());
}
Figure121.Point.prototype.update = function(){
    this.update1();
    this.update2();
}

Figure121.Point.prototype.xFormat  = "%10.2f";
Figure121.Point.prototype.yFormat  = "%10.2f";
Figure121.Point.prototype.xyFormat = "%10.2f";
Figure121.Point.prototype.xxFormat = "%10.2f";
Figure121.Point.prototype.yyFormat = "%10.2f";
Figure121.Point.prototype.xTotalFormat  = "%10.2f";
Figure121.Point.prototype.yTotalFormat  = "%10.2f";
Figure121.Point.prototype.xyTotalFormat = "%10.2f";
Figure121.Point.prototype.xxTotalFormat = "%10.2f";
Figure121.Point.prototype.yyTotalFormat = "%10.2f";
Figure121.Point.prototype.xMeanFormat = "%10.2f";
Figure121.Point.prototype.yMeanFormat = "%10.2f";
Figure121.Point.prototype.stdFormat = "%10.2f";
Figure121.Point.prototype.rFormat = "%10.3f";
Figure121.Point.prototype.tFormat = "%10.2f";

/*******************************************************************************************************
 Final Regresison Example
*******************************************************************************************************/
RegressEx = {
    exampleSelectorId: "examplePicker",
    leftCanvasId: "leftCanvas",
    rightCanvasId: "rightCanvas",
    canvasWidth: Options.RegressEx.canvasWidth,
    canvasHeight: Options.RegressEx.canvasHeight,
    ddCanv: null,
    canvasFont: "11pt Arial",
    smallerCanvasFont: "italic 10pt Arial",
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    alphaTableButtonGap: 0,
    format: {
        x: "%4.2f",
        y: "%4.2f",
        yHat: "%4.2f",
        residual: "%4.2f",
        b: "%5.3f",     // = slope
        beta: "%5.3f",  // = r
        r2: "%5.3f",    // = beta^2
        sb: "%5.3f",    // ?
        absCoe: "%5.3f",
        t: "%5.3f",
        tCritical: "%5.3f",
        alpha: "%4.2f"
    },
    Examples: {
        studying: {
            title: "Studying Example",
            data0: [[4.61, 8.01], [2.34, 7.12], [1.06, 1.57], [2.82, 4.22], [3.65,  8.03], [2.76, 9.16], [3.90, 7.25], [1.20, 4.49], [3.36, 6], [3.43,  9.13]],
            xLabel: "Hours Spent Studying",
            yLabel: "Grade on Quiz out of 10"
        },
        crime: {
            title: "Crime Example",
            data0: [[1.88, 7.17], [1.53, 8.57], [2.88, 5.57], [3.87, 3.24], [3.47, 6.32], [2.53, 4.34], [4.46, 3.13], [1.42, 9.07], [0.57, 6.77], [4.19, 6.12]],
            xLabel: "Police Officiers per 1,000 Population",
            yLabel: "Number of Property Offences per 1,000 Population"
        },
        charity: {
            title: "Charity Example",
            data0: [[0.9, 8.16], [1.71, 6.8], [3.5, 6.03], [4.62, 8.89], [2.85, 9.31], [2.45, 3.94], [0.5, 6.26], [3.54, 3.26], [0.53, 1], [1.32, 7.91]],
            xLabel: "Donor Monthly Income (K$)",
            yLabel: "Annual Donation Amount (K$)"
        },
    },
    exampleTitles: null,
    exampleNames: null,
    chosenExampleIndex: 0,
    pointColor: "rgb(160, 0, 0)",
    residualPointRadius: 3.2,
    showFitLine: true,          // show... : currently
    showxMeanLine: false,
    showyMeanLine: false,
    showSlider: false,          // show...0: on startup
    showFitLine0: true,
    showxMeanLine0: false,
    showyMeanLine0: false,
    showSlider0: false,
    xMeanyMeanColor: "rgb(177, 177, 177)",
    regressionCurveDashing: [3, 3],
    residualDashing: [3, 3],
    xyMeanDashing: [5, 3],
    predictValuesColor: "rgb(50, 160, 20)",
    predictValuesDashing: [7, 6],
    Point: function(x, y, index){
        this.x = x;
        this.y = y;
        this.index = index;
        this.update1();
    },
    getX: function(item){ return item.x},
    getY: function(item){ return item.y},
    getXY: function(item){ return item.xy},
    getXX: function(item){ return item.xx},
    getYY: function(item){ return item.yy},
    getRawPoint: function(item){ return [item.x, item.y]; },
    setExample: function(index){
        this.chosenExampleIndex = index;
        this.run();
    },
    Picker: {
        html0: "",
        init1: function(){
            var id = RegressEx.exampleSelectorId;
            var parentId = RegressEx.exampleSelectorId + "Parent";
            var titles = [];
            var names = [];
            for (var example in RegressEx.Examples){
                titles.push(RegressEx.Examples[example].title);
                names.push(example);
            }
            RegressEx.exampleTitles = titles;
            RegressEx.exampleNames = names;
            this.html0 = H.div(H.select(titles, {id: id}), {id: parentId})
        },
        init2: function(){
            this.elt = $("#" + RegressEx.exampleSelectorId);
            this.elt.change(function(){
                RegressEx.setExample(this.selectedIndex);
            });
        },
    },
    showHideChecksHtml: function(){
        function auxCheck(checked, id){
            return H.checkbox(checked, {id: id, "class": "showHideCheck"});
        }
        var fitLineCheck   = auxCheck(this.showFitLine, "fitLineCheck");
        var xMeanLineCheck = auxCheck(this.showxMeanLine, "xMeanLineCheck");
        var yMeanLineCheck = auxCheck(this.showyMeanLine, "yMeanLineCheck");
        var sliderCheck    = auxCheck(this.showSlider, "sliderCheck");
        //var xBar = H.overlineSpan("x");
        var xBar = H.overBar("x");
        var yBar = H.overBar("y");
        var checks = [fitLineCheck, xMeanLineCheck, yMeanLineCheck, sliderCheck];
        var heads = ["Fit Line", xBar + " Line", yBar + " Line", "Predict Values"];
        var row1 = H.tr(H.th("Show", {rowspan: 2, valign: "bottom", id: "showTh"})     +  heads.map(function(item){ return H.tdCenter(item, {"class": "showHideWhatTd"})}).join(""));
        var row2 = H.tr(checks.map(function(item){ return H.tdCenter(item)}).join(""));
        var checkTable = H.table(
            row1 + row2
            , {id: "showHideChecksTable", cellspacing: 0, cellpadding: 0}
        );
        return checkTable;
    },
    sliderTableHtml: function(){
        return H.table(H.tr(
            H.td(this.slider.html, {id: "sliderTd", "class": "fullWidth"}) +
            H.td("", {id: "sliderLegend", "class": "lineBreakDisabled"})
        ), {id: "sliderTable", "class": "fullWidth"});
        return H.fieldset(
            H.legend("", {id: "sliderLegend"}) +
            this.slider.html
            , {id: "sliderFieldset"}
        );
    },
    sliderCallback: function(val){
        RegressEx.sliderMove(val);
    },
    sliderMove: function(val){
        // val is between 0 and 1
        var dx = this.xMaxAxis - this.xMinAxis;
        var x = this.xMinAxis + val * dx;
        var a0 = this.fit.absCoe;
        var a1 = this.fit.linCoe;
        var yHat = a0 + a1 * x;
        var xFormatted = this.format.x.sprintf(x).trim();
        var yFormatted = this.format.y.sprintf(yHat).trim();
        var title = "(x, &ycirc;) = (" +xFormatted+ ", " +yFormatted+ ")";
        title = "x = " + xFormatted + " &nbsp;&nbsp; &ycirc; = " + yFormatted;
        $("#sliderLegend").html(title);
        this.sliderX = x;
        this.sliderY = yHat;
        this.repaint(this.ddCanv.mc.ctx);
    },
    optionsHtml: function(){
        this.slider = new Slider({min: 0, max: 1, value: 0.5, step: 0.001, id: "slider", callback: RegressEx.sliderCallback});
        var shct = this.showHideChecksHtml();
        var slita = this.sliderTableHtml();
        return H.table(
            H.tr(
                H.td(shct) + H.td(slita, {"class": "fullWidth", id: "sliderParentTd"})
            )
            , {id: "regressionOptionsTable", "class": "fullWidth"}
        );
    },
    upper1Html: function(){
        return H.table(
            H.tr(
                H.thCenter("Select Data to Plot", {"class": "lineBreakDisabled"}) +
                H.thCenter("Least Squares Regression Options")
            ) +
            H.tr(
                H.td(this.Picker.html0) +
                H.td(this.optionsHtml(), {"class": "fullWidth"})
            )
            , {id: "upper1", cellspacing: 0, cellpadding: 0, "class": "fullWidth"}
        )
    },
    upperHtml: function(){
        var resetBtn = H.btn("Reset&nbsp;All", {id: "resetButon"});
        return H.table(
            H.tr(
                H.td(this.upper1Html(), {"class": "fullWidth"}) +
                H.tdCenter(resetBtn, {valign: "center", id: "resetButtonTd"})
            )
            , {id: "upper", cellspacing: 0, cellpadding: 0, "class": "fullWidth"}
        );
    },
    observationsTableHtml: function(data0){
        function cs2(id){
            if (id){
                return {colspan: 2, id: id};
            } else {
                return {colspan: 2};
            }
        }
        var emptyTh = H.th("");
        var addBtn = H.eisBtn("+", {id: "addSampleBtn", title: "add sample"});
        var th1a = H.th(addBtn, {rowspan: 2});
        var th1b = H.th("", cs2("emptyAboveActual"));
        var th1c = H.thCenter("Least Squares Regression", cs2("leastSquaresRegressionHeading"));
        var th2a = "";
        var th2b = H.thCenter("Actual", cs2("actualHeader"));
        var th2c = H.thCenter("&ycirc; = todo", cs2("lsEquation"));
        var thObs = H.thCenter("Observation", {id: "observationHeader"});
        var thx = H.tdCenter("x", {id: "xHeader", "class": "header"});
        var thy = H.tdCenter("y", {id: "yHeader", "class": "header"});
        var thyHat = H.tdCenter("&ycirc;", {id: "yHatHeader", "class": "header"});
        var thResi = H.tdCenter("Residual", {id: "ResidualHeader", "class": "header"});
        var tr1 = H.tr(th1a + th1b + th1c);
        var tr2 = H.tr(th2a + th2b + th2c);
        var tr3 = H.tr(thObs + thx + thy + thyHat + thResi, {"class": "lowestHeaderRow"});
        var THIS = this;
        return H.table(
            tr1 + tr2 + tr3 + data0.map(function(item, index){
                var x = item[0];
                var y = item[1];
                var trashTd = H.tdLeft(H.img("", {
                    src: "img/trash2.png",
                    width: "15px",
                    height: "17px",
                    id: "trash" + index,
                    title: "remove sample " + (index+1),
                    "class": "trashImg"
                }), {"class": "trash"});
                var indexAndTrashTable = H.table(H.tr(
                    trashTd + H.tdCenter(index + 1)
                ), {"class": "fullWidth"});
                return H.tr(
                    H.tdLeft(indexAndTrashTable, {id: "obsIndex" + index, "class": "obsIndex"}) +
                    H.tdCenter(THIS.format.x.sprintf(x).trim(), {id: "x" + index, "class": "obsX"}) +
                    H.tdCenter(THIS.format.y.sprintf(y).trim(), {id: "y" + index, "class": "obsY"}) +
                    H.tdCenter("-", {id: "yHat" + index, "class": "obsYhat"}) +
                    H.tdCenter("resi", {id: "residual" + index, "class": "obsResidual"})
                    , {id: "obsRow" + index}
                );
            }).join("")
            , {id: "observationsTable", cellspacing: 0, cellpadding: 0}
        );
    },
    makeAlphaButtonHandler: function(index){
        return function(){
            if (RegressEx.chosenAlphaIndex == index){
                return;
            }
            RegressEx.chosenAlphaIndex = index;
            RegressEx.calcTotals();
            var elt = $(this);
            elt.parents("table").first().find("button").removeClass("bold");
            elt.addClass("bold");
        }
    },
    DELETEMEalphaButtonsTableHtml: function(){
        var th = H.th("Alpha Value: ");
        var THIS = this;
        var spacer = H.td("", {width: this.alphaTableButtonGap + "px"});
        return H.table(H.tr( th + spacer +
            this.alphaButtonValues.map(function(alpha, index){
                return H.td(H.btn(THIS.alphaButtonCaptions[index], {id: "alphaButton" + index}));
            }).join(spacer)
        ));
    },
    DELETEMEcalcsUpperHtml: function(){
        var hypoSpan = H.span("Hypothesis Test", {"class": "hyothesisTest"});
        var h0 = H.span("H" + H.sub("0") + ": b = 0,", {"class": "bold h0"});
        var hA = H.span("H" + H.sub("A") + ": b &ne; 0", {"class": "bold"});
        var row1 = H.trtd(hypoSpan + h0 + hA);
        var row2 = H.trtd(this.alphaButtonsTableHtml());
        return H.table(row1 + row2, {id: "calcsUpperTable"});
    },
    DELETEMEcalcsLowerHtml: function(){
        var head1 = H.tr(H.thCenter("Least Squares Regression Results", {colspan: 3}));
        var head2 = H.tr(H.thRight("Param") + H.th("") + H.thLeft("Value"));
        head2 = "";
        function aux(paramName, id, title){
            if (title){
                return H.tr(
                    H.tdRight(paramName, {title: title}) +
                    H.tdCenter(" = ") +
                    H.tdLeft("", {id: id}));
            } else {
                return H.tr(
                    H.tdRight(paramName) +
                    H.td(" = ") +
                    H.tdLeft("", {id: id}));
            }
        }
        var slopeRow = aux("b", "resultsSlope", "slope of regression equation");
        var betaRow = aux("&beta;", "resultsBeta", "correlation coefficient");
        var r2Row = aux("r" + H.sup("2"), "resultsR2", "square of correlation coefficient");
        var sbRow = aux("s" + H.sub("b"), "resultsSb", "standard error of slope");
        var tRow = aux("t", "resultsT", "t-value of standard error of slope for this sample");
        var freedomRow = aux("df", "resultsDf", "degrees of freedom");
        var tCriticalRow = aux("t" + H.sub("(&alpha;=" + H.span("-", {id: "resultsAlpha"}) + ")"),
            "resultsTcritical",
            "critical t-value for chosen confidence level"
        );
        var resultRow = H.tr(H.tdCenter(H.div("", {id: "resultDiv"}), {colspan: 3, id: "resultTd"}))
        return H.table(head1 + head2 + slopeRow + betaRow + r2Row + sbRow + tRow + freedomRow + tCriticalRow + resultRow
            , {id: "calcsLowerTable"}
        );
    },
    calculationsTableHtml: function(){
        var THIS = this;
        var spacer = H.td("", {width: this.alphaTableButtonGap + "px"});
        var alphaTd = H.td(
            H.table(
                H.tr(H.th("Alpha Value:")) +
                H.tr(H.td(
                    H.table(H.tr(
                        this.alphaButtonValues.map(function(alpha, index){
                            return H.td(H.btn(THIS.alphaButtonCaptions[index], {id: "alphaButton" + index}));
                        }).join(spacer)
                    ))
                ))
                , {id: "alphaTable"}
            ), {id: "alphaTableTd", "class": "resultsHeader left"}
        );
        var h0 = H.span("H" + H.sub("0") + ": b = 0,", {"class": "bold h0"});
        var hA = H.span("H" + H.sub("A") + ": b &ne; 0", {"class": "bold"});
        var hypoTd = H.td(
            H.table(
                H.tr(H.th("Hypothesis Test", {"class": "hyothesisTest"})) +
                H.tr(H.td(H.table(H.tr(H.tdLeft(h0) + H.tdRight(hA)))))
            )
            , {id: "hypoHeaderTd", "class": "resultsHeader right"}
        );
        var row1 = H.tr(alphaTd + hypoTd);
        var row2 = H.tr(H.td("", {"class": "resultsHeader left"}) + H.th("Least Squares", {"class": "resultsHeader right"}));
        var row3 = H.tr(H.th("Results", {"class": "resultsHeader lowestHeader left"}) + H.th("Regression Results", {"class": "resultsHeader lowestHeader right"}));
        function aux(paramName, id, title){
            if (title){
                return H.tr(
                    H.tdCenter(paramName, {title: title, "class": "body"}) +
                    H.tdCenter("", {id: id, "class": "body"}));
            } else {
                return H.tr(
                    H.tdCenter(paramName, {"class": "body"}) +
                    H.tdCenter("", {id: id, "class": "body"}));
            }
        }
        var slopeRow = aux(H.italic("b"), "resultsSlope", "slope of regression equation");
        var betaRow = aux(H.italic("&beta;"), "resultsBeta", "correlation coefficient");
        var r2Row = aux(H.italic("r") + H.sup("2"), "resultsR2", "square of correlation coefficient");
        var sbRow = aux(H.italic("s") + H.sub(H.italic("b")), "resultsSb", "standard error of slope");
        var tRow = aux(H.italic("t"), "resultsT", "t-value of standard error of slope for this sample");
        var freedomRow = aux(H.italic("df"), "resultsDf", "degrees of freedom");
        var tCriticalRow = aux(H.italic("t") + H.sub("(&alpha;=" + H.span("-", {id: "resultsAlpha"}) + ")"),
            "resultsTcritical",
            "critical t-value for chosen confidence level"
        );
        var resultRow = H.tr(
            H.tdCenter("Decision") +
            H.tdCenter(H.div("", {id: "resultDiv"}), {id: "resultTd"})
        )
        return H.table00(
            row1 + row2 + row3 + slopeRow + betaRow + r2Row + sbRow + tRow + freedomRow + tCriticalRow + resultRow
            , {id: "calculationsTable"}
        );
        
        return H.table(
            H.tr(H.tdCenter(this.calcsUpperHtml())) +
            H.tr(H.tdCenter(this.calcsLowerHtml()))
            , {id: "calculationsTable"}
        );
    },
    lowerHtml: function(data0){
        var lcId = this.leftCanvasId;
        var rcId = this.rightCanvasId;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var leftCanvHtml = H.canvas({id: lcId, width: canvasWidth, height: canvasHeight});
        var rightCanvHtml = H.canvas({id: rcId, width: canvasWidth, height: canvasHeight});
        return H.table(
            H.tr(
                H.td(leftCanvHtml) + H.td("", {"class": "betweenCanvassesSpacer"}) + H.td(rightCanvHtml)
            ) +
            H.tr(H.td("", {"class": "upperLowerSpacing1", colspan: 3})) +
            H.tr(
                H.tdCenter(this.observationsTableHtml(data0), {id: "obsTableParentTd"}) +
                H.td("", {"class": "betweenCanvassesSpacer"}) +
                H.tdCenter(this.calculationsTableHtml(), {id: "calcsTableParentTd"})
            )
            , {id: "mainTable", cellspacing: 0, cellpadding: 0}
        );
    },
    html: function(data0){
        return H.table(
            H.tr(H.td(this.upperHtml())) +
            H.tr(H.td("", {"class": "upperLowerSpacing1"})) +
            H.tr(H.td("", {"class": "upperLowerSpacing2"})) +
            H.tr(H.td("", {"class": "upperLowerSpacing1"})) +
            H.tr(H.td(this.lowerHtml(data0)))
            , {id: "RegressEx", cellspacing: 0, cellpadding: 0}
        );
    },
    reset: function(){
        RegressEx.chosenAlphaIndex = RegressEx.initiallyChosenAlphaIndex;
        RegressEx.chosenExampleIndex = 0;
        RegressEx.showFitLine = RegressEx.showFitLine0;
        RegressEx.showxMeanLine = RegressEx.showxMeanLine0;
        RegressEx.showyMeanLine = RegressEx.showyMeanLine0;
        RegressEx.showSlider = RegressEx.showSlider0;
        RegressEx.run();
    },
    prepareData: function(data0){
        var THIS = this;
        var xMin = Infinity;
        var xMax = -Infinity;
        var yMin = Infinity;
        var yMax = -Infinity;
        //var exampleName = this.exampleNames[this.chosenExampleIndex];
        //var data = this.Examples[exampleName].data0.map(function(item, index){
        var data = data0.map(function(item, index){
            var x = item[0];
            var y = item[1];
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y);
            return new THIS.Point(x, y, index);
        });
        this.xMinData = xMin;
        this.xMaxData = xMax;
        this.yMinData = yMin;
        this.yMaxData = yMax;
        this.xMinAxis = Math.min(0, Math.floor(this.xMinData - 0.2));
        this.xMaxAxis = Math.max(5, Math.ceil(this.xMaxData));
        this.yMinAxis = 0;//Math.floor(this.yMinData);
        this.yMaxAxis = Math.ceil(this.yMaxData);
        this.xMinPlot = -0.7;
        this.xMaxPlot = this.xMaxAxis + 0.2;
        this.yMinPlot = -1.5;
        this.yMaxPlot = this.yMaxAxis + 0.4;
        this.data = data;
    },
    run: function(){
        this.Picker.init1();
        var exampleName = this.exampleNames[this.chosenExampleIndex];
        var data0 = this.Examples[exampleName].data0;
        this.prepareData(data0);
        this.run1(data0);
    },
    run1: function(data0){
        var THIS = this;
        gUniverseElt.html(this.html(data0));
        document.getElementById(this.exampleSelectorId).selectedIndex = this.chosenExampleIndex;
        this.slider.init();
        //this.slider.elt.width(400);
        this.Picker.init2();
        this.resetBtnElt = $("#resetButon");
        this.resetBtnElt.click(this.reset);
        var canvasId = this.leftCanvasId;
        var pointColor = this.pointColor;
        var xMinPlot = this.xMinPlot;
        var xMaxPlot = this.xMaxPlot;
        var yMinPlot = this.yMinPlot;
        var yMaxPlot = this.yMaxPlot;
        var data = this.data;
        this.ddCanv = new DragDropCanvas({
            id: canvasId,
            xMin: xMinPlot,
            xMax: xMaxPlot,
            yMin: yMinPlot,
            yMax: yMaxPlot,
            points: data,
            repaintCallback: function(ctx){
                THIS.calcTotals();
                THIS.repaint.call(THIS, ctx);
            },
            getText: function(i){
                var ii = i + 1;
                return "" + ii;
            },
            color: pointColor,
            radius: 7,
            font: "bold 8pt Arial"
        });
        this.observationsTableElt = $("#observationsTable");
        var t = this.observationsTableElt;
        for (var i=0; i<this.data.length; i++){
            var p = this.data[i];
            p.indexElt = t.find("#obsIndex" + i);
            p.xElt = t.find("#x" + i);
            p.yElt = t.find("#y" + i);
            p.yHatElt = t.find("#yHat" + i);
            p.residualElt = t.find("#residual" + i);
            p.update2();
        }
        this.regressionEquationContainer = $("#lsEquation") 
        this.resultsSlope = $("#resultsSlope");
        this.resultsBeta = $("#resultsBeta");
        this.resultsR2 = $("#resultsR2");
        this.resultsSb = $("#resultsSb");
        this.resultsT = $("#resultsT");
        this.resultsDf = $("#resultsDf");
        this.resultsTcritical = $("#resultsTcritical");
        this.resultsAlpha = $("#resultsAlpha");
        var shct = $("table#showHideChecksTable");
        this.fitLineCheck = shct.find("#fitLineCheck");
        this.xMeanLineCheck = shct.find("#xMeanLineCheck");
        this.yMeanLineCheck = shct.find("#yMeanLineCheck");
        this.sliderCheck = shct.find("#sliderCheck");
        this.upperElt = $("#upper");
        this.upper1Elt = $("#upper1");
        this.regressionOptionsTableElt = $("#regressionOptionsTable");
        this.sliderParentTdElt = $("#sliderParentTd");
        this.calcTotals();
        this.resiCanvas = $("#" + this.rightCanvasId);
        this.resiCtx = this.resiCanvas[0].getContext('2d');
        this.repaint(this.ddCanv.mc.ctx);
        $("#alphaButton" + this.chosenAlphaIndex).addClass("bold");
        //hookup alpha button handlers
        for (var i=0; i<this.alphaButtonValues.length; i++){
            var btnElt = $("#alphaButton" + i);
            btnElt.click(this.makeAlphaButtonHandler(i));
        }
        // hookup remove handlers
        for (var i=0; i<this.data.length; i++){
            $("#trash" + i).click(this.makeRemoveHandler(i));
        }
        // add handler
        this.addSampleBtn = $("#addSampleBtn");
        this.addSampleBtn.click(function(){
            RegressEx.addSample.call(RegressEx);
        });
        // show hide check handlers
        this.fitLineCheck.change(this.fitLineCheckChange);
        this.xMeanLineCheck.change(this.xMeanLineCheckChange);
        this.yMeanLineCheck.change(this.yMeanLineCheckChange);
        this.sliderCheck.change(this.showSliderCheckChange);
        var trash = $(".trash");
        if (this.data.length >= 14){
            trash.css("padding-top", 0);
            trash.css("padding-bottom", 0);
        } else {
            if (this.data.length <= 10){
                trash.css("padding-top", 1);
                trash.css("padding-bottom", 1);
            } else {
                trash.css("padding-top", 1);
                trash.css("padding-bottom", 0);
            }
        }
        this.setSliderVisibility(this.showSlider);
        if (Options.RegressEx.youNeedGovernmentalPermissionToWipeYourBehind){
            $(".trashImg").hide();
            $("#addSampleBtn").hide();
        }
    },
    fitLineCheckChange: function(){
        RegressEx.showFitLine = this.checked;
        RegressEx.repaint(RegressEx.ddCanv.mc.ctx);
    },
    xMeanLineCheckChange: function(){
        RegressEx.showxMeanLine = this.checked;
        RegressEx.repaint(RegressEx.ddCanv.mc.ctx);
    },
    yMeanLineCheckChange: function(){
        RegressEx.showyMeanLine = this.checked;
        RegressEx.repaint(RegressEx.ddCanv.mc.ctx);
    },
    showSliderCheckChange: function(){
        var sliderShallBeVisible = this.checked;
        RegressEx.showSlider = sliderShallBeVisible;
        RegressEx.setSliderVisibility(sliderShallBeVisible);
    },
    setSliderInvisible: function(){
        this.upperElt.removeClass("fullWidth");
        this.upper1Elt.removeClass("fullWidth");
        this.upper1Elt.parent().removeClass("fullWidth");
        this.regressionOptionsTableElt.removeClass("fullWidth");
        this.regressionOptionsTableElt.parent().removeClass("fullWidth");
        this.sliderParentTdElt.removeClass("fullWidth");
        this.sliderParentTdElt.hide();
        this.repaint(this.ddCanv.mc.ctx);
    },
    setSliderVisible: function(){
        this.upperElt.addClass("fullWidth");
        this.upper1Elt.addClass("fullWidth");
        this.upper1Elt.parent().addClass("fullWidth");
        this.regressionOptionsTableElt.addClass("fullWidth");
        this.regressionOptionsTableElt.parent().addClass("fullWidth");
        this.sliderParentTdElt.addClass("fullWidth");
        this.sliderParentTdElt.show();
        this.sliderMove(this.slider.get());
    },
    setSliderVisibility: function(visib){
        if (visib){
            this.setSliderVisible();
        } else {
            this.setSliderInvisible();
        }
    },
    calcTotals: function(){
        function pretty(format, value, omitSpace){
            var str = format.sprintf(value).trim();
            var space = omitSpace ? "" : "&nbsp;&nbsp;";
            var minus = "&ndash;"
            return value >= 0 ? space + str : minus + str.slice(1);
        }
        var data1 = this.data.map(this.getRawPoint);
        var fit = fitDataLinear(data1);
        if (!fit){
            // this happens if all sample points are identical. Don't want to deal with this special case
            // in detail now, but don't want to have a crash, so restart the whole demo; for now anyway.
            console.log("Ouch! All samples identical - restarting demo...");
            this.run();
            return;
        }
        var slope = fit.linCoe;
        var absCoe = fit.absCoe;
        var absCoeFormatted = this.format.absCoe.sprintf(absCoe).trim();
        var linCoeFormatted = this.format.b.sprintf(slope).trim();
        var regressionEquation = "&ycirc; = " + absCoeFormatted;
        if (slope >= 0){
            regressionEquation += (" + " + linCoeFormatted + "x");
        } else {
            regressionEquation += (" &ndash; " + Math.abs(linCoeFormatted) + "x");
        }
        this.fit = fit;
        this.regressionEquation = regressionEquation;
        this.regressionEquationContainer.html(regressionEquation);
        var n = data1.length;
        for (var i=0; i<n; i++){
            var p = this.data[i];
            p.yHat = absCoe + slope * p.x;
            p.residual = p.y - p.yHat;
            p.update3();
        }
        var alphaIndex = this.chosenAlphaIndex;
        var freedom = n - 2;
        var tCritical = studentTcritical[this.alphaLookup[alphaIndex]][freedom];
        var alpha = this.alphaButtonValues[alphaIndex];
        var betaFormatted = pretty(this.format.beta, fit.r);
        linCoeFormatted = pretty(this.format.b, slope);
        var r2Formatted = pretty(this.format.r2, fit.rSquared);
        var sbFormatted = pretty(this.format.sb, fit.standardErrorOfSlope);
        var tFormatted = pretty(this.format.t, fit.tValueOfStandardErrorOfSlope);
        var tCriticalFormatted = pretty(this.format.tCritical, tCritical);
        var alphaFormatted = pretty(this.format.alpha, alpha, true);
        this.resultsSlope.html(linCoeFormatted);
        this.resultsBeta.html(betaFormatted);
        this.resultsR2.html(r2Formatted);
        this.resultsSb.html(sbFormatted);
        this.resultsT.html(tFormatted);
        this.resultsDf.html("&nbsp;&nbsp;" + freedom);
        this.resultsTcritical.html(tCriticalFormatted);
        this.resultsAlpha.html(alphaFormatted);
        this.betaFormatted = betaFormatted;
        this.r2Formatted = r2Formatted;
        this.sbFormatted = sbFormatted;
        this.tFormatted = tFormatted;
        this.tCriticalFormatted = tCriticalFormatted;
        this.alphaFormatted = alphaFormatted;
        this.absCoeFormatted = absCoeFormatted;
        this.linCoeFormatted = linCoeFormatted;
        var rejectTheNull = ( Math.abs(fit.tValueOfStandardErrorOfSlope) > tCritical);
        var resultDiv = $("#resultDiv");
        var resultHtml;
        if (rejectTheNull){
            resultHtml = Figure121.rejectNullHtml();
        } else {
            resultHtml = Figure121.failToRejectNullHtml();
        }
        resultDiv.html(resultHtml);
        this.resultDiv = resultDiv;
    },
    repaint: function(ctx){
        var exampleName = this.exampleNames[this.chosenExampleIndex];
        var example = this.Examples[exampleName];
        var xLbl = example.xLabel;
        var yLbl = example.yLabel;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var leftCanvasTrafos = CANVAS.xyAxis(ctx,
            { min: this.xMinPlot, max: this.xMaxPlot,
              axisMin: this.xMinAxis, axisMax: this.xMaxAxis,
              axisLabel: xLbl, labelFont: this.canvasFont,
              majorStep: 1, minorStep: 1
            },
            { min: this.yMinPlot, max: this.yMaxPlot,
              axisMin: this.yMinAxis, axisMax: this.yMaxAxis,
              axisLabel: yLbl, labelFont: this.canvasFont,
              majorStep: 1, minorStep: 1,
              labelLeftOfAxisWhenLeftGapGreaterThan: 65
            }
        );
        this.ddCanv.repaint();
        var rctx = this.resiCtx;
        rctx.clearRect(0, 0, rctx.canvas.width, rctx.canvas.height);
        var n = this.data.length;
        var rightCanvasTrafos = CANVAS.xyAxis(rctx, {
                min: -0.8, max: n + 1.7,
                axisMin: 0, axisMax: n,
                axisLabel: "",// "Observation", labelFont: this.smallerCanvasFont,
                majorStep: 1, minorStep: 1,
                centerAxisLabel: false
            }, {
                min: -5.3, max: 5.7,
                axisMin: -5, axisMax: 5,
                axisLabel: "",// "Residual", labelFont: this.smallerCanvasFont,
                majorStep: 1, minorStep: 1,
                labelLeftOfAxisWhenLeftGapGreaterThan: 50,
                centerAxisLabel: false
            }, {
                yValueOfXaxis: 0,
                allYlabels: true,
                xValueOfYaxis: 0
            }
        );
        var xt = rightCanvasTrafos.xTrafo;
        var yt = rightCanvasTrafos.yTrafo;
        var y0 = yt(0);
        rctx.font = this.smallerCanvasFont;
        rctx.fillStyle = "black";
        rctx.textAlign = "left"
        rctx.fillText("Residual", 15, 13);
        rctx.textAlign = "right";
        rctx.fillText("Observation", rctx.canvas.width-3, y0);
        for (var i=0; i<n; i++){
            var p = this.data[i];
            var x = xt(i+1);
            var y1 = yt(p.residual);
            rctx.strokeStyle = "blue";
            CANVAS.dashedLine(rctx, x, y0, x, y1, this.residualDashing);
            rctx.fillStyle = this.pointColor;
            rctx.beginPath();
            rctx.arc(x, y1, this.residualPointRadius, 0, 2*Math.PI);
            rctx.fill();
        }
        var lxTrafo = leftCanvasTrafos.xTrafo;
        var lyTrafo = leftCanvasTrafos.yTrafo;
        if (this.showFitLine){
            this.showRegressionCurve(lxTrafo, lyTrafo);
        }
        if (this.showxMeanLine){
            this.showXbar(lxTrafo, lyTrafo);
        }
        if (this.showyMeanLine){
            this.showYbar(lxTrafo, lyTrafo);
        }
        if (this.showSlider){
            this.showPredictValues(lxTrafo, lyTrafo);
        }
    },
    showPredictValues: function(xTrafo, yTrafo){
        var ctx = this.ddCanv.mc.ctx;
        var xCanvas = xTrafo(this.sliderX);
        var yCanvas = yTrafo(this.sliderY);
        var color = this.predictValuesColor;
        var axisXcanv = xTrafo(this.xMinAxis);
        var axisYcanv = yTrafo(this.yMinAxis);
        var epsilonX = 1;
        var epsilonY = 1;
        CANVAS.leftArrow(ctx, yCanvas, xCanvas, axisXcanv + epsilonX, 15, 8, color, 1, this.predictValuesDashing);
        CANVAS.downArrow(ctx, xCanvas, yCanvas, axisYcanv - epsilonY, 15, 8, color, 1, this.predictValuesDashing);
        
    },
    showRegressionCurve: function(xTrafo, yTrafo){
        var a0 = this.fit.absCoe;
        var a1 = this.fit.linCoe;
        var xLeft  = 0;
        var xRight = this.xMaxPlot;
        var yLeft  = a0 + a1 * xLeft;
        var yRight = a0 + a1 * xRight;
        var xLeftCanvas  = xTrafo(xLeft);
        var xRightCanvas = xTrafo(xRight);
        var yLeftCanvas  = yTrafo(yLeft);
        var yRightCanvas = yTrafo(yRight);
        var ctx = this.ddCanv.mc.ctx;
        ctx.strokeStyle = "blue";
        CANVAS.dashedLine(ctx, xLeftCanvas, yLeftCanvas, xRightCanvas, yRightCanvas, this.regressionCurveDashing);
    },
    showXbar: function(xTrafo, yTrafo){
        var x    = this.fit.xMean;
        var yLo  = this.yMinAxis;
        var yHi  = this.yMaxAxis;
        var xCanvas   = xTrafo(x);
        var yLoCanvas = yTrafo(yLo);
        var yHiCanvas = yTrafo(yHi);
        var ctx = this.ddCanv.mc.ctx
        ctx.strokeStyle = this.xMeanyMeanColor;
        CANVAS.dashedLine(ctx, xCanvas, yLoCanvas, xCanvas, yHiCanvas, this.xyMeanDashing);
    },
    showYbar: function(xTrafo, yTrafo){
        var xLeft  = 0;
        var xRight = this.xMaxPlot;
        var yBar   = this.fit.yMean;
        var xLeftCanvas  = xTrafo(xLeft);
        var xRightCanvas = xTrafo(xRight);
        var yCanvas  = yTrafo(yBar);
        var ctx = this.ddCanv.mc.ctx
        ctx.strokeStyle = this.xMeanyMeanColor;
        CANVAS.dashedLine(ctx, xLeftCanvas, yCanvas, xRightCanvas, yCanvas, this.xyMeanDashing);
    },
    removeSample: function(index){
        var data1 = this.data.map(this.getRawPoint);
        var data1a = data1.slice(0, index);
        var data1b = data1.slice(index + 1, data1.length);
        var newData = data1a.concat(data1b);
        this.Picker.init1();
        this.prepareData(newData);
        this.run1(newData);
    },
    makeRemoveHandler: function(index){
        return function(){
            if (RegressEx.data.length <= 3){
                alert("regression analysis with less than 3 data points does not make sense.\nSample can't be removed.");
                return;
            }
            RegressEx.removeSample(index);
        }
    },
    addSample: function(){
        var data1 = this.data.map(this.getRawPoint);
        var infant = [0, 0];
        var newData = data1.concat([infant]);
        this.Picker.init1();
        this.prepareData(newData);
        this.run1(newData);
    }
};
RegressEx.Point.prototype.update1 = function(){
    this.xx = this.x*this.x;
    this.yy = this.y*this.y;
    this.xy = this.x*this.y;
}
RegressEx.Point.prototype.update2 = function(){
    function pretty(format, value){
        var str = format.sprintf(value).trim();
        var space = "&nbsp;&nbsp;";
        return value >= 0 ? space + str : str;
    }
    this.xElt.html(pretty(RegressEx.format.x, this.x));
    this.yElt.html(pretty(RegressEx.format.y, this.y));
}
RegressEx.Point.prototype.update3 = function(){
    function pretty(format, value){
        var str = format.sprintf(value).trim();
        var space = "&nbsp;&nbsp;";
        return value >= 0 ? space + str : str;
    }
    this.yHatElt.html(pretty(RegressEx.format.yHat, this.yHat));
    this.residualElt.html(pretty(RegressEx.format.residual, this.residual));
}
RegressEx.Point.prototype.update = function(){
    this.update1();
    this.update2();
    this.update3();
}
/*******************************************************************************************************
 PowerEffect
*******************************************************************************************************/
PowerEffect = {
    title: "Power and Effect for a Two-Tailed Independent Sample t-test",
    instructions: "Instructions: Select desired &alpha; and then either adjust the " + H.overBar("x") +
        ", s" /*+ H.sup("2")*/ + " and " + H.italic("n") + " " + H.underlineSpan("or") + " choose an effect size to start with.",
    canvasWidth: Options.PowerEffect.canvasWidth,
    canvasHeight: Options.PowerEffect.canvasHeight,
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    alphaTableLabel: "Alpha (&alpha;):",
    minMean: 1,
    maxMean: 10,
    grp1MeanInitial: 3.5,
    grp2MeanInitial: 5,
    minDev: 0.25,
    maxDev: 3,
    grp1DevInitial: 2.25,
    grp2DevInitial: 2.25,
    minGroupSize: 2,
    maxGroupSize: 400,
    grp1GroupSizeInitial: 55,
    grp2GroupSizeInitial: 55,
    alphaButtonClick: function(i){
        var alpha = this.app.alphaButtonValues[i];
        this.app.alpha = alpha;
        this.app.chosenAlphaIndex = i;
        this.app.action();
    },
    effectButtonClick: function(i){
        //var d = this.app.effectButtonValues[i];
        this.app[["smallEffect", "mediumEffect", "largeEffect"][i]]();
    },
    doEffect: function(mean1, mean2, dev1, dev2, n1, n2){
        this.mean1 = mean1; this.sliMean1.set(mean1); this.sliMean1.valElt.html(mean1);
        this.mean2 = mean2; this.sliMean2.set(mean2); this.sliMean2.valElt.html(mean2);
        this.dev1 = dev1; this.sliDev1.set(dev1); this.sliDev1.valElt.html(dev1);
        this.dev2 = dev2; this.sliDev2.set(dev2); this.sliDev2.valElt.html(dev2);
        this.groupSize1 = n1; this.sliGroupSize1.set(n1); this.sliGroupSize1.valElt.html(n1);
        this.groupSize2 = n2; this.sliGroupSize2.set(n2); this.sliGroupSize2.valElt.html(n2);
        this.action();
    },
    smallEffect: function(){
        this.doEffect(8.2, 8.5, 1.5, 1.5, 394, 394);
    },
    mediumEffect: function(){
        this.doEffect(6, 6.6, 1.2, 1.2, 64, 64);
    },
    largeEffect: function(){
        this.doEffect(4, 5, 1.25, 1.25, 26, 26);
    },
    resetButtonClick: function(i){
        var handlerNames = ["xBarReset", "devReset", "nReset"];
        this.app[handlerNames[i]]();
    },
    xBarReset: function(){
        this.mean1 = this.grp1MeanInitial;
        this.mean2 = this.grp2MeanInitial;
        this.sliMean1.set(this.grp1MeanInitial);
        this.sliMean1.valElt.html(this.grp1MeanInitial);
        this.sliMean2.set(this.grp2MeanInitial);
        this.sliMean2.valElt.html(this.grp2MeanInitial);
        this.action();
    },
    devReset: function(){
        this.dev1 = this.grp1DevInitial;
        this.dev2 = this.grp2DevInitial;
        this.sliDev1.set(this.grp1DevInitial);
        this.sliDev1.valElt.html(this.grp1DevInitial);
        this.sliDev2.set(this.grp2DevInitial);
        this.sliDev2.valElt.html(this.grp2DevInitial);
        this.action();
    },
    nReset: function(){
        this.groupSize1 = this.grp1GroupSizeInitial;
        this.groupSize2 = this.grp2GroupSizeInitial;
        this.sliGroupSize1.set(this.grp1GroupSizeInitial);
        this.sliGroupSize1.valElt.html(this.grp1GroupSizeInitial);
        this.sliGroupSize2.set(this.grp2GroupSizeInitial);
        this.sliGroupSize2.valElt.html(this.grp2GroupSizeInitial);
        this.action();
    },
    run: function(){
        this.SPDF = new StudentPDF(2*this.maxGroupSize);
        this.gammaHelper = new LogGamma(4*this.maxGroupSize + 20);
        var canvHtml = H.canvas({id: "canvas", width: this.canvasWidth, height: this.canvasHeight});
        var tLeftOverCanvasInfo = H.span("", {id: "tLeftOverCanvasInfo", "class": "overCanvasInfo"});
        var tRightOverCanvasInfo = H.span("", {id: "tRightOverCanvasInfo", "class": "overCanvasInfo"});
        var ncpOverCanvasInfo = H.span("", {id: "ncpOverCanvasInfo", "class": "overCanvasInfo"});
        var h0OverCanvasInfo = H.span("", {id: "h0OverCanvasInfo", "class": "overCanvasInfo"});
        var hAltOverCanvasInfo = H.span("", {id: "hAltOverCanvasInfo", "class": "overCanvasInfo"});
        var alphaLeftOverCanvasInfo = H.span("", {id: "alphaLeftOverCanvasInfo", "class": "overCanvasInfo"});
        var alphaRightOverCanvasInfo = H.span("", {id: "alphaRightOverCanvasInfo", "class": "overCanvasInfo"});
        var betaOverCanvasInfo = H.span("", {id: "betaOverCanvasInfo", "class": "overCanvasInfo"});
        var powerOverCanvasInfo = H.span("", {id: "powerOverCanvasInfo", "class": "overCanvasInfo"});
        var clarifyOverCanvasInfo = H.span("", {id: "clarifyOverCanvasInfo", "class": "overCanvasInfo"});
        var canvasParent = H.div(
            canvHtml + tLeftOverCanvasInfo + tRightOverCanvasInfo + ncpOverCanvasInfo + h0OverCanvasInfo + hAltOverCanvasInfo +
            alphaLeftOverCanvasInfo + alphaRightOverCanvasInfo + betaOverCanvasInfo + powerOverCanvasInfo + clarifyOverCanvasInfo
            , {id: "canvasParent", style: "position: relative; z-index: 0;"}
        );
        var resetButtonBar = new ButtonBar({
            buttonLabels: [H.overBar("x"), H.italic("s") /*+ H.sup("2", {"id": "sExponent"})*/, H.italic("n")],
            headerLabel: "Reset: ",
            headerClass: "lineBreakDisabled",
            headerStyle: {"padding-right": "10px"},
            idPrefix: "reset",
            name: "resetButtonBar",
            app: this,
            btnClass: "resetButton",
            tdClass: "resetBtnTd",
            chosenButtonClass: "",
            alwaysCallback: true,
            callback: this.resetButtonClick
        });
        var alphaButtonBar = new ButtonBar({
            buttonLabels: this.alphaButtonCaptions,
            headerLabel: this.alphaTableLabel,
            headerClass: "lineBreakDisabled",
            headerStyle: {"padding-right": "10px"},
            selectedIndex: this.initiallyChosenAlphaIndex,
            idPrefix: "alpha",
            name: "alphaButtonBar",
            app: this,
            btnClass: "alphaButton",
            tdClass: "alphaBtnTd",
            chosenButtonClass: "bold chosen",
            callback: this.alphaButtonClick
        });
        function makeEffectBtnCaption(line1, line2, id){
            return H.table00(
                H.trtdCenter(line1) +
                H.trtdCenter(line2)
                , {"class": "lineBreakDisabled", id: id, align: "center"}
            );
        }
        function dAux(d){
            return "(" + H.italic("d") + " = " + d + ")";
        }
        this.effectsButtonCaptions = [
            makeEffectBtnCaption("Small Effect", dAux(0.2), "smallEffCap"),
            makeEffectBtnCaption("Medium Effect", dAux(0.5), "medEffCap"),
            makeEffectBtnCaption("Large Effect", dAux(0.8), "largeEffCap")
        ]; 
        this.effectButtonValues = [0.2, 0.5, 0.8];
        var effectsButtonBar = new ButtonBar({
            buttonLabels: this.effectsButtonCaptions,
            omitHeader: true,
            idPrefix: "effect",
            name: "effectButtonBar",
            app: this,
            btnClass: "effectButton",
            chosenButtonClass: "",
            orientation: "vertical",
            callback: this.effectButtonClick,
            alwaysCallback: true,
            tableAtts: {cellpadding: 0}
        });
        var sliMean1 = new Slider({
                min: this.minMean, max: this.maxMean, value: this.grp1MeanInitial, step: Options.PowerEffect.meanSliderStep,
                id: "sliMean1", callback: this.makeGrp1MeanSliderCallback()
        });
        var sliMean2 = new Slider({
                min: this.minMean, max: this.maxMean, value: this.grp2MeanInitial, step: Options.PowerEffect.meanSliderStep,
                id: "sliMean2", callback: this.makeGrp2MeanSliderCallback()
        });
        sliMean1.app = this;
        sliMean2.app = this;
        var spacer = H.td("", Style.toAtts({width: "14px", "min-width": "14px"}));
        var rowSpacer = H.tr("", Style.toAtts({height: Options.PowerEffect.verticalSliderSpacing + "px"}));
        var meanRow = H.tr(
            H.td("") + H.thRight("Mean (" + H.overBar("x") + ")", {"class": "lineBreakDisabled sliderTh"}) +
            H.td(sliMean1.html, Style.attachToAtts({id: "sliMean1Td"}, {width: "50%"})) + H.tdRight("", {id: "sliMean1Val", "class": "sliderValueElt"}) +
            spacer +
            H.td(sliMean2.html, Style.attachToAtts({id: "sliMean2Td"}, {width: "50%"})) + H.tdRight("", {id: "sliMean2Val", "class": "sliderValueElt"})
        );
        var sliDev1 = new Slider({
            min: this.minDev, max: this.maxDev, value: this.grp1DevInitial, step: Options.PowerEffect.stdSliderStep,
            id: "sliDev1", callback: this.makeGrp1DevSliderCallback()
        });
        var sliDev2 = new Slider({
            min: this.minDev, max: this.maxDev, value: this.grp2DevInitial, step: Options.PowerEffect.stdSliderStep,
            id: "sliDev2", callback: this.makeGrp2DevSliderCallback()
        });
        sliDev1.app = this;
        sliDev2.app = this;
        var devCheck = H.checkbox(false, {id: "devCheck"});
        var devRow = H.tr(
            H.td(devCheck) + H.thRight("Std Deviation (s" /*+ H.sup("2")*/ + ")" , {"class": "lineBreakDisabled sliderTh"}) +
            H.td(sliDev1.html, Style.attachToAtts({id: "sliDev1Td"}, {width: "50%"})) + H.tdRight("", {id: "sliDev1Val", "class": "sliderValueElt"}) +
            spacer +
            H.td(sliDev2.html, Style.attachToAtts({id: "sliDev2Td"}, {width: "50%"})) + H.tdRight("", {id: "sliDev2Val", "class": "sliderValueElt"})
        );
        var sliGroupSize1 = new Slider({
            min: this.minGroupSize, max: this.maxGroupSize, value: this.grp1GroupSizeInitial, step: 1,
            id: "sliGroupSize1", callback: this.makeGrp1GroupSizeSliderCallback()
        });
        var sliGroupSize2 = new Slider({
            min: this.minGroupSize, max: this.maxGroupSize, value: this.grp2GroupSizeInitial, step: 1,
            id: "sliGroupSize2", callback: this.makeGrp2GroupSizeSliderCallback()
        });
        sliGroupSize1.app = this;
        sliGroupSize2.app = this;
        var groupSizeCheck = H.checkbox(false, {id: "groupSizeCheck"});
        var groupSizeRow = H.tr(
            H.td(groupSizeCheck) + H.thRight("Sample Size (" + H.italic("n") + ")" , {"class": "lineBreakDisabled sliderTh"}) +
            H.td(sliGroupSize1.html, Style.attachToAtts({id: "sliGroupSize1Td"}, {width: "50%"})) + H.tdRight("", {id: "sliGroupSize1Val", "class": "sliderValueElt"}) +
            spacer +
            H.td(sliGroupSize2.html, Style.attachToAtts({id: "sliGroupSize2Td"}, {width: "50%"})) + H.tdRight("", {id: "sliGroupSize2Val", "class": "sliderValueElt"})
        );
        var btns = H.table00(H.tr(
            H.td(alphaButtonBar.html, Style.attachToAtts({id: "alphaBtnsParent"}, {width: "50%", "padding-left": "30px"})) +
            H.td(resetButtonBar.html, Style.attachToAtts({id: "resetBtnsParent"}, {width: "50%", "padding-left": "30px"}))
        ), {id: "btnsTable", "class": "fullWidth"});
        var groups = H.table(
            H.tr(H.td("") + H.td("") + H.thCenter("Group 1", {colspan: 2}) + spacer + H.thCenter("Group 2", {colspan: 2})) +
            meanRow + rowSpacer + devRow + rowSpacer + groupSizeRow +
            H.tr(H.tdLeft("Tick box to move simultaneously", {colspan: 7, "class": "tickBoxToMoveSimultaneously"}))
            , {"class": "fullWidth"}
        );
        var effects = effectsButtonBar.html;
        var sliders = H.table(H.tr(
            H.tdLeft(groups, {id: "groupsParentTd", "class": "fullWidth"}) +
            H.tdCenter("OR", {"class": "bold", valign: "center"}) +
            H.tdRight(effects)
        ), {id: "slidersOuterTable", "class": "fullWidth"});
        var leftResults = H.table(
            H.tr(H.td("Effect Size (Cohen's " + H.italic("d") + ")", {"class": "resultLabel"}) + H.td("", {id: "cohaninD", "class": "result"})) +
            H.tr(H.td("Mean Difference", {"class": "resultLabel"}) + H.td("", {id: "meanDifference", "class": "result"})) +
            H.tr(H.td("Total Sample Size (N)", {"class": "resultLabel"}) + H.td("", {id: "totalSampleSize", "class": "result"}))
        );
        var midResults = H.table(
            H.tr(H.td("NCP (&delta;)", {"class": "resultLabel"}) + H.td("", {id: "NCP", "class": "result"})) +
            H.tr(H.td("Critical Value (" + H.italic("t") + ")", {"class": "resultLabel"}) + H.td("", {id: "criticalValue", "class": "result"})) +
            H.tr(H.td("Degrees of Freedom", {"class": "resultLabel"}) + H.td("", {id: "degreesOfFreedom", "class": "result"}))
        );
        var rightResults= H.table(
            H.tr(H.td("Type I Error (&alpha;)", {"class": "resultLabel"}) + H.td("", {id: "type1Error", "class": "result"})) +
            H.tr(H.td("Type II Error (&beta;)", {"class": "resultLabel"}) + H.td("", {id: "type2Error", "class": "result"})) +
            H.tr(H.td("Power (1 &ndash; &beta;)", {"class": "resultLabel"}) + H.td("", {id: "power", "class": "result"}))
        );
        var results = H.fieldset(
            H.legend("Results") + H.table(
                H.tr(H.td(leftResults) + H.td(midResults) + H.td(rightResults)) +
                H.tr(H.td("NCP = the noncentrality parameter", {"class": "noncentralityNote", colspan: 3}))
                , {id: "resultsTable", "class": "fullWidth"})
        );
        var html = H.table00(
            H.tr(H.thCenter(this.title, {id: "title"})) +
            H.trtd(canvasParent, {id: "canvTd"}) +
            H.trtdLeft(this.instructions, {"class": "instructions"}) +
            H.trtd(btns, {id: "buttonsParentTd", "class": "fullWidth"}) +
            H.tr("", {"class": "spaceBetweenButtonsAndSliders"}) +
            H.trtd(sliders, {id: "slidersParentTd", "class": "fullWidth"}) +
            H.tr("", {"class": "spaceBetweenSlidersAndResults"}) +
            H.trtd(results, {id: "resultsParentTd"})
            , {id: "PowerEffect"}
        );
        gUniverseElt.html(html);
        var ctx = $("#canvas")[0].getContext('2d');
        this.ctx = ctx;
        alphaButtonBar.init();
        effectsButtonBar.init();
        resetButtonBar.init();
        sliMean1.valElt = $("#sliMean1Val");
        sliMean2.valElt = $("#sliMean2Val");
        sliMean1.init();
        sliMean2.init();
        sliMean1.valElt.html(sliMean1.get());
        sliMean2.valElt.html(sliMean2.get());
        this.mean1 = sliMean1.get();
        this.mean2 = sliMean2.get();
        sliDev1.valElt = $("#sliDev1Val");
        sliDev2.valElt = $("#sliDev2Val");
        sliDev1.init();
        sliDev2.init();
        sliDev1.valElt.html(sliDev1.get());
        sliDev2.valElt.html(sliDev2.get());
        this.dev1 = sliDev1.get();
        this.dev2 = sliDev2.get();
        this.devCheck = $("#devCheck");
        this.sliMean1 = sliMean1;
        this.sliMean2 = sliMean2;
        this.sliDev1 = sliDev1;
        this.sliDev2 = sliDev2;
        sliGroupSize1.valElt = $("#sliGroupSize1Val");
        sliGroupSize2.valElt = $("#sliGroupSize2Val");
        sliGroupSize1.init();
        sliGroupSize2.init();
        sliGroupSize1.valElt.html(sliGroupSize1.get());
        sliGroupSize2.valElt.html(sliGroupSize2.get());
        this.groupSize1 = sliGroupSize1.get();
        this.groupSize2 = sliGroupSize2.get();
        this.groupSizeCheck = $("#groupSizeCheck");
        this.sliMean1 = sliMean1;
        this.sliMean2 = sliMean2;
        this.sliGroupSize1 = sliGroupSize1;
        this.sliGroupSize2 = sliGroupSize2;
        this.cohaninDElt = $("#cohaninD");
        this.meanDifferenceElt = $("#meanDifference");
        this.totalSampleSizeElt = $("#totalSampleSize");
        this.NCPElt = $("#NCP");
        this.criticalValueElt = $("#criticalValue");
        this.degreesOfFreedomElt = $("#degreesOfFreedom");
        this.type1ErrorElt = $("#type1Error");
        this.type2ErrorElt = $("#type2Error");
        this.powerElt = $("#power");
        this.alpha = this.alphaButtonValues[this.alphaButtonBar.selectedIndex];
        this.tLeftOverCanvasInfo = $("#tLeftOverCanvasInfo");
        this.tRightOverCanvasInfo = $("#tRightOverCanvasInfo");
        this.ncpOverCanvasInfo = $("#ncpOverCanvasInfo");
        this.h0OverCanvasInfo = $("#h0OverCanvasInfo");
        this.hAltOverCanvasInfo = $("#hAltOverCanvasInfo");
        this.alphaLeftOverCanvasInfo = $("#alphaLeftOverCanvasInfo");
        this.alphaRightOverCanvasInfo = $("#alphaRightOverCanvasInfo");
        this.betaOverCanvasInfo = $("#betaOverCanvasInfo");
        this.powerOverCanvasInfo = $("#powerOverCanvasInfo");
        this.clarifyOverCanvasInfo = $("#clarifyOverCanvasInfo");
        $("button.alphaButton").height(23);
        $("button.resetButton").height(23);
        this.action();
        //if (navigator.userAgent.indexOf(".NET") == -1){
        //    $("#sExponent").addClass("sExponent");
        //}
    },
    makeGrp1MeanSliderCallback: function(){
        return function(value, mode){
            this.valElt.html(value);
            this.app.mean1 = value;
            this.app.action();
        }
    },
    makeGrp2MeanSliderCallback: function(){
        return function(value, mode){
            this.valElt.html(value);
            this.app.mean2 = value;
            this.app.action();
        }
    },
    makeGrp1DevSliderCallback: function(){
        return function(value, mode){
            this.valElt.html(value);
            this.app.dev1 = value;
            if (this.app.devCheck[0].checked){
                this.app.sliDev2.set(value);
                this.app.sliDev2.valElt.html(value);
                this.app.dev2 = value;
            }
            this.app.action();
        }
    },
    makeGrp2DevSliderCallback: function(){
        return function(value, mode){
            this.valElt.html(value);
            this.app.dev2 = value;
            if (this.app.devCheck[0].checked){
                this.app.sliDev1.set(value);
                this.app.sliDev1.valElt.html(value);
                this.app.dev1 = value;
            }
            this.app.action();
        }
    },
    makeGrp1GroupSizeSliderCallback: function(){
        return function(value, mode){
            this.valElt.html(value);
            this.app.groupSize1 = value;
            if (this.app.groupSizeCheck[0].checked){
                this.app.sliGroupSize2.set(value);
                this.app.sliGroupSize2.valElt.html(value);
                this.app.groupSize2 = value;
            }
            this.app.action();
        }
    },
    makeGrp2GroupSizeSliderCallback: function(){
        return function(value, mode){
            this.valElt.html(value);
            this.app.groupSize2 = value;
            if (this.app.groupSizeCheck[0].checked){
                this.app.sliGroupSize1.set(value);
                this.app.sliGroupSize1.valElt.html(value);
                this.app.groupSize1 = value;
            }
            this.app.action();
        }
    },
    action: function(){
        var gh = this.gammaHelper;
        var n1 = this.groupSize1;
        var n2 = this.groupSize2;
        var totalSampleSize = n1 + n2;
        this.totalSampleSizeElt.html(totalSampleSize);
        var meanDiff = this.mean2 - this.mean1;
        var meanDiffAbs = Math.abs(meanDiff);
        var meanDiffFormatted = (meanDiff >= 0 ? "" : "&ndash;") + "%3.1f".sprintf(meanDiffAbs).trim();
        this.meanDifferenceElt.html(meanDiffFormatted);
        var df = totalSampleSize - 2;
        this.degreesOfFreedomElt.html(df);
        var cohensD = meanDiff/Math.sqrt(0.5*(this.dev1*this.dev1 + this.dev2*this.dev2));
        var cohensDFormatted = "%7.4f".sprintf(Math.abs(cohensD));
        this.cohaninDElt.html(cohensDFormatted);
        var ncp = cohensD*Math.sqrt((n1*n2)/(n1 + n2));
        var ncpFoAbs = "%7.4f".sprintf(Math.abs(ncp)).trim();
        var ncpFo = (cohensD > 0 ? "" : "&ndash;") + ncpFoAbs;
        this.NCPElt.html(ncpFo);
        var t = studentTcritical[this.alphaLookup[this.chosenAlphaIndex]][df];
        var leftT = -t;
        var rightT = t;
        var tFo = "%7.4f".sprintf(t);
        this.criticalValueElt.html(tFo);
        this.type1ErrorElt.html(this.alpha);
        var beta = ncp > 0
            ? noncentralStudentCDFleft(rightT, df, ncp, gh)
            : noncentralStudentCDFright(leftT, df, ncp, gh);
        var power = 1 - beta;
        var betaFo = "%7.5f".sprintf(beta);
        var powerFo = "%7.5f".sprintf(power);
        this.type2ErrorElt.html(betaFo);
        this.powerElt.html(powerFo);
        // graphics
        var nullHypTailColor = Options.PowerEffect.nullHypTailColor;
        var type2ErrorColor = Options.PowerEffect.type2ErrorColor;
        var nullHypTailBorderColor = Options.PowerEffect.nullHypTailBorderColor;
        var _studentTpdf = this.SPDF.getPDF(df);
        function studentTpdf(x){
            return Math.max(_studentTpdf(x), Options.PowerEffect.pdfDontGoUnder);
        }
        var ctx = this.ctx;
        CANVAS.erase(ctx);
        var axisFromBottom = Options.PowerEffect.axisFromBottom;
        var tMin = Options.PowerEffect.tMin;
        var tMax = Options.PowerEffect.tMax;
        if (ncp > tMax){
            tMax = ncp;
        }
        if (ncp < tMin){
            tMin = ncp;
        }
        var distanceBellCurvePeakCanvasTop = Options.PowerEffect.distanceBellCurvePeakCanvasTop;

        var nonCurveHeight = axisFromBottom + distanceBellCurvePeakCanvasTop;
        var totalHeight = this.canvasHeight;
        var curveHeight = totalHeight - nonCurveHeight;
        var maxDensity = studentTpdf(0);
        var scaleFactor = maxDensity / curveHeight;
        var underAxisScaled = scaleFactor * axisFromBottom;
        var overAxisScaled = scaleFactor * distanceBellCurvePeakCanvasTop;

        var temp = CANVAS.xAxis(ctx,
            { min: tMin, axisMin: tMin, max: tMax, axisMax: tMax, axisLabel: "",
            distanceFromBottom: axisFromBottom, minorStep: 0.5, majorStep: 1 }
        );
        var plotOpts = {
            xMin: tMin, xMinPlot: tMin, xMax: tMax, xMaxPlot: tMax,
            yMin: -underAxisScaled, yMinPlot: 0, yMax: maxDensity + overAxisScaled, yMaxPlot: maxDensity,
            step: 0.01, color: this.tColor, lineWidth: 1.5
        };
        function alt(x){
            return Math.max(noncentralStudentPDF(x, df, ncp, gh), Options.PowerEffect.pdfDontGoUnder);
        }
        var nullHypPlotOptions = jQuery.extend({color: "red"}, plotOpts);
        var altHypPlotOptions = jQuery.extend({color: "blue"}, plotOpts);
        var plotOptionsLeft = jQuery.extend({}, plotOpts, {
            xMaxPlot: Math.min(leftT, tMax), color: nullHypTailColor
        });
        var plotOptionsRight = jQuery.extend({}, plotOpts, {
            xMinPlot: Math.max(rightT, tMin), color: nullHypTailColor,
        });
        var plotOptionsType2Err;
        if (ncp > 0){
            plotOptionsType2Err = jQuery.extend({}, plotOpts, {
                xMaxPlot: Math.min(rightT, tMax), color: type2ErrorColor
            });
        } else {
            plotOptionsType2Err = jQuery.extend({}, plotOpts, {
                xMinPlot: Math.max(leftT, tMin), color: type2ErrorColor
            });
        }
        this.tCanvasPlot = new CanvasPlot(ctx, studentTpdf, nullHypPlotOptions);
        this.aCanvasPlot = new CanvasPlot(ctx, alt, altHypPlotOptions);
        this.leftFillPlot = new CanvasPlot(ctx, studentTpdf, plotOptionsLeft);
        this.rightFillPlot = new CanvasPlot(ctx, studentTpdf, plotOptionsRight);
        this.type2ErrPlot = new CanvasPlot(ctx, alt, plotOptionsType2Err);
        if (leftT >= tMin){
            this.leftFillPlot.fillPlot();
        }
        if (rightT <= tMax){
            this.rightFillPlot.fillPlot();
        }
        this.type2ErrPlot.fillPlot();
        this.tCanvasPlot.plot();
        this.aCanvasPlot.plot();
        // labeled lines at plus minus critical value
        ctx.strokeStyle = nullHypTailBorderColor;
        var xLeft = this.leftFillPlot.xTrafo(leftT);
        var y0 = this.leftFillPlot.yTrafo(0);
        var y1 = this.leftFillPlot.yTrafo(0.4);
        this.axisPosition = y0;
        ctx.beginPath();
        ctx.moveTo(xLeft, y0);
        ctx.lineTo(xLeft, y1);
        ctx.stroke();
        var xRight = this.leftFillPlot.xTrafo(rightT);
        ctx.beginPath();
        ctx.moveTo(xRight, y0);
        ctx.lineTo(xRight, y1);
        ctx.stroke();
        var tLblWidth = 70;
        this.tLeftOverCanvasInfo.css({
            width: tLblWidth,
            height: 20,
            left: xLeft - tLblWidth/2,
            top: y1 - 20
        });
        var tLblWidth2 = 50;
        this.tLeftOverCanvasInfo.html("&ndash;" + tFo.trim());
        this.tRightOverCanvasInfo.css({
            width: tLblWidth2,
            height: 20,
            left: xRight - tLblWidth2/2,
            top: y1 - 20
        });
        this.tRightOverCanvasInfo.html(tFo.trim());
        // labeled dashed lines trough maxima
        ctx.strokeStyle = "black";
        var xCenterH0 = this.leftFillPlot.xTrafo(0);
        var y2 = this.leftFillPlot.yTrafo(0.5);
        CANVAS.dashedLine(ctx, xCenterH0, y0, xCenterH0, y2, [4, 2]);
        var xCenterHAlt = this.leftFillPlot.xTrafo(ncp);
        CANVAS.dashedLine(ctx, xCenterHAlt, y0, xCenterHAlt, y2, [4, 2]);
        ncpLblWidth = cohensD >= 0 ? 80 : 100;
        this.ncpOverCanvasInfo.css({
            width: ncpLblWidth,
            height: 20,
            left: xCenterHAlt - ncpLblWidth/2,
            top: y2 - 20,
            "white-space": "nowrap"
        });
        this.ncpOverCanvasInfo.html("&delta; = " + ncpFo);
        var arrowHeadLength = 16;
        var arrowHeadThickness = 8;
        var y3 = this.leftFillPlot.yTrafo(0.477);
        var dx = ncp > 0 ? 5 : -5;
        CANVAS.arrow(ctx, xCenterH0 + dx, y3, xCenterHAlt, y3, arrowHeadLength, arrowHeadThickness, "#888", 1);
        CANVAS.arrow(ctx, xCenterHAlt - dx, y3, xCenterH0, y3, arrowHeadLength, arrowHeadThickness, "#888", 1);
        var unknownWidth = 77;
        this.clarifyOverCanvasInfo.css({
            width: unknownWidth,
            height: 25,
            left: (xCenterH0 + xCenterHAlt) * 0.5 - 35,
            top: y3 - 20,
            "white-space": "nowrap"
        });
        this.clarifyOverCanvasInfo.html(H.italic("d") + " = " + cohensDFormatted);
        // hypotheses lables
        this.h0OverCanvasInfo.css({
           width: 24,
           height: 25,
           left: xCenterH0 - 23,
           top: distanceBellCurvePeakCanvasTop - 25,
           "background-color": "transparent"
        });
        this.h0OverCanvasInfo.html("H" + H.sub("0"));
        this.hAltOverCanvasInfo.css({
           width: 24,
           height: 25,
           left: xCenterHAlt + 6,
           top: distanceBellCurvePeakCanvasTop - 17,
           "background-color": "transparent"
        });
        this.hAltOverCanvasInfo.html("H" + H.sub("A"));
        // half alpha labels and arrows
        var alphaLblDistFromTline = 25;
        var yyyy = y0 + 29;
        var xLeftAlpha = xLeft - alphaLblDistFromTline;
        this.alphaLeftOverCanvasInfo.css({
           width: 40,
           height: 70,
           left: xLeftAlpha,
           top: yyyy
        });
        var halfAlphaLbl = H.table(
            H.tr(H.td("&alpha;")) +
            H.tr(H.td(2, {style: "border-top: 1px solid red"}))
            , {id: "leftHalfAlphaTable", "class": "halfAlphaTable"}
        )
        this.alphaLeftOverCanvasInfo.html(halfAlphaLbl);
        var xRightAlpha = xRight + alphaLblDistFromTline - 14;
        this.alphaRightOverCanvasInfo.css({
           width: 40,
           height: 70,
           left: xRightAlpha,
           top: yyyy
        });
        this.alphaRightOverCanvasInfo.html(halfAlphaLbl);
        var arrowHeadY = y0 - 5;
        var arrowRootY = y0 + 33;
        var arrowColor = "red";
        var arrowLineWidth = 1;
        CANVAS.upArrow(ctx, xLeftAlpha + 7, arrowHeadY, arrowRootY, arrowHeadLength, arrowHeadThickness, arrowColor, arrowLineWidth);
        CANVAS.upArrow(ctx, xRightAlpha + 7, arrowHeadY, arrowRootY, arrowHeadLength, arrowHeadThickness, arrowColor, arrowLineWidth);
        // beta with arrow
        arrowColor = "blue";
        var xBeta;
        if (ncp > 0){
            xBeta = xRightAlpha - 2*alphaLblDistFromTline;
        } else {
            xBeta = xLeftAlpha + 2*alphaLblDistFromTline;
        }
        CANVAS.upArrow(ctx, xBeta + 7, arrowHeadY, arrowRootY, arrowHeadLength, arrowHeadThickness, arrowColor, arrowLineWidth);
        this.betaOverCanvasInfo.css({
           width: 24,
           height: 25,
           left: xBeta + 2,
           top: yyyy + 5
        });
        this.betaOverCanvasInfo.html(H.italic("&beta;"));
        // power with arrow
        this.powerOverCanvasInfo.css({
           width: 60,
           height: 25,
           left: ncp > 0 ? ctx.canvas.width - 50 : 5,
           top: distanceBellCurvePeakCanvasTop - 40
        });
        this.powerOverCanvasInfo.html("Power");
        var sourceX = ncp > 0 ? ctx.canvas.width - 30 : 25;
        var sourceY = distanceBellCurvePeakCanvasTop - 20;
        var targetX, canvasTargetX;
        if (ncp > 0){
            if (ncp < rightT){
                targetX = rightT + 0.5;
            } else {
                if (ncp <= 4.2){
                    targetX = ncp + 0.5;
                } else {
                    if (ncp <= 5.7){
                        targetX = Math.min(ncp - 0.5, 4.7);
                    } else {
                        targetX = ncp - 1;
                    }
                }
            }
        } else {
            if (ncp > leftT){
                targetX = leftT - 0.5;
            } else {
                if (ncp >= -4.2){
                    targetX = ncp - 0.5;
                } else {
                    if (ncp >= -5.7){
                        targetX = Math.max(ncp + 0.5, -4.7);
                    } else {
                        targetX = ncp + 1;
                    }
                }
            }
        }
        canvasTargetX = this.leftFillPlot.xTrafo(targetX);
        var redY = studentTpdf(targetX);
        var blueY = alt(targetX);
        var powerTargetY = 2/3 * blueY + 1/3 * redY;
        var canvasTargetY = this.leftFillPlot.yTrafo(powerTargetY);
        ctx.strokeStyle = "black";
        //ctx.beginPath();
        //ctx.moveTo(sourceX, sourceY);
        //ctx.lineTo(canvasTargetX, canvasTargetY);
        //ctx.stroke();
        CANVAS.arrow(ctx, sourceX, sourceY, canvasTargetX, canvasTargetY, arrowHeadLength, arrowHeadThickness, "black", 1);
        // axis
        CANVAS.xAxis(ctx,
            { min: tMin, axisMin: tMin, max: tMax, axisMax: tMax, axisLabel: "",
            distanceFromBottom: axisFromBottom, minorStep: 0.5, majorStep: 1 }
        );
        ctx.fillStyle = "#aaa";
        ctx.fillRect(0, ctx.canvas.height - 14, ctx.canvas.width, 2);
    }
};
/*******************************************************************************************************
 F112 (F-test)
*******************************************************************************************************/
F112 = {
    dotRadius: Options.F112.dotRadius,
    dotColor: Options.F112.dotColor,
    underFPDFfillColor: Options.F112.underFPDFfillColor,
    totalWidth: 1305,
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    criticalFvalues: [6.9266081401913, 3.885293834652392, 2.806795605732418], // k (number of groups) and grand sample size (n) hardcoded in to 3, 15, respectively
    leftCanvasWidth: 630,
    rightCanvasWidth: 620,
    shift: 125,
    meanLineLength: 80,
    meanLineThickness: 3,
    grandMeanDashing: [4, 4],
    grandMeanColor: "#a00",
    grandMeanLineColor: "#000",
    grandMeanFont: "bold 11pt Arial",
    grandMeanLineThickness: 3,
    underCurveColor : "#e1938d",
    curvePlotColor: "#5654a0",
    canvasFont: "bold 12pt Arial",
    yAxisLabel: "Number of Violations",
    canvasHeight: 380,
    rightCanvasHeight: 340, 
    maxViolations: 10,
    times: UTIL.range(0, 4),
    fPDFcalc: null,
    data : [
        {
            name: "young",
            displayName: "18 to 22",
            initialViolations: [10,6,7,9,8],
            color: "#ccf",
            color3: "#00f"
        },
        {
            name: "middle",
            displayName: "23 to 27",
            initialViolations: [4,7,5,6,2],
            color: "#faf",
            color3: "#800080"
        },
        {
            name: "old",
            displayName: "28 to 32",
            initialViolations: [4,6,7,3,2],
            color: "#afa",
            color3: "#006600"
        }
    ],
    ssbSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAAyCAYAAAAHmKRSAAAC0ElEQVR4nO2ZS5LDIAwFffMcfWaVmZQtgj4PAeJ1lRepgACJjol9/RBCHlyzJ0BIJtd1idej3YS5ETKFlhSSHBSDHMHXu4PwHcUg5WkJIbV5t6MYDnpJJuOx1EAjxr0dK2yEUqwDuhYUw4n2l4fkgK4HxXBAKdYEVRP++XZCMeL0HpdqLykmam5/n9GTrrh5qq4rm9frBbnuROvTfY8R2eAUg8wiUh/1m+/IBq+4gSquqSKRH3Pxu1Zj9EC7UnFNFbHUSbO/xW+iclSCYuyB9SVe9024JoD1LWMVeutHPrA44YHGyFyo7gKWu4p2ISfSWz/qKYvnScyOjMyFVhwtajFOlOPUde9K8wmT447UrfosOVpjZh4z0H/oIu2rMSJfqWJ4FhFFGm/GGdx8+1XO53Qp3qDzhcypWYyMYj7sDfwpQ80B1YdS/IPOFzK36giZcmg3/mpi9PpRiifIfE0R43Pg0Vg2/C5iUAoZZL6mipHBrNsnKu63oyB5gsrXtKNUBtbjkeWc6p2HFUShTxJpWzEyizTibjEjyZr/SJr+pxDN1z1GeD7awbJY4RiFiB0tMhJp03muzDlGY4TnoxksE4qBh2I4YvUGcgUNTKyCGNmbandQ+UoRI7q5vf3QUmSfV+/9PHFOkgmRr1as0Ly+DeAKmGQ8xajBdmK4Ay4kRvZtudXHs64TQOQL0U+MJQV3B0s8I64mxrf2FOMJKl+IfmKsVuDo5ZrMpmJY5jLq6LcTyHxF+zRjSUFniIHeiJ/tvFjGQLerCjpfUh8E130SVcRAJAn9q9ZrTykw7RGUrUKGGGiqizEaiqGAYpwHxVCAFCNrs1IMP+hala0C7OkExdgCdO5KVgH6y5G0WSlFDIqhgGKcB8WYADft2oyoD6utgGKsDcWYCOVYk1F1YaWVUIw1oRgLQDnWYmQ9WGUjFGMdRtaCVXZAOeYzugasMCECv230+/G3DEa5AAAAAElFTkSuQmCC",
    sswSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAoCAYAAAAG/eNpAAACI0lEQVR4nO2b0XLDIAwE+fN8On1yG7tgkHQSgrmd8UNiEFLYYkimpRISQFmdANmfUkrzurVZlBs5hJ5kT9koGlHTW71a9ygaUdETrNWmlELRiI4Z0b7bUTTiCkUjIfwTbXR6kFyE1Hp/vJbWDY0wFI08eT11WoTRCkpygJyL4fdoiFVN0p7kAjEn078MWGVDtiPxWOam+wXuqIPHKsW93B/IQxjqkOaxR3+N5rHBp2R3Pp9P2CVBMk8znkyLhnx2U7T8zM7V9C8EkgGtgkwnJRzvFIGz1T1cpSS5SgZEbBLRH+Ipkl1kqvttDPEeUTqgtjAP0U6TrNZcdYeL1gqsTVrTZ1ToaWSqG7Y/jxhU++H0+p0sWa256obtz6WDqgYBrIRX39Mlu8hSd7hokQeBt76aWDuKmaXuUNGsAyEPEpZH8G5kqDtMtAzJWg8i1vG0FzqPFYSKZoWiYfJYQYhoFjGerxF7tF0fgRqy1O0umnVP9nxt2WOs3hBHk6luV9EQj7nWexRtjkx1u4umDggSrddHEusEyUbvv8XwzEccpxXYIylJsjNxThQtY92wlbEVFHH1Eh4lPdNOGmsHMtaNWs1qrT7/16kVDSnjd7vsZK0bLhpasl5iM/cQj9fRWJnIXDc0FiTK7GCBk7+LaGgo2jVgkAAULUec33iwSJJBKZobSNGQLJsJbwkomi0GmqUz4SUCJbPF8GD5bLj89VA0dX8vfgCvLKV5EeipFgAAAABJRU5ErkJggg==",
    sstSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAAAwCAYAAAD6ryNrAAACZElEQVR4nO2Y2ZKEIAxF+XM/PfPkVLcNkuWy31Plw9iQxHBG0SSEVEgpZY+vMYNqI4tQkugpE0UiRUp3n9xvFIlkKQmUG5NSmkOkWsEEg6XPGpE+xw1fQUrUF3S/pxBJaz3Bge75cJEo0ThQfZ9is02RdNRev7VHLiaqNpGHSKiitbt9Uue6LsjxJLoG1e9IFiHe5lqKIP2JrIH6y7ZXJE2BlGgeIjeLn/Nvg5GJtL+TfljWouZDMUpUplpcMh7zR8e3ddUGsH4V9RZEvmn58qMSRCub5UKiUCQ7rd7aRBSPK8ujrzog8IiLFEb6UNw8W+96lmTobw/anC3Gr0iLnnQVyXMRlqKjOU+Q6AbdE9i2RT0weFfybtq1/1EnSCSC7wls22IaHJCpxbzTJLpB9mSISJ+JvfNQIp0qkQi2J0NFciUCPhZPlugG1ZNhjzZ3osEi7SbesiKh3tgQd7RIw3Yi2pNnjFAtlmShRGCRWpNbJM/Rs8ZojFAt2mRRKFL7GqMxQrVoErkCP+ahbr87PqI8oHrSRaTonuj5N2IzyI029i22uUgIy3PnKFKc5URyBwWJVJpjibW7RLXz3njmukrB3QFBF/o2/lSRUD1BzPuJ8xY4engL1ozVxttFJGRPonOycUpB0SJ9xkdc2EkioXuSmxPlPwJaIo9IyMefJt8KoHtSGh+la5d7L+wOIrWGIk2Yb0WWFqnX4lKkd5Dr0b3LFGkekP3ZViRKVIciTZRnZZYWSYSLPAPoNaBIh7KFSCKUaSQtek+RDmQrkUQo0wha9Xz4KlKkvrTq9xSrSJn60LLPf4jNSAC4GG2wAAAAAElFTkSuQmCC",
    msbSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAABLCAYAAADOB/9yAAAB/ElEQVR4nO1aWxKDIBDjaN7/UtuvdtSKm30EEMkMP7BkExEWOy3yIpTeAloCMltKqTZ3YgKnmtMryCuSwYmiymYVhYhjcFLMRuNYnBZcMkVfzVacVqSYReYwOK1INauNZ3NaoZpNe6qNysuthurAhIbNpSeUrEEtvc2vBkxkel0Xq8EDrbLn1uVSylgNK6dm9mp+SGXPE9tzgSlagEWcZczLuR9HOA59TGHLbJBzP45wHPquEqDi1AOBwFkzgoyXqyDLAWGNY3G6Sg9CZF2xbE4vB/TVEzGazWl9GKpZRKAXUU7r23TocynuiGUWjJvSrGvPjoaIUZGHmk2rsyMjWroeZTaK4rndPLh1F9Cubdsmb2nv2rO9BbTEMjsrltlZsczOimV2VlDNIp9d5zgk3q2HwvolV8TfXdopeiisX/K3mEWEs8395aMRG1a1FZZZaKKyz5D+Vnv1l9s1CRCr9T3CrOe3H3QuG6H/QWnjI+1XEYNZdBWmMxuNXWYbAMpmFYfua5Qj6zCjmo1wMcpUutmsV5ixDYY0G30Y1TlQkPPVi/JEY/7mQEFJNfaRZs9J0AMkyyz1gNonQJvGEc3lQehufE6esapaHnrp0YRcjd3NQ/hRDSbtpugGsK6+idsrioVlNhB3mOMVxcJr9izTqMigZoeos2wwjYqIfADhLLjV6YVAkAAAAABJRU5ErkJggg==",
    mswSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABLCAYAAAAicppkAAACPElEQVR4nO2YW66DMAxEWRr731Tu15UqIOMZPyAtHomPEscZH8iDbqM11UYFbdv0cg9ckDNb0AkqwFtURc4qTUdXi2CKqchZKRpONK4qZ6UuR45OlbtyVisFDtOnIme1UuFY7dk5q2XCyTK4wjRRFV6QpcG+DJC8lYcGW2yrtmQ6ezOk/nwAkpys8BZ5zkreOFdlFU+bzakWfDucKwN37WjZcOCDUJMpJipzsv0bzqQ9un41HBWOuhswcLJzor6e2MsYZIyhrsZFcyrgZrH0esQUY12WMnNaBXtjL8eKFsOqAjZ7j51qp3G8BXmVCXr22xt76ks7WkifBbLTkIk99Y3ZfEYNB0iZjpHloOGgvhGTT8l7jJDH8Zh7Wg1nAW2e0+sbroZjwdn3ffR1vsboNQeq4QA1HKCGA9RwgBoOUMMBajhADQeo4QCVwjl+qzBxTPxdehSO9eH3tBoOUJkLptDVYBz1GJzVwYzRcKDczqx1grm/6lrzL5cbpjjr3k/C8f4fy/RdTZIjqxi24JWBfIp2xz7l18OJxjact8BRi2HXJdRXGScr7tRPMZFhOguO501WlQ4nOqWy4USm71fCUc5Hy8BRzkFWDqY9msuSDCdyxnkFnOOAV+0VcI5tWbve1AsdOAHAgjnmYMaZtVmxyhqJFPq2OpqIvjUoToGQAWaMpK9yy6zVNotl77FTTdWS5/fI2vIqOJm7l+wjLVOiGg4Qs/N5YmUfqdmS1HCAPDtbNpgxGg7OnZ7xh/QH4lCz2f20MmgAAAAASUVORK5CYII=",
    fRatioSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABKCAYAAAAVO2ILAAACiElEQVR4nO2YW5bCMAxDu7Tuf1OdP4YJbivJduIO1jn9oPihXFIH2I6WpE1K2raPa0YNK0ft79UScOzir4CtghgGjjHM5LPQZsGbDs6727xxUaI7jOY84N5fI7FM7Wx4U8Gxud4xkKl/CW6GpoGz4tiDoZJKgxtjKsGjnEQsnskb4yoBDAXHzCrvibkaoBvc1X01B+m/GmAqOAUo60M91b3wHwnOquGZl9LuV43e3Vfmnip08ZF+YNfs7lF3m/zogB8UUgPqF2HsClxELa+/Oz9MzCs2wtj4nucxbXDArLmrBS8CyPHMPzMeDiR2kQecpxYTx/Qw60FBSQtAe6JXRD1UZcFZNb3Q0F6IUsBFGhxzPDMwKu44hL+VnqgGJ6rBiVo2456stLnrNVZdUSfzR90kv2WUAe04vgBcll7glG/qX301OCe4fd/7Iq6ecaIanKgGJ6rBiWpwohqcqAYnqsGJanCiGpyoW3DW7zS6iVDj6ndiBaWDYxfP/theJQkcY5jJV/+pWKFUcN7d5o3L1GXX0ZwH3PtrJJapvQJeGjg21zsGZuvx4FYpBZwVxx4M1VUG3BhTHd6pu4jFM3ljXHWAMjhmVnlPzIoAKXBX99UcpH9FgGHgFKCQwaLwyoOzaiCjgqmpxIWAU+aeqjt4LIxQcOzuUXebCnQmuNM+qjELXEQtRF5wzLxMA+d5TFeAs7wjsR/vqcbY5ne12IH+OHCWeRWcp9ZdPeQ9tc5xGOCiFoDWsuohl9LzDNwYC/VRFhsNzqqpQLvqyQCC+qCN2Rgm7ixHmYHvNdB76OP7Jxd28yB5ZlmD2/iTk9nZDa7B/Uo9TKg56jVZUQ1OlPo1iOqhmqusGeB+AGIbm65dZO2SAAAAAElFTkSuQmCC",
    alphaButtonClick: function(i){
        // the critical value of f is (almost) the only thing in this app which is hardcoded in to the specific values
        // of k (number of groups) and grand sample size (n)
        this.app.alpha = this.app.alphaButtonValues[i];
        this.app.fCrit = this.app.criticalFvalues[i];
        this.app.chosenAlphaIndex = i;
        this.app.action();
    },
    run: function(){
        this.useCustomSelect = ( navigator.userAgent.indexOf(".NET") == -1 );
        this.alpha = this.alphaButtonValues[this.initiallyChosenAlphaIndex];
        this.fCrit = this.criticalFvalues[this.initiallyChosenAlphaIndex];
        if (!this.fPDFcalc){
            this.fPDFcalc = new Fpdf(100);
        }
        var THIS = this;
        //"main" table (lower left); and container for summary table above that, which will be taken care of later (in action)
        var maxViolations = this.maxViolations;
        var times = this.times;
        var data = this.data;
        var opts = UTIL.range(1, maxViolations);
        var optsHtml = opts.map(function(choice){return H.option(choice + "&nbsp;&nbsp;"); }).join("");
        function makeSelector(idSel, idTd, color, last, first){
            var className = "tbody";
            if (last){
                className += " lastColumn";
            } else {
                className += " notLastColumn";
            }
            if (first){
                className += " firstColumn";
            } else {
                className += " notFirstColumn";
            }
            var atts = {"class": className, id: idTd, style: Style.toString({"background-color": color})};
            return H.tdCenter(H.div(H.sel(optsHtml, {id: idSel})), atts);
        }
        function makeRow(timeIndex){
            var trContent = H.thLeft(times[timeIndex], {"class": "lineBreakDisabled rowHead upper", id: "rowHead" + timeIndex});
            trContent = "";
            for (var i=0; i<data.length; i++){
                var ageGroup = data[i];
                ageGroup.violations = ageGroup.initialViolations.concat([]); // copy so we can reset later
                var idTrunk = ageGroup.name + timeIndex;
                var idSel = idTrunk + "Selector";
                var idTd = idTrunk + "Td";
                trContent += makeSelector(idSel, idTd, ageGroup.color, i == data.length - 1, i == 0);
            }
            return H.tr(trContent, {id: "row" + timeIndex});
        }
        var upperTrs = UTIL.range(0, times.length-1).map(makeRow).join("");
        function makeLowerRow(title, idTrunk, argColor){
            var className = "lineBreakDisabled rowHead lower";
            var trContent = H.thLeft(title, {"class": className, id: idTrunk + "RowHead"});
            trContent = "";
            for (var i=0; i<data.length; i++){
                var ageGroup = data[i];
                var id = ageGroup.name + idTrunk;
                var color = arguments.length < 3 ? ageGroup.color3: (i == 0 ? argColor : "black");
                var tdClassName = "summaryBody";
                var last = ( i == data.length - 1 );
                var first = ( i == 0 );
                if (last){
                    tdClassName += " lastColumn";
                }
                if (first){
                    tdClassName += " firstColumn";
                }
                trContent += H.tdCenter("", {id: id, style: Style.toString({color: color}), "class": tdClassName})
            }
            return H.tr(trContent, {id: "row" + idTrunk});
        }
        var lowerTrs = [
            makeLowerRow("Mean", "Mean"),
            makeLowerRow("Variance", "Var"),
            makeLowerRow("Sample Size", "SaSi"),
            makeLowerRow("Grand Mean", "Grand", this.grandMeanColor)
        ].join("");
        var btnRowContent = H.th("", {id: "emptyTopLeftCorner"});
        btnRowContent = "";
        for (var i=0; i<data.length; i++){
            var ageGroup = data[i];
            var id = ageGroup.name + "Button";
            var color = ageGroup.color3;
            var btn = H.btn(ageGroup.displayName, {id: id, style: Style.toString({color: color}), "class": "ageGroupButton"});
            btnRowContent += H.tdCenter(btn, {id: id + "Td", "class": "buttonTd"});
        }
        var btnRow = H.tr(btnRowContent, {id: "buttonRow"});
        var main = H.table00(btnRow + upperTrs + lowerTrs, {id: "mainTable"});
        var lowerLeftTable = H.table00(
            H.trtd("", {id: "summaryTableTd"}) +
            H.trtd(main, {id: "mainTd"})
            , {id: "lowerLeftTable"}
        );
        // lower right table (calculation details)
        function lrtRow(id){
            var eq = H.tdCenter("=", {"class": "equals"});
            return H.tr(H.thLeft("", {id: id + "Head", "class": "lineBreakDisabled"}) + eq +
                H.tdLeft("", {id: id + "Formula"}) + eq +
                H.tdLeft("", {id: id + "Details"}) + eq +
                H.tdLeft("", {id: id + "Result"})
            );
        }
        var lowerRightTable = H.table00(["ssb", "dfb", "ssw", "dfw", "sst", "dft", "msb", "msw", "fRatio"].map(lrtRow).join(""), {id: "lowerRightTable"});
        // put together lower table
        var lowerTable = H.table00(H.tr(
            H.td(lowerLeftTable, {id: "lowerLeftTd"}) + H.td(lowerRightTable, {id: "lowerRightTd"})
        ), {id: "lowerTable"});
        // upper
        var alphaButtonBar = new ButtonBar({
            buttonLabels: this.alphaButtonCaptions,
            headerLabel: "Alpha Value:",
            selectedIndex: this.initiallyChosenAlphaIndex,
            idPrefix: "alpha",
            name: "alphaButtonBar",
            app: this,
            tableStyle: {"background-color": "white"},
            btnClass: "alphaButton",
            callback: this.alphaButtonClick
        });
        var upperRight = H.table(
            H.tr(H.td(alphaButtonBar.html, {id: "alphaBBTd", "class": "fullWidth"})) +
            H.tr(H.td("", {id: "rightCanvasTd", "class": "fullWidth"}))
            , {id: "upperRight", "class": "fullWidth", align: "right"}
        );

        var upperTable = H.table00(H.tr(
            H.td("", {id: "canvasTd"}) +
            H.td("", Style.attachToAtts({id: "grandMeanCanvasLabel"}, {display: "block"})) +
            H.tdRight(upperRight, {"class": "fullWidth"})
            , {id: "upperTable"}
        ));
        // everything
        var html = H.table00(
            H.tr(H.td(upperTable, {id: "upperTd", "class": "fullWidth"})) +
            H.tr("", {"class": "spacerRow"}) +
            H.tr(H.td(lowerTable, {id: "lowerTd"}))
            , {id: "F112", width: this.totalWidth}    // 
        );
        gUniverseElt.html(html);
        alphaButtonBar.init();
        // fill fixed portion of lower right table (heads and formulas)
        var itn = H.italic("n");
        var itk = H.italic("k");
        var iti = H.italic("i");
        var itSS = H.italic("SS");
        var itdf = H.italic("df");
        var itMS = H.italic("MS");
        var itFR = H.italic("F-Ratio");
        var itB = H.italic("B");
        var itW = H.italic("W");
        var itT = H.italic("T");
        $("#ssbHead").html(H.withIndex(itSS, itB));
        $("#sswHead").html(H.withIndex(itSS, itW));
        $("#sstHead").html(H.withIndex(itSS, itT));
        $("#dfbHead").html(H.withIndex(itdf, itB));
        $("#dfwHead").html(H.withIndex(itdf, itW));
        $("#dftHead").html(H.withIndex(itdf, itT));
        $("#msbHead").html(H.withIndex(itMS, itB));
        $("#mswHead").html(H.withIndex(itMS, itW));
        $("#fRatioHead").html(H.italic("F") + "-Ratio");
        
        var images = ["ssb", "ssw", "sst", "msb", "msw", "fRatio"].map(function(what) {
            var img = new Image();
            img.src = THIS[what + "Src"];
            img.style.height = "auto";
            return img;
        });// 110 110 110 34 37 37
        this.images = images;
        $("#ssbFormula").html(images[0]); $("#ssbFormula img").width(99);
        $("#sswFormula").html(images[1]); $("#sswFormula img").width(89);
        $("#sstFormula").html(images[2]); $("#sstFormula img").width(89);
        $("#msbFormula").html(images[3]); $("#msbFormula img").width(29);
        $("#mswFormula").html(images[4]); $("#mswFormula img").width(31);
        $("#fRatioFormula").html(images[5]); $("#fRatioFormula img").width(32);
        $("#dfbFormula").html(H.italic("k") + " &ndash; 1");
        $("#dfwFormula").html(H.italic("n") + " &ndash; " + H.italic("k"));
        $("#dftFormula").html(H.italic("n") + " &ndash; 1");
        this.grandMeanCanvasLabel = $("#grandMeanCanvasLabel");
        if (navigator.userAgent.indexOf("Firefox") != -1){
            //$("table#F112 table#mainTable select").css({"padding-top": "1px"})
        }
        // fill canvas containers with html
        var width = $("table#F112 table#mainTable").width();
        var canvasHtml = H.canvas({id: "canvas", width: this.leftCanvasWidth, height: this.canvasHeight, style: "display: block;"});
        $("table#F112 td#canvasTd").html(canvasHtml);
        var ctx = $("table#F112 td#canvasTd canvas#canvas")[0].getContext("2d");
        this.ctx = ctx;
        var rightCanvasHtml = H.canvas({id: "rightCanvas", width: this.rightCanvasWidth, height: this.rightCanvasHeight, style: "display: block;"});

        var itH = H.italic("H")
        var itMu = H.italic("&mu;")
        var mu1 = H.withIndex(itMu, "1");
        var mu2 = H.withIndex(itMu, "2");
        var mu3 = H.withIndex(itMu, "3");
        var h0Head = H.withIndex(itH, "0") + ":";
        var hAHead = H.withIndex(itH, "A") + ":";
        var h0Content = [mu1, mu2, mu3].join(" = ");
        var hAContent = [mu1, mu2, mu3].join(" &ne; ");
        var ocTable = H.table(
            H.tr(H.thRight(h0Head) + H.thLeft(h0Content)) +
            H.tr(H.thRight(hAHead) + H.thLeft(hAContent)) +
            H.tr(H.thRight(" ") + H.thLeft(" "), {style: "height: 12px"}) +
            H.tr(H.thRight("Result:") + H.thLeft("", {id: "finalResult"}))
        );
        var overCanvasInfo = H.span(ocTable, {
            id: "overCanvasInfo", "class": "overCanvasInfo",
            style: "left: 200px; top: 18px;"
        });
        var rightCanvasParent = H.div(
            rightCanvasHtml + overCanvasInfo
            , {id: "rightCanvasParent", style: "position: relative; z-index: 0;"}
        );


        $("table#F112 td#rightCanvasTd").html(rightCanvasParent);
        var rightCtx = $("table#F112 td#rightCanvasTd canvas#rightCanvas")[0].getContext("2d");
        this.rightCtx = rightCtx;
        rightCtx.strokeRect(0,0,rightCtx.canvas.width, rightCtx.canvas.height);
        var parentLeft = $("table#F112").offset().left;
        // initialize selectors and buttons
        function getSelectorSettings(){
            var times = this.app.times;
            var result = new Array(times.length);
            for (var t=0; t<times.length; t++){
                result[t] = this.sel[t][0].selectedIndex + 1;
            }
            return result;
        }
        function setSelectors(values){
            if (arguments.length < 1){
                values = this.violations;
            }
            for (var t=0; t<values.length; t++){
                var val = values[t];
                var selInd = val - 1;
                this.sel[t][0].selectedIndex = selInd;
                if (THIS.useCustomSelect){
                    var valStr = val + "&nbsp;&nbsp;";
                    this.sel[t].parent().find(".customSelectInner").html(valStr);
                }
            }
        }
        function setRandom(){
            var rands = new Array(this.violations.length);
            for (var t=0; t<rands.length; t++){
                rands[t] = 1 + Math.floor(Math.random() * this.app.maxViolations);
            }
            this.set(rands);
            this.violations = rands;
        }
        function btnClick(){
            var elt = $(this);
            var myIndex = elt.attr("data-index");
            THIS.data[myIndex].setRandom();
            THIS.action();
        }
        if (this.useCustomSelect){
            this.makeSelectsCustom();
        }
        for (var i=0; i<data.length; i++){
            var ageGroup = data[i];
            var name = ageGroup.name;
            var id = name + "Button";
            var color = ageGroup.color3;
            var btnElt = $("#" + id);
            ageGroup.btn = btnElt;
            var w = btnElt.width();
            var bLeft = btnElt.offset().left;
            var x = bLeft - parentLeft + w/2;
            ageGroup.x = x + this.shift;
            ageGroup.sel = new Array(this.times.length);
            for (var t=0; t<this.times.length; t++){
                var sId = name + t + "Selector";
                ageGroup.sel[t] = $("#" + sId);
                ageGroup.sel[t].change(function(){
                    THIS.action();
                });
            }
            ageGroup.app = this;
            ageGroup.get = getSelectorSettings;
            ageGroup.set = setSelectors;
            ageGroup.set();
            ageGroup.setRandom = setRandom;
            btnElt.attr("data-index", i);
            btnElt.click(btnClick);
            ageGroup.meanTd  = $("#" + name + "Mean");
            ageGroup.varTd   = $("#" + name + "Var");
            ageGroup.SaSiTd  = $("#" + name + "SaSi");
            ageGroup.GrandTd = $("#" + name + "Grand");
        }
        ageGroup = data[data.length - 1];
        var resetBtn = H.btn("Reset All", {id: "resetButton"});
        ageGroup.GrandTd.html(resetBtn);
        $("#resetButton").click(function(){
            F112.run();
        });
        this.action();
    },
    withBarAndIndex: function(letter, index){
        //return H.withIndex(H.overBar(H.italic(letter)), index);
        //return H.withIndex(H.overBar(letter), index);
        //return H.overlineSpan(H.withIndex(H.italic(letter), index));
        //return H.withIndex(H.overlineSpan(H.italic(letter)), index);
        if (navigator.userAgent.indexOf("Chrome") != -1){
            return H.withIndex(H.overlineSpan(letter), index);
        } else {
            return H.overlineSpan(H.withIndex(H.italic(letter), index));
        }
    },
    makeSelectsCustom: function(){
        var data = this.data;
        var times = this.times;
        for (var i=0; i<data.length; i++){
            var ageGroup = data[i];
             for (var j=0; j<times.length; j++){
                var id = ageGroup.name + j + "Selector";
                $("#" + id).customSelect();
             }
        }
        
    },
    xWithBarAndIndex: function(index){
        return this.withBarAndIndex("x", index);
    },
    action: function(){
        var data = this.data;
        function withIndex(letter, index){
            return H.withIndex(H.italic(letter), index);
        }
        function withIndexSquared(letter, index){
            return H.withIndex(H.italic(letter), index) + H.sup("2");
        }
        function nWithIndex(index){
            return withIndex("n", index);
        }
        function sWithIndexSquared(index){
            return withIndexSquared("s", index);
        }
        var grandTotal = 0;
        var grandSampleSize = 0;
        var ssw = 0;
        for (var i=0; i<data.length; i++){
            var familyIndex = i + 1;
            var ageGroup = data[i];
            var color = ageGroup.color3;
            var currentViolations = ageGroup.get();
            var mean = currentViolations.mean();
            var meanFo = "%5.2f".sprintf(mean);
            ageGroup.mean = mean;
            ageGroup.meanFo = meanFo;
            ageGroup.meanTd.html(this.xWithBarAndIndex(familyIndex) + " = " + meanFo);
            var variance = currentViolations.varianceE();
            var variFo = "%5.2f".sprintf(variance);
            ageGroup.variance = variance;
            ageGroup.variFo = variFo;
            ageGroup.varTd.html(sWithIndexSquared(familyIndex) + " = " + variFo);
            var sampleSize = ageGroup.sel.length;
            ageGroup.sampleSize = sampleSize;
            ageGroup.SaSiTd.html(nWithIndex(familyIndex) + " = " + sampleSize);
            grandTotal += currentViolations.sum();
            grandSampleSize += sampleSize;
            ssw += variance * (sampleSize-1);
        }
        this.ssw = ssw;
        var grandMean = grandTotal / grandSampleSize;
        var grandMeanFo = "%5.2f".sprintf(grandMean);
        this.grandMean = grandMean;
        this.grandMeanFo = grandMeanFo;
        var ssb = 0;
        for (var i=0; i<data.length; i++){
            var ageGroup = data[i];
            var diff = ageGroup.mean - grandMean;
            var sqDiff = diff * diff;
            ssb += (ageGroup.sampleSize * sqDiff);
        }
        this.ssb = ssb;
        this.ssTotal = ssb + ssw;
        this.dfb = this.data.length - 1;
        this.dfw = grandSampleSize - this.data.length;
        this.grandSampleSize = grandSampleSize;
        this.dfTotal = grandSampleSize - 1;
        this.msb = ssb / this.dfb;
        this.msw = ssw / this.dfw;
        this.fRatio = this.msb / this.msw;
        ageGroup = data[0];
        //var xDoubleBar = H.overlineSpan(H.overBar("x"));
        //ageGroup.GrandTd.html(xDoubleBar + " = " + grandMean);
        var itx = H.italic("x");
        itx = "x";
        var pad = (navigator.userAgent.indexOf("Chrome") != -1) ? 3 : 1;
        var thickness = (navigator.userAgent.indexOf("Chrome") != -1) ? 1 : 2;
        var xDoubleBarStyle = Style.toAtts({"border-top": thickness + "px solid " + this.grandMeanColor, "padding-top": pad + "px"});
        ageGroup.GrandTd.html(H.table00(H.tr(
            H.td(H.overlineSpan(itx), xDoubleBarStyle) +
            H.td(" = " + grandMeanFo, Style.toAtts({"padding-left": "5px"}))
        )));
        this.xDoubleBarStyle = xDoubleBarStyle;
        $("#summaryTableTd").html(this.makeSummaryTableHtml());
        function sq(x, y, xColor, yColor){
            return "(" + H.span(x, Style.toAtts({"color": xColor})) + "&ndash;" + H.span(y, Style.toAtts({"color": yColor})) + ")" + H.sup("2");
        }
        function wsq(pre, x, y, xColor, yColor){
            return H.span(pre + sq(x, y, xColor, yColor), {"class": "lineBreakDisabled"});
        }
        function wsq0(x, y, xColor, yColor){
            return wsq("", x, y, xColor, yColor);
        }
        var gmc = this.grandMeanColor;
        var gm = this.grandMeanFo.trim();
        var ssbDetails = this.data.map(function(item, index){
            var m = item.meanFo.trim();
            return wsq(item.sampleSize, m, gm, item.color3, gmc);
        }).join(" + ");
        function sswAux(grp){
            var color1 = "black";
            var color2 = grp.color3;
            var vals = grp.get();
            var m = grp.meanFo.trim();
            return vals.map(function(item, index){
                return wsq0(item, m, color1, color2);
            }).join(" + ");
        }
        function sstAux(grp){
            var color1 = "black";
            var color2 = gmc;
            var vals = grp.get();
            return vals.map(function(item, index){
                return wsq0(item, gm, color1, color2);
            }).join(" + ");
        }
        $("#ssbDetails").html(ssbDetails);
        $("#sswDetails").html(this.data.map(sswAux).join(" + "));
        $("#sstDetails").html(this.data.map(sstAux).join(" + "));
        this.repaint();
        this.repaintRight();
    },
    makeSummaryTableHtml: function(){
        var emptyTh = H.thLeft("", {"class": "row1"});
        var head1 = H.tr(emptyTh +
            H.th("Sums of", {"class": "lineBreakDisabled row1"}) + emptyTh +
            H.th("Mean Sum", {"class": "lineBreakDisabled row1"}) + emptyTh
        );
        function thr2(content){
            return H.th(content, {"class": "lineBreakDisabled row2"});
        }
        function thr2L(content){
            return H.thLeft(content, {"class": "lineBreakDisabled row2"});
        }
        function tdBody(content){
            return H.tdCenter(content, {"class": "body"});
        }
        var head2 = H.tr(thr2L("Source") + ["Squares", "df", "of Squares", "F-Ratio"].map(thr2).join(""));
        var ssbFo = "%5.2f".sprintf(this.ssb);
        this.ssbFo = ssbFo;
        var msbFo = "%5.2f".sprintf(this.msb);
        this.msbFo = msbFo;
        var fRatioFo = "%4.2f".sprintf(this.fRatio);
        this.fRatioFo = fRatioFo;
        var betweenGroupsRow = H.tr(
            H.td("Between Groups", {"class": "lineBreakDisabled body"}) +
            tdBody(ssbFo) + tdBody(this.dfb) + tdBody(msbFo) + tdBody(fRatioFo)
        );
        $("#ssbResult").html(ssbFo);
        var sswFo = "%5.2f".sprintf(this.ssw);
        this.sswFo = sswFo;
        var mswFo = "%5.2f".sprintf(this.msw);
        this.msbFo = msbFo;
        var withinGroupsRow = H.tr(
            H.td("Within Groups", {"class": "lineBreakDisabled body"}) +
            tdBody(sswFo) + tdBody(this.dfw) + tdBody(mswFo) + tdBody("")
        );
        $("#sswResult").html(sswFo);
        var ssTotalFo = "%5.2f".sprintf(this.ssTotal);
        this.ssTotalFo = ssTotalFo;
        var totalRow = H.tr(
            H.td("Total", {"class": "lineBreakDisabled body"}) +
            tdBody(ssTotalFo) + tdBody(this.dfTotal) + tdBody("") + tdBody("")
        );
        var k = this.data.length;
        var n = this.grandSampleSize;
        $("#sstResult").html(ssTotalFo);
        $("#dfbResult").html(k - 1);
        $("#dfbDetails").html(k + " &ndash; " + 1);
        $("#dftResult").html(n - 1);
        $("#dftDetails").html(n + " &ndash; " + 1);
        $("#dfwResult").html(n - k);
        $("#dfwDetails").html(n + " &ndash; " + k);
        $("#msbResult").html(msbFo);
        $("#mswResult").html(mswFo);
        $("#fRatioResult").html(fRatioFo);
        $("#msbDetails").html(H.frata(ssbFo, k-1))
        $("#mswDetails").html(H.frata(sswFo, n-k));
        $("#fRatioDetails").html(H.frata(msbFo, mswFo));
        return H.table00(head1 + head2 + betweenGroupsRow + withinGroupsRow + totalRow, {id: "summaryTable", "class": "fullWidth"});
    },
    repaint: function(){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var maxViolations = this.maxViolations;
        // yAxis
        var epsLo = 0.07;
        var epsHi = 0.04;
        var yMin = -epsLo * maxViolations;
        var yMax = (1 + epsHi) * maxViolations;
        var dfl = 62;   // distance of y axis from the left canvas edge
        var axisOptions = {
            min: yMin, max: yMax, axisMin: 0, axisMax: maxViolations,
            distanceFromLeft: dfl, labelLeftOfAxisWhenLeftGapGreaterThan: 0, minorStep: 1, majorStep: 2,
            axisLabel: this.yAxisLabel, labelFont: "bold 12pt Arial"
        };
        var temp = CANVAS.yAxis(ctx, axisOptions);
        var y0 = temp.trafo(0);
        var x0 = dfl;
        // xAxis
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(ctx.canvas.width, y0);
        ctx.stroke();
        var data = this.data;
        var h = 7;
        for (var i=0; i<data.length; i++){
            var ageGroup = data[i];
            var x = ageGroup.x;
            // marker on axis
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(x, y0 - h);
            ctx.lineTo(x, y0);
            ctx.stroke();
            // group label underneath marker
            ctx.textAlign = "center";
            var color = ageGroup.color3;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.fillText(ageGroup.displayName, x, y0 + 17)
            // dots
            var tw = ageGroup.get();
            ageGroup.violations = tw;
            ctx.fillStyle = color;
            for (var t=0; t<tw.length; t++){
                var y = temp.trafo(tw[t]);
                ctx.beginPath();
                ctx.arc(x, y, this.dotRadius, 0, 2*Math.PI);
                ctx.fill();
            }
            // mean line
            y = temp.trafo(ageGroup.mean);
            var x0 = x - this.meanLineLength/2;
            var x1 = x + this.meanLineLength/2;
            ctx.lineWidth = this.meanLineThickness;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
            ctx.stroke();
            // mean line text
            ctx.textAlign = "left";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = this.canvasFont;
            ctx.fillText(ageGroup.meanFo, x1 + 8, y + 5);
        }
        // grand mean line
        y = temp.trafo(this.grandMean);
        x0 = dfl;
        x1 = ctx.canvas.width;
        ctx.lineWidth = this.grandMeanLineThickness;
        ctx.strokeStyle = this.grandMeanLineColor;
        CANVAS.dashedLine(ctx, x0, y, x1, y, this.grandMeanDashing);
        // grand mean numerical
        this.grandMeanCanvasLabel.html(this.grandMeanFo);
        this.grandMeanCanvasLabel.css({"padding-top": y - 11, color: this.grandMeanColor, "font-weight": "bold"});
        // grand mean label
        ctx.font = this.grandMeanFont;
        ctx.textAlign = "left";
        ctx.fillStyle = this.grandMeanColor;
        ctx.fillText("Grand Mean", x0 + 10, y - 10);
    },
    repaintRight: function(){
        var ctx = this.rightCtx;
        CANVAS.erase(ctx);
        var xMin = -0.45;
        var xMax = 7.21; xAxisMax = 7.19;
        var yMin = -0.075;
        var yMax = 1.022;
        // draw fill
        var fpdf = this.fPDFcalc.getPDF(this.dfb, this.dfw);
        var plotOptions = {
            xMin: xMin, xMinPlot: this.fCrit, xMax: xMax, xMaxPlot: xAxisMax,
            yMin: yMin, yMinPlot: 0, yMax: yMax, yMaxPlot: 1,
            step: 0.005, color: this.underFPDFfillColor
        };
        this.canvasFillPlot = new CanvasPlot(ctx, fpdf, plotOptions);
        this.canvasFillPlot.fillPlot();
        // draw border
        plotOptions = {
            xMin: xMin, xMinPlot: 0, xMax: xMax, xMaxPlot: xAxisMax,
            yMin: yMin, yMinPlot: 0, yMax: yMax, yMaxPlot: 1,
            step: 0.005, color: "blue"
        };
        this.canvasPlot = new CanvasPlot(ctx, fpdf, plotOptions);
        this.canvasPlot.plot();
        // draw dot
        var dotX = this.canvasPlot.xTrafo(this.fRatio);
        var dotY = this.canvasPlot.yTrafo(0);
        ctx.fillStyle = this.dotColor;
        ctx.beginPath();
        ctx.arc(dotX, dotY, this.dotRadius, 0, 2*Math.PI);
        ctx.fill();
        // draw axis
        CANVAS.xyAxis(ctx,
            { min: xMin, axisMin: 0, max: xMax, axisMax: xAxisMax, axisLabel: "" },
            { min: yMin, axisMin: 0, max: yMax, axisMax: 1, axisLabel: "", narrowness: 0.6 },
            { xValueOfYaxis : 0, allYlabels: true, allXlabels: true}
        );
        // critical marker
        var x = this.canvasPlot.xTrafo(this.fCrit);
        var y = dotY;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        var y1 = y - 0.33 * this.canvasHeight;
        ctx.lineTo(x, y1);
        ctx.stroke();
        // critical marker text
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        var fCritFo = "%4.2f".sprintf(this.fCrit);
        //var w = ctx.measureText("foo").width;
        ctx.fillText(fCritFo, x, y1 - 5);
        // proclaim the decision to the world
        var rejectNull = (this.fRatio > this.fCrit);
        var infoString = rejectNull ? "" : "Fail to";
        infoString += " Reject the Null";
        var fr = $("#finalResult");
        fr.html(infoString);
        fr.attr("class", (rejectNull ? "r" : "failR")  + "eject");
    }
};
/*******************************************************************************************************
 Table 133 (chi squared test)
*******************************************************************************************************/
var T133 = {
    //summaryTableLeft: 520,
    //summaryTableTop: 132,
    paramValueMinWidth: 50,
    totalWidth: 1180,
    expectedFormat: "%10.2f",
    percentFormat: "%5.2f",
    chiSquaredFormat: "%5.2f",
    phiFormat: "%5.2f",
    chiCritFormat: "%6.3f",
    alphaFormat: "%4.2f",
    min: 0,
    max: 280,
    // test
    //initialValues: [[277, 39,1], [98, 27,1], [277, 39,1], [98, 27,1]],
    //colHeads: ["Male", "Female", "x"],
    //rowHeads: ["Friend", "Neighbour", "a", "b"],
    //columnColors: ["blue", "red", "green"],    
    initialValues: [[277, 39], [98, 27]],
    colHeads: ["Male", "Female"],
    rowHeads: ["Friend", "Neighbour"],
    columnColors: ["blue", "red"],
    values: null,
    rowTotals: null,
    colTotals: null,
    totalTotal: null,
    headForAllCols: "Gender",
    headForAllRows: ["Relationship", "of Accused"],
    alphaButtonValues: [0.01, 0.05, 0.1],
    alphaButtonCaptions: [".01", ".05", ".10"],
    initiallyChosenAlphaIndex: 1,
    chosenAlphaIndex: 1,
    alphaLookup: ["onePercent", "fivePercent", "tenPercent"],
    alphaTableButtonGap: 0,
    sliderTableHtml: function(rowHeads, colHeads, headForAllCols, headForAllRows){
        var spacer = H.td("", {"class": "spacer"});
        var widthRatio = (100/colHeads.length) + "%";
        var row1 = H.tr(
            H.th(headForAllRows[0], {"class": "sliderTableTopLeft"}) +
            H.th(headForAllCols, {colspan: colHeads.length, "class": "sliderTableAllColsHead"})
        );
        var row2 = H.tr(H.th(headForAllRows[1], {"class": "sliderTableLowestHeaderLeft"}) + colHeads.map(function(colHead){
            return H.th(colHead, {"class": "sliderTableLowestHeader"});
        }).join(""));
        var sliders = this.sliders;
        function makeRow(rowIndex){
            var sli = sliders[rowIndex];
            return H.tr(
                H.th(rowHeads[rowIndex]) + sli.map(function(item, index){
                    return H.td(
                        H.table00(
                            H.tr(
                                spacer + H.td(item.html, {"class": "fullWidth sliderInnerTd"}) + spacer
                            )
                            , {"class": "fullWidth", id: "sli" + rowIndex + "tbl" + index, "class": "sliderTable"}
                        )
                        , {width: widthRatio, id: "sli" + rowIndex + "td" + index, "class": "sliderOuterTd"}
                    );
                }).join("")
            );
        }
        return H.table00(row1 + row2 +
            sliders.map(function(item, index){
                return makeRow(index)
            }).join("")
            , {"class": "fullWidth", id: "sliTop"}
        );
    },
    sliderCallback: function(value){
        var r = this.rowIndex;
        var c = this.colIndex;
        var oldValue = T133.values[r][c];
        var difference = value - oldValue;
        T133.colTotals[c] += difference;
        T133.rowTotals[r] += difference;
        T133.totalTotal += difference;
        T133.values[r][c] = value;
        T133.update();
        //$("#summaryTable").offset({top: T133.summaryTableTop, left: T133.summaryTableLeft});
        //$("#paramsAndValuesTable td.paramValue").width(T133.paramValueMinWidth);
    },
    upperHtml: function(rowHeads, colHeads, headForAllCols, headForAllRows){
        var resetBtn = H.btn("Reset All", {id: "resetBtn"});
        return H.table(
            H.tr(
                H.td(this.sliderTableHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {"class": "fullWidth"}) +
                H.td(resetBtn, {id: "resetTd"})
            )
            , {id: "upperTable", "class": "fullWidth"}
        );
    },
    contingencyTableHtml: function(rowHeads, colHeads, headForAllCols, headForAllRows){
        var row1 = H.tr(
            H.th(headForAllRows[0], {"class": "contingencyTableTopLeft borderRight"}) +
            H.th(headForAllCols, {colspan: colHeads.length, "class": "contingencyTableAllColsHead"}) +
            H.th("", {"class": "borderLeft"}) +
            H.th("")
        );
        var row2 = H.tr(
            H.th(headForAllRows[1], {"class": "contingencyTableLowestHeaderLeft borderRight borderBottom"}) +
            colHeads.map(function(colHead){
                return H.th(colHead, {"class": "contingencyTableLowestHeader borderBottom"});
            }).join("") +
            H.th("Total", {id: "contingencyTableRowTotalsHeader", "class": "borderBottom borderLeft"}) +
            H.th("Row Percent", {id: "contingencyTableRowPercentHeader", "class": "borderBottom"})
        );
        var sliders = this.sliders;
        function makeRow(rowIndex){
            var sli = sliders[rowIndex];
            return H.tr(
                H.thLeft(rowHeads[rowIndex], {"class": "contingencyTableRowHeader borderRight"}) + sli.map(function(item, index){
                    var sliderId = item.id;
                    var id1 = sliderId + "Factual";
                    var id2 = sliderId + "Expected";
                    return H.tdCenter(
                        H.table00(
                            H.tr(H.tdCenter(id1, {id: id1})) +
                            H.tr(H.tdCenter(id2, {id: id2}))
                            , {id: "cell" + rowIndex + "tbl" + index, "class": "contingencyTable"}
                        )
                        , {id: "cell" + rowIndex + "td" + index, "class": "contingencyOuterTd"}
                    );
                }).join("") +
                H.tdCenter("", {id: "rowTotal" + rowIndex, "class": "borderLeft"}) +
                H.tdCenter("", {id: "rowPercent" + rowIndex, "class": ""})
            );
        }
        var colors = this.columnColors;
        var totalsRow = H.tr(
            H.thLeft("Total", {id: "contingencyTableColTotalsHeader", "class": "borderRight borderTop"}) +
            UTIL.range(0, colHeads.length - 1).map(function(index){
                return H.tdCenter("", {id: "colTotal" + index, "class": "borderTop", "style" : "color: " + colors[index] + ";"})
            }).join("") +
            H.tdCenter("", {id: "totalTotal", "class": "borderLeft borderTop"}) +
            H.tdCenter("100%", {id: "hundredPercentRowSum", "class": "borderTop"})
        )
        var columnPercentRow = H.tr(
            H.thLeft("Column Percent", {id: "contingencyTableColPercentHeader", "class": "borderRight paddingTop"}) +
            UTIL.range(0, colHeads.length - 1).map(function(index){
                return H.tdCenter("", {id: "colPercent" + index, "class": "paddingTop"})
            }).join("") +
            H.tdCenter("100%", {id: "hundredPercentColSum", "class": "borderLeft paddingTop"}) +
            H.tdCenter("", {"class": "paddingTop"})
        );
        var ct = H.table00(row1 + row2 +
            sliders.map(function(item, index){
                return makeRow(index)
            }).join("") +
            totalsRow +
            columnPercentRow
            , {id: "contingencyTable"}
        );
        return H.table(
            H.tr(H.thCenter(Options.T133.contingencyTableTitle, {"class": "contingencyTableTitle"})) +
            H.trtd(ct),
            {id: "contingencyTableWithHeading"}
        );
    },
    makeAlphaButtonHandler: function(index){
        return function(){
            if (T133.chosenAlphaIndex == index){
                return;
            }
            T133.chosenAlphaIndex = index;
            T133.update();
            var elt = $(this);
            elt.parents("table").first().find("button").removeClass("bold");
            elt.parents("table").first().find("button").removeClass("chosen");
            elt.addClass("bold");
            elt.addClass("chosen");
        }
    },
    alphaButtonsTableHtml: function(){
        var th = H.thCenter("Alpha Value:", {colspan: this.alphaButtonValues.length});
        var THIS = this;
        var alphaTr = H.tr(this.alphaButtonValues.map(function(alpha, index){
                return H.td(H.btn(THIS.alphaButtonCaptions[index], {id: "alphaButton" + index}));
            }).join("")
        );
        return H.table00(H.tr(th) + alphaTr, {id: "alphaBtnTable"});
    },
    summaryTableHtml: function(){
        var hypoTable = H.table(
            H.tr(H.thCenter("Hypothesis Test", {"class": "hyothesisTest"})) +
            H.tr(H.tdCenter("H" + H.sub("0") + ": Independent", {"class": "bold"})) +
            H.tr(H.tdCenter("H" + H.sub("A") + ": Dependent", {"class": "bold"}))
            , {id: "hypoTable"}
        );
        var td1a = H.td(this.alphaButtonsTableHtml(), {id: "alphaButtonTableParentTd"});
        var td1b = H.td(hypoTable, {id: "hypoButtonTableParentTd"});
        var tr1 = H.tr(td1a + td1b, {"class": "topRow"});
        
        function aux(paramName, id){
            return H.tr(
                H.tdRight(paramName, {"class": "paramName"}) +
                H.tdCenter("", {id: id, "class": "paramValue"})
                , {"class": "body"}
            );
        }
        var row1 = aux("degrees of freedom", "dfValue");
        var row2 = aux(M.mathInlineRight(M.row(M._squared(M.chi))), "chi2Value");
        var row3 = aux(M.mathInlineRight(M.i("&Phi;")), "phiValue");
        var row4 = H.tr(
            H.tdRight(
                M.mathInlineRight(M.row(
                    M._sub(M._squared(M.chi), M.row(M._withParens(M.alpha + M.equals + M.n(0, {id: "resultsAlpha"}))))
                ))
                , {"class": "paramName", id: "chi2CritLbl"}
            ) +
            H.tdCenter("", {id: "chi2Critical", "class": "paramValue"})
            , {"class": "body"}
        );
        var resuTd = H.td(H.div("", {id: "resultDiv"}), {id: "resultTd", "class": "paramValue"});
        var row5 = H.tr(H.tdRight("Decision", {"class": "paramName"}) + resuTd);
        return H.table00(tr1 + row1 + row2 + row3 + row4 + row5, {id: "summaryTable"});
    },
    chiSquaredCalcHtml: function(){
        var chi2 = M._squared(M.chi);
        var e = M._squaredWithParens(M.i("O") + M.minus + M.i("E"));
        var d = M.i("E");
        var frac = M._frac(e, d);
        var math1 = M.mathBlockLeft(M.row(chi2));
        var math2 = M.mathBlockLeft(M.row(M.equals + M.sum + frac));
        //var math1 = M.mathInlineLeft(M.row(chi2));
        //var math2 = M.mathInlineLeft(M.row(M.equals + M.sum + frac));
        //var td1 = H.td(math1, {style: "font-weight:bold; font-size: 20px;"});
        var td1 = H.td(math1);
        var td2 = H.td(math2);
        var result = td1 + td2;
        var colors = this.columnColors;
        function makeTerm(rowIndex, colIndex){
            return H.td("", {id: "chi" + rowIndex + "x" + colIndex});
        }
        for (var rowIndex=0; rowIndex<this.rowHeads.length; rowIndex++){
            for (var colIndex=0; colIndex<this.colHeads.length; colIndex++){
                result += makeTerm(rowIndex, colIndex);
            }
        }
        result += H.td("=?", {id: "chi2SquaredResult", "class": "bold"});
        return H.table(H.tr(result), {id: "chiSquaredTable"});
    },
    rightCalcHtml: function(){
        var tr1 = H.tr(H.td(this.chiSquaredCalcHtml()));
        function aux(n){
            return "(" + n + "&ndash; 1)";
        }
        var df = (this.rowHeads.length - 1) * (this.colHeads.length - 1); 
        var tr2 = H.tr(H.td("df = " + aux("R") + aux("C") + " = " + aux(this.rowHeads.length) + aux(this.colHeads.length) + " = " + df
            , {style: "font-style: italic; font-weight: bold;"}));
        var tr3 = H.tr(H.tdLeft("", {id: "phi"}));
        return H.table(tr1 + tr2 + tr3, {id: "rightCalcsTable"});
    },
    calculationDetailTableHtml: function(rowHeads, colHeads, headForAllCols, headForAllRows){
        var leftTd = H.td(this.expectedFreqCalcHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {id: "expectedCalcTableParentTd"});
        var rightTd = H.td(this.rightCalcHtml(), {id: "rightCalcsTableParentTd"});
        return H.table(
            H.tr(
                leftTd + rightTd
            )
            , {id: "calcsTable"}
        );
    },
    expectedFreqCalcHtml: function(rowHeads, colHeads, headForAllCols, headForAllRows){
        var tableContent = "";
        for (var colIndex=0; colIndex<colHeads.length; colIndex++){
            var ch = colHeads[colIndex];
            for (var rowIndex=0; rowIndex<rowHeads.length; rowIndex++){
                var rh = rowHeads[rowIndex];
                var label = ch + " and " + rh + ":";
                var idPrefix = "r" + rowIndex + "c" + colIndex;
                var idCol = idPrefix + "Col";
                var idRow = idPrefix + "Row";
                var idTotal = idPrefix + "Total";
                var idResult = idPrefix + "Result";
                function aux(id, color){
                    if (color){
                        return H.span("", {id: id, style: "color: " + color + ";"});
                    } else {
                        return H.span("", {id: id});
                    }
                }
                var color = this.columnColors[colIndex];
                var span1 = aux(idCol, color);
                var span2 = aux(idRow);
                var span3 = aux(idTotal);
                var span4 = aux(idResult, color);
                var td1 = H.tdLeft(label);
                var td2 = H.tdRight(span1 + " &times; " + span2 + " &divide; " + span3 + " = " + span4);
                var tr = H.tr(td1 + td2);
                tableContent += tr;
            }
        }
        var th1 = H.th("Expected Frequencies", {"class": "borderTop borderBottom0 lineBreakDisabled"});
        var row = M._sub(M.i("Row"), M.i("i"));
        var col = M._sub(M.i("Column"), M.i("j"));
        var enumerator = row + M.cross + col;
        var denominator = M.i("N");
        var rhs = M._frac(enumerator, denominator);
        var lhs = M._sub(M.i("E"), M.i("i,j"));
        var eqn = M.row(lhs + M.equals + rhs); 
        var th2 = H.thRight(M.mathBlockCenter(eqn), {style: "min-width: 188px", "class": "borderTop borderBottom0"});
        var headerRow = H.tr(th1 + th2);
        return H.table(headerRow + tableContent, {id: "expectedCalcTable", "class": "borderBottom", cellspacing: 0});
    },
    update: function(){
        var chiSquared = 0;
        for (var colIndex=0; colIndex<this.colHeads.length; colIndex++){
            for (var rowIndex=0; rowIndex<this.rowHeads.length; rowIndex++){
                // update expected frequencies table
                var idPrefix = "r" + rowIndex + "c" + colIndex;
                var idCol = idPrefix + "Col";
                var idRow = idPrefix + "Row";
                var idTotal = idPrefix + "Total";
                var idResult = idPrefix + "Result";
                var colElt = $("#" + idCol);
                var rowElt = $("#" + idRow);
                var totalElt = $("#" + idTotal);
                var resultElt = $("#" + idResult);
                var ct = this.colTotals[colIndex];
                var rt = this.rowTotals[rowIndex];
                colElt.text(ct);
                rowElt.text(rt);
                totalElt.text(this.totalTotal);
                var expected = ct * rt / this.totalTotal;
                var expectedFormatted = this.expectedFormat.sprintf(expected).trim();
                resultElt.text(expectedFormatted);
                // update contingency table
                var observation = this.values[rowIndex][colIndex];
                var slider = this.sliders[rowIndex][colIndex];
                slider.expectedElt.text("( " + expectedFormatted + " )");
                slider.factualElt.text(observation);
                slider.rowTotalElt.text(rt);
                slider.colTotalElt.text(ct);
                var rowPercent = rt / this.totalTotal; 
                var rowPercentFormatted = this.percentFormat.sprintf(rowPercent * 100) + "%";
                slider.rowPercentElt.text(rowPercentFormatted);
                var colPercent = ct / this.totalTotal;
                var colPercentFormatted = this.percentFormat.sprintf(colPercent * 100) + "%";
                slider.colPercentElt.text(colPercentFormatted);
                $("#totalTotal").text(this.totalTotal);
                // update chi2 formula table
                var elt = $("#chi" + rowIndex + "x" + colIndex);
                var sty = "color: " + this.columnColors[colIndex] + ";";
                var e = M._squaredWithParens(
                    M.n(observation) + M.minus +
                    M.n(expectedFormatted, {style: sty})
                );
                var d = M.n(expectedFormatted, {style: sty});
                var frac = M._frac(e, d);
                var sep = (colIndex==0 && rowIndex==0) ? M.equals : M.plus;
                var math = M.mathBlockLeft(M.row(sep + frac));
                elt.html(math);
                var diff = observation - expected;
                var addMe = diff*diff / expected;
                chiSquared += addMe;
            }
            var chiSquaredFormatted = isNaN(chiSquared) ? Options.T133.displayZeroDividedByZeroAs : this.chiSquaredFormat.sprintf(chiSquared).trim();
            $("#chi2SquaredResult").text(" = " + chiSquaredFormatted);
            this.chiSquared = chiSquared;
            // update phi
            var phiString = M.i("&Phi;"); 
            var chi2 = M._squared(M.chi);
            var root1 = M.sqrt(M._frac(chi2, M.i("N")));
            var root2 = M.sqrt(M._frac(M.n(chiSquaredFormatted), M.n(this.totalTotal)));
            var phi = Math.sqrt(chiSquared / this.totalTotal);
            var phiFormatted = isNaN(chiSquared) ? Options.T133.displayZeroDividedByZeroAs : this.phiFormat.sprintf(phi).trim();
            var result = M.n(phiFormatted);
            var formula = [phiString, root1, root2, result].join(" " + M.equals + " ");
            var math = M.mathBlockLeft(M.row(formula));
            $("#phi").html(math);
            M.render();
            $("#phi .MathJax_Display").css("text-align", "left");
            // update summary table
            var df = (this.rowHeads.length - 1) * (this.colHeads.length - 1);
            $("#dfValue").text(df);
            $("#chi2Value").text(chiSquaredFormatted);
            $("#phiValue").text(phiFormatted);
            
            var chiCrit = chiCritical[this.alphaLookup[this.chosenAlphaIndex]][df];
            var chiCritFormatted = this.chiCritFormat.sprintf(chiCrit).trim();
            $("#chi2Critical").text(chiCritFormatted);
            var alpha = this.alphaButtonValues[this.chosenAlphaIndex];
            var alphaFormatted = this.alphaFormat.sprintf(alpha).trim();
            $("#resultsAlpha").text(alphaFormatted);

            var rejectTheNull = ( chiSquared > chiCrit);
            var resultDiv = $("#resultDiv");
            var resultHtml;
            if (rejectTheNull){
                resultHtml = Figure121.rejectNullHtml();
            } else {
                resultHtml = Figure121.failToRejectNullHtml();
            }
            resultDiv.html(resultHtml);
        }
    },
    lowerHtml: function(rowHeads, colHeads, headForAllCols, headForAllRows){
        return H.table(
            H.tr(
                H.td(this.contingencyTableHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {id: "contingencyTableTd"}) +
                H.td(this.summaryTableHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {id: "summaryTableTd"})
            ) +
            H.tr("", {"class": "spaceBelowContingencyTable"}) +
            H.tr(
                H.td(this.calculationDetailTableHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {colspan: 2})
            )
            , {id: "lowerTable", "class": "fullWidth"}
        );
    },
    run: function(){
        var colHeads = this.colHeads;
        var rowHeads = this.rowHeads;
        var headForAllCols = this.headForAllCols;
        var headForAllRows = this.headForAllRows;
        var min = this.min;
        var max = this.max;
        var initialValues = this.initialValues;
        var values = [];
        // make the slider objects, calculate totals, and clone values array
        var sliders = [];
        var rowTotals = UTIL.zeros(rowHeads.length);
        var colTotals = UTIL.zeros(colHeads.length);
        var total = 0;
        for (var rowIndex=0; rowIndex<rowHeads.length; rowIndex++){
            var temp = [];
            var vv = [];
            var rowHead = rowHeads[rowIndex];
            for (var colIndex=0; colIndex<colHeads.length; colIndex++){
                var v = initialValues[rowIndex][colIndex];
                rowTotals[rowIndex] += v;
                colTotals[colIndex] += v;
                total += v;
                vv.push(v);
                var colHead = colHeads[colIndex];
                var id = "row" + rowIndex + "col" + colIndex + rowHead + colHead;
                var slider = new Slider({
                    min: min, max: max,
                    step: 1, value: v, id: id,
                    callback: this.sliderCallback
                });
                temp.push(slider);
            }
            sliders.push(temp);
            values.push(vv);
        }
        this.values = values;
        this.rowTotals = rowTotals;
        this.colTotals = colTotals;
        this.totalTotal = total;
        this.sliders = sliders;
        var html = H.table(
            H.trtd(this.upperHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {"class": "fullWidth"}) +
            H.tr("", {"class": "spaceBelowSliders"}) +
            H.trtd(this.lowerHtml(rowHeads, colHeads, headForAllCols, headForAllRows), {"class": "fullWidth"})
            , {id: "T133", width: this.totalWidth}
        );
        gUniverseElt.html(html);
        // init the sliders
        for (var rowIndex=0; rowIndex<rowHeads.length; rowIndex++){
            for (var colIndex=0; colIndex<colHeads.length; colIndex++){
                var slider = sliders[rowIndex][colIndex];
                slider.init();
                var sliderId = slider.id;
                var id1 = sliderId + "Factual";
                var id2 = sliderId + "Expected";
                slider.factualElt = $("#" + id1);
                slider.expectedElt = $("#" + id2);
                slider.rowIndex = rowIndex;
                slider.colIndex = colIndex;
                slider.rowTotalElt = $("#rowTotal" + rowIndex);
                slider.colTotalElt = $("#colTotal" + colIndex);
                slider.rowPercentElt = $("#rowPercent" + rowIndex);
                slider.colPercentElt = $("#colPercent" + colIndex);
            }
        }
        window.setTimeout(function(){
            T133.update();
            T133.update();
            $("#phi .MathJax_Display").css("text-align", "left");
            $("#phi>math").css("text-align", "left");
        }, 400);
        $("#alphaButton" + this.chosenAlphaIndex).addClass("bold");
        $("#alphaButton" + this.chosenAlphaIndex).addClass("chosen");
        //hookup alpha button handlers
        for (var i=0; i<this.alphaButtonValues.length; i++){
            var btnElt = $("#alphaButton" + i);
            btnElt.click(this.makeAlphaButtonHandler(i));
        }
        $("#resetBtn").click(function(){
            T133.chosenAlphaIndex = T133.initiallyChosenAlphaIndex;
            T133.run();
        });
        if (Options.T133.chiSquaredFormulaNumberOfRows > 1){
            changeNumRows2("chiSquaredTable", Options.T133.chiSquaredFormulaNumberOfRows);
        }
        if (navigator.userAgent.indexOf("Firefox") == -1){
            $("table#T133").css("min-width", 1333);
            $("table#T133").css("width", 1333);
            $("table#T133").attr("width", 1333);
            if (navigator.userAgent.indexOf(".NET") == -1){
                $("table#T133").css("min-width", 1430);
                $("table#T133").css("width", 1430);
                $("table#T133").attr("width", 1430);
            }
        }
        //window.setTimeout(function(){ $("#summaryTable").offset({top: T133.summaryTableTop, left: T133.summaryTableLeft}); }, 200);
        //window.setTimeout(function(){ $("#summaryTable").offset({top: T133.summaryTableTop, left: T133.summaryTableLeft}); }, 600);
        this.update();
    }
};
/*******************************************************************************************************
 Figure48 (union and intersection)
*******************************************************************************************************/
var Figure48 = {
    canvasWidth : Options.Figure48.canvasWidth,
    canvasHeight : Options.Figure48.canvasHeight,
    canvasId : "theCanvas",
    canvasElt : null,
    ctx : null,
    paSlider : null,
    pbSlider : null,
    overlapSlider : null,
    sliderTableId : "sliderTable",
    sliderTableElt : null,
    callbackA1: function(value){ Figure48.callbackA(value); },
    callbackB1: function(value){ Figure48.callbackB(value); },
    updateGraphics1: function(value){ Figure48.updateGraphics(value); },
    callbackA: function(value){
        var pb = this.pbSlider.get();
        if (pb > 1 - value){
            this.pbSlider.set(1 - value);
        }
        this.updateGraphics();
    },
    callbackB: function(value){
        var pa = this.paSlider.get();
        if (pa > 1 - value){
            this.paSlider.set(1 - value);
        }
        this.updateGraphics();
    },
    calcArea: function (r1, r2, d){
        // r1, r2 = radii of two circles
        // d = distance of the centers of the two circles
        // result = area of the intersection of the circles
        var r1sq = r1 * r1; 
        var r2sq = r2 * r2;
        var delta = (r1sq - r2sq)/d;
        var d1 = 0.5*(d + delta);
        var d2 = 0.5*(d - delta);
        var alpha1 = 2 * Math.acos(d1/r1);
        var alpha2 = 2 * Math.acos(d2/r2);
        var sin1 = Math.sin(alpha1);
        var sin2 = Math.sin(alpha2);
        var A1 = 0.5 * r1sq * (alpha1 - sin1);
        var A2 = 0.5 * r2sq * (alpha2 - sin2);
        return A1 + A2;
    },
    updateGraphics: function(value){
        var ctx = this.ctx;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var font1 = Options.Figure48.lowerCanvasFont;
        var pa = this.paSlider.get();
        var pb = this.pbSlider.get();
        var overlap = this.overlapSlider.get();
        //console.log("pa = " + pa + " pb = " + pb+ " overlap = " + overlap);
        var maxOverlap = Math.min(pa, pb);
        var pIntersection, disjoint;
        if (overlap <= 0){
            disjoint = true;
            pIntersection = 0;
        } else {
            disjoint = false;
            pIntersection = overlap * maxOverlap;
        }
        var pUnion = pa + pb - pIntersection;
        // upper text
        var text1 = "P(A or B) = P(A) + P(B) - P(A and B)";
        var format = "%4.2f";
        var paString = format.sprintf(pa);
        var pbString = format.sprintf(pb);
        var pIntersectionString = format.sprintf(pIntersection);
        var pUnionString = format.sprintf(pUnion);
        var text2 = pUnionString + " = " + paString + " + " + pbString + " - " + pIntersectionString;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = font1;
        var halfWidth = canvasWidth/2;
        halfHeight = canvasHeight/2;
        ctx.fillText(text1, halfWidth, 90);
        ctx.fillText(text2, halfWidth, 120);
        
        // main part (circles)
        var r0 = 130;
        var ra = r0 * Math.sqrt(pa/0.5);
        var rb = r0 * Math.sqrt(pb/0.5);
        var areaA = Math.PI * ra * ra;
        var areaB = Math.PI * rb * rb;
        var maxIntersectionArea = Math.min(areaA, areaB);
        var d;
        var dMin = Math.abs(ra - rb);
        var dMax = ra + rb;
        var lowerText;
        if (disjoint){
            lowerText = "A and B are Mutually Exclusive";
            d = (1 - overlap) * dMax;
        } else {
            lowerText = "A and B are Non-Mutually Exclusive";
            // calculate distance between two circles, such that the intersection area will be suitable
            var dSpread = dMax - dMin;
            var step = 0.25 * dSpread;
            d = 0.5 * (dMax + dMin);
            var targetArea = overlap * maxIntersectionArea;
            while (true){
                var area = this.calcArea(ra, rb, d);
                if (area > targetArea){
                    d += step;
                } else {
                    d -= step;
                }
                if (Math.abs(area - targetArea) < 0.001){
                    break;
                }
                step *= 0.5;
            }
        }
        //$("#debug").html(d);
        var rDiff = ra - rb;
        var aCenterX = halfWidth - 0.5 * (d + rDiff);
        var bCenterX = halfWidth + 0.5 * (d - rDiff);
        var centerY = halfHeight;
        var colorA = Options.Figure48.colorA;
        var colorB = Options.Figure48.colorB;
        // draw the circles
        ctx.fillStyle = colorA;
        ctx.beginPath();
        ctx.arc(aCenterX, centerY, ra, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = colorB;
        ctx.beginPath();
        ctx.arc(bCenterX, centerY, rb, 0, 2 * Math.PI, false);
        ctx.fill();
        // text within the circles
        ctx.font = Options.Figure48.papbCanvasFont;
        var aTextX_inside, bTextX_inside;
        var overlap1 = Math.max(overlap, 0);
        var txtInsideFactor = (1-overlap1) * 0.6 + overlap1 * 0.2;
        var txtInsideMin = 37;
        var txtMinInsideA = Math.max(txtInsideMin, txtInsideFactor * ra);
        var txtMinInsideB = Math.max(txtInsideMin, txtInsideFactor * rb);
        aTextX_inside = aCenterX - ra + txtMinInsideA;
        bTextX_inside = bCenterX + rb - txtMinInsideB;
        var aTextX_outside = aCenterX - ra - 30;
        var bTextX_outside = bCenterX + rb + 30;
        var minUsedSpace = 22;
        var paTextInside = (aTextX_outside <= minUsedSpace);
        var pbTextInside = (bTextX_outside >= canvasWidth - minUsedSpace);
        if (paTextInside){
            ctx.fillStyle = "white";
            ctx.fillText("P(A)", aTextX_inside, centerY - 10);
            ctx.fillText(paString, aTextX_inside, centerY + 35);
        } else {
            ctx.fillStyle = Options.Figure48.colorPA;
            ctx.fillText("P(A)", aTextX_outside, centerY - 10);
            ctx.fillText(paString, aTextX_outside, centerY + 35);
        }
        if (pbTextInside){
            ctx.fillStyle = "white";
            ctx.fillText("P(B)", bTextX_inside, centerY - 10);
            ctx.fillText(pbString, bTextX_inside, centerY + 35);
        } else {
            ctx.fillStyle = Options.Figure48.colorPB;
            ctx.fillText("P(B)", bTextX_outside, centerY - 10);
            ctx.fillText(pbString, bTextX_outside, centerY + 35);
        }
        // arrow
        var arrowHeadY = halfHeight + 40;
        var arrowLength = 130;
        var arrowRootY = arrowHeadY + arrowLength;
        var arrowHeadLength = 15;
        var arrowHeadThickness = 8;
        CANVAS.upArrow(ctx, halfWidth, arrowHeadY, arrowRootY, arrowHeadLength, arrowHeadThickness);
        // text below arrow
        ctx.font = font1;
        ctx.fillText(pIntersectionString, halfWidth, arrowRootY + 19);
        ctx.fillStyle = Options.Figure48.mutuallyExColor;
        ctx.fillText(lowerText, halfWidth, arrowRootY + 50);
    },
    makeSliders: function(){
        this.paSlider = new Slider({min: 0.2, max: 0.6, value: 0.5, id: "paSlider", callback: this.callbackA1});
        this.pbSlider = new Slider({min: 0.2, max: 0.6, value: 0.4, id: "pbSlider", callback: this.callbackB1});
        this.overlapSlider = new Slider({min: -0.11, max: 1, id: "overlapSlider", callback: this.updateGraphics1});
        function sliderRow(label, sliderDiv){
            return HtmlGen.tr(
                HtmlGen.td(HtmlGen.span(label, {"class": "sliderLabel lineBreakDisabled"})) +
                HtmlGen.td("", {"class": "spacer"}) +
                HtmlGen.td(sliderDiv, {"class": "fullWidth"}) +
                HtmlGen.td("", {"class": "spacer"})
            );
        }
        return HtmlGen.table(
            sliderRow("P(A)", this.paSlider.html) +
            sliderRow("P(B)", this.pbSlider.html) +
            sliderRow("Overlap", this.overlapSlider.html)
            , {"class": "fullWidth", id: this.sliderTableId}
        );
    },
    run: function(){
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var canvasId = this.canvasId;
        var canvHtml = HtmlGen.canvas({width: canvasWidth, height: canvasHeight, id: canvasId});
        var sliders = this.makeSliders();
        gUniverseElt.html(HtmlGen.table(
            HtmlGen.trtd(sliders) +
            HtmlGen.trtd(canvHtml)
        ));
        this.canvasElt = $("#" + canvasId); 
        this.ctx = this.canvasElt[0].getContext('2d');
        if (!this.ctx){
            alert('you have to use a newer browser to view this page');
            return;
        }
        //
        this.paSlider.init();
        this.pbSlider.init();
        this.overlapSlider.init();
        this.sliderTableElt = $("#" + this.sliderTableId);
        this.paSlider.adjustTableCss(this.sliderTableElt);
        this.updateGraphics();
        
    }
};
