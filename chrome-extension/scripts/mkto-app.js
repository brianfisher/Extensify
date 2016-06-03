/**************************************************************************************
 *
 *  This script contains all of the functionality needed for the manipulation of the 
 *  Marekto App and handles the overwriting of native Marketo functions.
 *
 *  @Author Brian Fisher
 *
 *  @namespace
 *
 **************************************************************************************/
console.log("Marketo App > Running");

/**************************************************************************************
 *
 *  Global Constants
 *
 **************************************************************************************/

var currentUrl = window.location.href,
    mktoAppDomain = "^https:\/\/app-[a-z0-9]+\.marketo\.com",
    mktoDesignerDomain = "^https:\/\/[a-z0-9]+-[a-z0-9]+\.marketodesigner\.com",
//	mktoEmailDesigner = mktoDesignerDomain + "/ds",
//	mktoLandingPageDesigner = mktoDesignerDomain + "/lpeditor/",
	mktoWizard = mktoAppDomain + "/m#",
    
    APP = APP || {};

/**************************************************************************************
 *  
 *  This function gets the specified cookie for the current domain. It loops through
 *  the string contained in document.cookie and looks for the given cookie.
 *
 *  @Author Andrew Garcia
 *
 *  @function
 *
 *  @param {String} cookieField - Represents the key to search for inside document.cookie
 *
 **************************************************************************************/

APP.getCookie = function(cookieField) {
    console.log("Marketo App > Getting: Cookie " + cookieField);
    
    var name = cookieField + "=",
        cookies = document.cookie.split(';'),
        currentCookie;
    
    for (var ii = 0; ii < cookies.length; ii++) {
        var currentCookie = cookies[ii].trim();
        if (currentCookie.indexOf(name) == 0) {
            return currentCookie.substring(name.length, currentCookie.length);
        }
    }
    return null;
}

/**************************************************************************************
 *  
 *  This function overrides showMenu for the toolbar button menus in order to add an 
 *  Export Data button to the Program Analyzer Actions menu and enables the export of 
 *  the data
 *
 *  @Author Brian Fisher
 *
 *  @function
 *
 **************************************************************************************/

APP.enableProgramAnalyzerDataExport = function() {
    if (Mkt
    && Mkt.widgets
    && Mkt.widgets.ToolbarButton
    && Mkt.widgets.ToolbarButton.prototype
    && Mkt.widgets.ToolbarButton.prototype.showMenu) {
        console.log("Marketo App > Enabling: Program Analyzer Data Export");
        
        Mkt.widgets.ToolbarButton.prototype.showMenu = function() {
            var activeTabTitle = MktCanvas.getActiveTab().title,
                itemId = "newReport_atxCanvasOverview",
                exportItem,
                exportHandler,
                currDatetime,
                currDatetimeAppend,
                filename,
                file,
                fileUrl;
                
            if (activeTabTitle == "Program Analyzer"
            && !this.menu.items.get(itemId)) {
                console.log("Marketo App > Executing: Program Analyzer Data Export");
                
                currDatetime = new Date(),
                currDatetimeAppend = currDatetime.getFullYear() + '-' + (currDatetime.getMonth()+1) + '-' + currDatetime.getDate() + 'T' + currDatetime.getHours() + ':' + currDatetime.getMinutes() + ':' + currDatetime.getSeconds(),
                filename = "programAnalyzerExport_"+currDatetimeAppend+".json",
                file = new Blob([JSON.stringify(JSON.parse(MktPage.appVars.analyzerData.GET_PROGRAM_DATA), null, 2)], {
                    type: "application/json"
                }),
                fileUrl = URL.createObjectURL(file),
                //fileUrl = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MktPage.appVars.analyzerData.GET_PROGRAM_DATA)),
                exportItem = this.menu.items.get("deleteReport").cloneConfig(),
                exportHandler = function() {window.open(fileUrl, filename)},
                exportItem.itemId = itemId,
                exportItem.setText("Export Data"),
                exportItem.setIconClass("mkiExcel"),
                exportItem.setHandler(exportHandler),
                this.menu.items.add(itemId, exportItem);
            }
            
            this.showingMenu = true;
            if (this.menu.xtra) {
                delete this.menu.xtra;
            }
            this.menu.triggeredFrom = 'button';
            this.fireEvent('beforemenushow', this.menu);
            Mkt.widgets.ToolbarButton.superclass.showMenu.call(this);
            
            if (fileUrl
            && filename
            && activeTabTitle == "Program Analyzer") {
                exportItem = this.menu.items.get(itemId);
                
                if (exportItem
                && exportItem.el
                && exportItem.el.dom
                && exportItem.el.dom.href
                && exportItem.el.dom.download == "") {
                    exportItem.el.dom.href = fileUrl,
                    exportItem.el.dom.download = filename;
                }
                
            }
            
            this.showingMenu = false;
        }
    }
}

/**************************************************************************************
 *
 *  Main
 *  
 **************************************************************************************/

if (currentUrl.search(mktoAppDomain) != -1
&& currentUrl.search(mktoDesignerDomain) == -1
&& currentUrl.search(mktoWizard) == -1) {
    console.log("Marketo App > Location: Marketo URL");

    var isMktPage = window.setInterval(function() {
        if (typeof(MktPage) !== "undefined") {
            console.log("Marketo App > Location: Marketo Page");
            
            window.clearInterval(isMktPage);
            if (APP.getCookie("toggleState") != "false") {
                APP.enableProgramAnalyzerDataExport();
            }
        }
    }, 0);
}