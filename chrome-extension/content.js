console.log("Content > Running");

var APP_SCRIPT = chrome.extension.getURL("scripts/mkto-app.min.js"),
    currentUrl = window.location.href,
    mktoAppDomain = "^https:\/\/app-[a-z0-9]+\.marketo\.com",
    mktoDesignerDomain = "^https:\/\/[a-z0-9]+-[a-z0-9]+\.marketodesigner\.com",
//	mktoEmailDesigner = mktoDesignerDomain + "/ds",
//	mktoLandingPageDesigner = mktoDesignerDomain + "/lpeditor/",
	mktoWizard = mktoAppDomain + "/m#",
    loadScript;

/**************************************************************************************		
 *		
 *  This function loads the requested script by appending a script element to the head.	
 * 
 *  @Author Brian Fisher
 * 
 *  @function
 *		
 **************************************************************************************/	
loadScript = function(name) {
    console.log("Content > Loading: "+name);
    
    var script = document.createElement("script");
    script.setAttribute("src", name);
    document.getElementsByTagName("head")[0].appendChild(script);
}

window.onload = function() {
    console.log("Content > Window: Loaded");
    
    if (currentUrl.search(mktoAppDomain) != -1
    && currentUrl.search(mktoDesignerDomain) == -1
    && currentUrl.search(mktoWizard) == -1) {
        console.log("Content > Location: Marketo App");
        
        loadScript(APP_SCRIPT);
    }
}