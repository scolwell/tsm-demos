// Options.js
Options = {
    removeGreyBackgroundInSliderTables: true,
    F111 : {
        conservativeColor: "#9592d8",
        conservativeTextColor: "#00f",
        liberalColor: "#e1928c",
        liberalTextColor: "#f00",
        ndpColor: "#e1b88c",
        ndpTextColor: "#ff8000"
    },
    Figure121: {
        errorMsg: "This correlation demonstration requires a minimum of three data points.",
    },
    RegressEx : {
        youNeedGovernmentalPermissionToWipeYourBehind: true,
        canvasWidth: 610,
        canvasHeight: 410
    },
    Figure222 : {
        hideValuesTables: false,        // the obsolete table directly under the boxplots
        hideCalculationDetails: false,  // the 6 framed calculation details of the quartiles
        backgroundColor: "white",
        minimumAllowedNumberOfTextMessages: 0,   // prevent user from setting a negative number of text messages with the handles
        maximumAllowedNumberOfTextMessages: 100,
        canvasWidth: 800,
        canvasHeight: 500,
        // the following 7 values all are scaled to a canvas width of 1.
        // I.e., for example, if the canvas is 600px wide, boxPlotPositions[0] = 0.4
        // means that the boxPlot of School A is centered at 0.4 * 600 = 240 px from the left edge
        yAxisPosition: 0.1,
        boxPlotPositions: [0.4, 0.75],
        controlPositions: [0.25, 0.9],
        barWidthPortion: 0.05,    // the min and max markers of the boxplot have that scaled width
        boxWidthPortion: 0.155,
        lineWidth: 2,
        boxColor: "#a50000",
        canvasFont: "14pt Arial",         // used for "School A", "School B", "Number of Text Messages"
        smallCanvasFont: "11pt Arial",    // used in the obsolete table directly under the boxplots
        smallerCanvasFont: "9pt Arial",   // ditto
    },
    SSZT : {
        whichMathAux : "mathAuxTwoLine", // choices: "mathAuxOneLine", "mathAuxMultiLine", "mathAuxTwoLine"
        useBoldMath: "firefox",          // choices: "firefox", "always", "never"
        backgroundColor: "#FFFFFF",
        borderAroundEverything: "1px solid black"
    },
    T133 : {
        chiSquaredFormulaNumberOfRows: 1,
        contingencyTableTitle: "Contingency Table for Gender and Relationship of Accused",
        displayZeroDividedByZeroAs: "n/a"
    },
    Figure511: {
        inputFieldSize: 10,
        stepping: 0.001,
        format: "%5.3f"
    },
    F103: {
        dotRadius: 6,
        lowerXAxisLabelsFont: "11pt Arial"   // was "bold 11pt Arial"
    },
    F102: {
        dotRadius: 6,
        spaceAboveResult: "7px",
        lowerXAxisLabelsColor: "rgb(110, 0, 110)",
        lowerXAxisLabelsFont: "11pt Arial",
        aBitMoreSpaceBetweenFormulaAndResetButtons: "8px",
        xtraSpaceBetweenSlidersAndResetButtons: "0px"
    },
    F112: {
        dotRadius: 6,
        dotColor: "black",
        underFPDFfillColor: "#e1938d"
    },
    F68: {
        minimumSampleSize: 5,
        maximumSampleSize: 50,
        minimumStd: 2.8,
        maximumStd: 6,
        sliderLeftSpacing: "16px",
        leftCanvasWidth: 510,
        rightCanvasWidth: 560,
        leftCanvasHeight: 340,
        rightCanvasHeight: 460,
        dotRadius: 5,
        faintRed: "rgba(255, 0, 0, 0.15)",
        faintPurple: "rgba(128, 0, 128, 0.15)",
        faintBlue: "rgba(0, 0, 255, 0.15)"
    },
    F34: {
        canvasHeight: 400
    },
    F84 : {
        sampSizeSliderMin : 5,
        sampSizeSliderMax : 250,
        sampSizeSliderInitial: 10,
        sampSizeSliderTitle: 'Set Sample Size (<span style="font-style: italic;">n</span>):',
        significanceButtonsTitle: "Set Significance Level (&alpha;)",
        knownUnknownButtonsTitle: 'The population standard deviation (<span style="font-style: italic;">&sigma;</span>) is:',
        sliderLeftSpacing: "12px",
        canvasWidth: 800,
        canvasHeight: 540,
        popMean: 151,
        popStd: 9,
        generateSampleOnStartUp: false,
        distanceBellCurvePeakCanvasTop: 60,
        distanceBellCurveAxisCanvasBottom: 200,
        distanceCIfromBottom: 70,
        lengthCIsideBars: 28,
        ciCenterColor: "#aa0000",
        ciLineColor: "#ff7f7f",
        ciOvalHeight: 11,
        ciOvalWidth: 7,
        ciLineWidth: 2
    },
    PowerEffect : {
        canvasWidth: 950,
        canvasHeight: 405,
        verticalSliderSpacing: 10,
        axisFromBottom: 100,
        distanceBellCurvePeakCanvasTop: 90,
        tMin: -5.25,
        tMax: 5.25,
        nullHypTailColor: "#ff6655",
        nullHypTailBorderColor: "#55aa55",
        type2ErrorColor: "#ddd",
        meanSliderStep: 0.01,
        stdSliderStep: 0.01,
        pdfDontGoUnder: 0.005            // pdf values lower than pdfDontGoUnder will be plotted as pdfDontGoUnder
    },
    Figure48 : {
        canvasWidth : 600,
        canvasHeight : 600,
        // rgba, last parameter is transparency (rather, opaqueness!), between 0 and 1
        // 0 is fully transparent (inivisible)
        // 1 is fully opaque (fully covering up what's behind it, same as using rgb instead of rgba)
        colorA : "rgba(0, 0, 255, 0.7)",          // left circle is drawn first, and therefor "on bottom"
        colorB : "rgba(255, 0, 0, 0.7)",          // right circle is drawn last, and therefore "on top"
        colorPA: "rgb(0, 0, 255)",             // color for PA label next to circle (same as circle color, except that it's not transparent)
        colorPB: "rgb(255, 0, 0)",             // ditto PB
        papbCanvasFont: "24px Arial",
        lowerCanvasFont: "18px Arial",
        mutuallyExColor: "#910"
    }
    
    
    
};
