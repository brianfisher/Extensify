console.log("Background > Running");

/**************************************************************************************
 *
 *  Global Constants
 *
 **************************************************************************************/

var mktoAppDomain = "^https:\/\/app-[a-z0-9]+\.marketo\.com",
	mktoAppMatch = "https://app-*.marketo.com",
    mktoLoginDomain = "^https:\/\/login\.marketo\.com",
    mktoAppLoginDomain = "^https:\/\/app\.marketo\.com",
    mktoDesignerDomain = "^https:\/\/[a-z0-9]+-[a-z0-9]+\.marketodesigner\.com",
	mktoDesignerMatch = "https://*.marketodesigner.com/*",
    mktoEmailDesigner = mktoDesignerDomain + "/ds",
    mktoLandingPageDesigner = mktoDesignerDomain + "/lpeditor/",
    mktoWizard = mktoAppDomain + "/m#";

/**************************************************************************************
 *
 *  This function gets the value of the cookie for the requested domain.
 *
 *  @Author Arrash
 *
 *  @function
 *
 *  @param {String} domain - The domain portion of the URL.
 *  @param {String} name - The name of the cookie.
 *  @param {function} callback - The function to be called back after getting cookie.
 *
 **************************************************************************************/
	
function getCookies(domain, name, callback) {
    console.log("Background > Getting: Cookies");
    
    chrome.cookies.get({
        "url": domain,
        "name": name
    }, function(cookie) {
        if (cookie) {
            console.log("Background > Cookie " + name + ": " + cookie.value);
            if (callback) {
                callback(cookie.value);
            }
        }
        else {
            console.log("Background > Cookie " + name + ": undefined");
            if (callback) {
                callback(null);
            }
        }
    });
}

/**************************************************************************************
 *
 *  This function stores the toggle state value as a cookie.
 *
 *  @Author Brian Fisher
 *
 *  @function
 *
 *  @param {Object} obj - The toggle state object, either 'true' or 'false'.
 *
 **************************************************************************************/

function saveState(obj) {
    console.log("Background > Saving: Toggle State");
    
    var toggleStateCookieMarketo = {
            url : "https://www.marketo.com/*",
            name : "toggleState",
            value : obj.state,
            domain : ".marketo.com"
        },
        toggleStateCookieDesigner = {
            url : "https://www.marketodesigner.com/*",
            name : "toggleState",
            value : obj.state,
            domain : ".marketodesigner.com"
        };
    chrome.cookies.set(toggleStateCookieMarketo, function() {
        console.log("Background > Setting: Toggle State Cookie for Marketo");
    });
    chrome.cookies.set(toggleStateCookieDesigner, function() {
        console.log("Background > Setting: Toggle State Cookie for Designer");
    });
    chrome.storage.sync.set(obj, function() {});
    if (obj.init != "true") {
        chrome.tabs.query({url : "*://*.marketo.com/*"}, function(tabs) {
            for (var ii = 0; ii < tabs.length; ii++) {
                chrome.tabs.reload(tabs[ii].id);
            }
        });
    }
}

/**************************************************************************************
 *
 *  This function check for existing Marketo App tabs in order to add a listener.
 *
 *  @Author Brian Fisher
 *
 *  @function
 *
 *  @param {Integer} tabId - The browser tab id.
 *  @param {String} changeInfo - The change event.
 *  @param {Object} tab - The object that represents the browser tab.
 *
 **************************************************************************************/

function checkMktoAppTab(tabId, changeInfo, tab) {
	console.log("Background > Checking: Marketo App Tabs");
	
    var currentUrl = tab.url;
    chrome.browserAction.enable(tabId);

    if (currentUrl.search(mktoAppDomain) != -1) {
		console.log("Background > Location: Marketo App Tab");
    }
}

/**************************************************************************************
 *
 *  Main
 *  
 **************************************************************************************/

chrome.tabs.onUpdated.addListener(checkMktoAppTab);