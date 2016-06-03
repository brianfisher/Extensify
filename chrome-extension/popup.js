/**************************************************************************************
 *
 *  For whatever reason, Chrome does not allow the opening of links from inside 
 *  popup.html. The workaround for this is contained below. We select all of the 
 *  <a> tags, and then add a click listener that calls window.open() on the <a> 
 *  tag's target URL. Jquery is also not allowed by Chrome in this context.
 *
 *  @Author Andy
 *
 *  @function
 *
 **************************************************************************************/
console.log("Popup > Running");

window.onload = function() {
    
    // This is a strange idiosyncrasy with chrome extensions. You cannot directly reference the local
    // folders without hard-coding the unique id of the plugin, which may potentially change. This is
    // the alternative to using <img src="whatever">
    document.getElementById("logo-size").src = chrome.extension.getURL("images/extensify-logo-white.png"),
    document.getElementById("gear-size").src = chrome.extension.getURL("images/settings-icon-white.png"),
    document.getElementById("help-size").src = chrome.extension.getURL("images/help-icon-white.png"),
    document.getElementById("report-a-bug").src = chrome.extension.getURL("images/report-a-bug-icon-purple.png");
    
    var background = chrome.extension.getBackgroundPage(),
        mktoAppMatch = "https://app-*.marketo.com",
        tags = document.getElementsByClassName("link"),
        toggle = document.getElementById("option-toggle"),
        settings = document.getElementById("settings"),
        help = document.getElementById("help"),
        settingsOpen = false,
        helpOpen = false,
        currState;
        
    background.getCookies(mktoAppMatch, "toggleState", function(state) {
        if (state == null) {
            console.log("Popup > Cookie toggleState: null");
            currState = true;
            document.getElementById("toggle-text").innerHTML = "Extension Enabled";
            document.getElementById("toggle").src = chrome.extension.getURL("images/toggle-on.png");
            background.saveState({
                "state": "true",
                "init": "true"
            });
        }
        else if (state == "true") {
            console.log("Popup > Cookie toggleState: true");
            currState = true;
            document.getElementById("toggle-text").innerHTML = "Extension Enabled";
            document.getElementById("toggle").src = chrome.extension.getURL("images/toggle-on.png");
        }
        else {
            console.log("Popup > Cookie toggleState: false");
            currState = false;
            document.getElementById("toggle-text").innerHTML = "Extension Disabled";
            document.getElementById("toggle").src = chrome.extension.getURL("images/toggle-off.png");
        }
    });
    
    for (var ii = 0; ii < tags.length; ii++) {
        tags[ii].onclick = function() {
            chrome.tabs.create({
                url: this.href,
                selected: true
            });
        }
    }
    
    help.onclick = function() {
        if (!helpOpen) {
            helpOpen = true;
            document.getElementById("help-container").style.display = "block";
        }
        else {
            helpOpen = false;
            document.getElementById("help-container").style.display = "none";
        }
    }
    
    settings.onclick = function() {
        if (!settingsOpen) {
            settingsOpen = true;
            document.getElementById("settings-container").style.display = "block";
        }
        else {
            settingsOpen = false;
            document.getElementById("settings-container").style.display = "none";
        }
    }
    
    toggle.onclick = function() {
        if (!currState) {
            currState = true;
            document.getElementById("toggle-text").innerHTML = "Extension Enabled";
            document.getElementById("toggle").src = chrome.extension.getURL("images/toggle-on.png");
            background.saveState({
                "state": "true",
                "init": "false"
            });
            setTimeout(function() {window.close();}, 1250);
        } 
        else {
            currState = false;
            document.getElementById("toggle-text").innerHTML = "Extension Disabled";
            document.getElementById("toggle").src = chrome.extension.getURL("images/toggle-off.png");
            background.saveState({
                "state": "false",
                "init": "false"
            });
            setTimeout(function() {window.close();}, 1250);
        }
    }
}