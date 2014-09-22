/* 
 * Experimental script to detect AdBlock
 * 
 * REQUIREMENTS: jQuery loaded before of this javascript file
 * 
 * PAY ATTENTION: THERE IS A LITTLE CHANCE OF FALSE POSITIVES,
 * ALSO PLEASE DON'T USE MESSAGES THAT INVITE YOUR USERS TO CLICK ON ADs
 * USE IT AT YOUR OWN RISK
 *
 * I advice to use it just to collect stats to GA (default configuration does this only)
 * as it will log events google analytics and it's useful to
 * gather info about the % of your traffic that uses AdBlock
 * 
 * NOTICE: IT WORKS ONLY WITH THE ADCODE NEW CODE, the one with the <ins> html5 tag
 * 
 * TIP: this script can be used also to passback to in-house Ads for who got adblock (need to customize behaivor)
 * 
 * 
 * Author: Stefano Gargiulo
 * License: MIT 
 * 
 */

/* 
 * start configuration 
 */
window.adBlockDetectorConfiguration={
    detectEnabled: true,
    logtoGA: true,
    logNegativesToo: true,
    showMessageOnDetection: false,
    messageForAdBlockers:
    //Customize your message here:
    "<div style='text-align:center;'><br/><h2>Please disable AdBlock extension on your browser and refresh to continue browsing this site</h2>" +
    "<hr/><h3>Questo sito non è compatibile con le estensioni AdBlock, disablitale e ricarica la pagina per continuare</h3></div>",
    denyContentOnDetection: false
}
/*
 * end configuration 
 */



jQuery(document).ready(function() {
    window.setTimeout(detectAdBlock, 3600);
});

function detectAdBlock() {
    if (window.adBlockDetectorConfiguration.detectEnabled) {
        var hiddenCount = jQuery("ins").filter(":hidden").length;
        var visibleCount = jQuery("ins").filter(":visible").length;
        if (hiddenCount > visibleCount) {
            if (window.adBlockDetectorConfiguration.logtoGA){
              GAnaltyicsBridge.event("AdBlockDetector", "adblock-detection", "adblock-enabled");
            }
            if (window.adBlockDetectorConfiguration.showMessageOnDetection) {
                var adblockMessage = adBlockDetectorConfiguration.messageForAdBlockers;
                if (window.adBlockDetectorConfiguration.denyContentOnDetection) {
                   if (window.adBlockDetectorConfiguration.logtoGA){
                      GAnaltyicsBridge.event("AdBlockDetector", "adblock-blocked", "blocked-completeley");
                   }
                  jQuery("body").html(adblockMessage);
                } else {
                    if (window.adBlockDetectorConfiguration.logtoGA){
                      GAnaltyicsBridge.event("AdBlockDetector", "adblock-blocked", "warning-only");
                    }
                    jQuery("body").prepend("<div onClick='jQuery(\".adBlockBlockedWarning\").hide();' class='adBlockBlockedWarning'" +
                            "style='cursor:pointer; background: whitesmoke; color: #777; position:fixed; top: 0px; width: 100%; border: 1px lightgray solid; z-index:9998; opacity:.93;'>" +
                            "<i class='uk-icon-danger'></i>" + adblockMessage + "</div>");
                }
            } else {
                if (window.adBlockDetectorConfiguration.logtoGA){
                  GAnaltyicsBridge.event("AdBlockDetector", "adblock-allowed", "allowed");
                }
            }
        }else{
            if (window.adBlockDetectorConfiguration.logtoGA && window.adBlockDetectorConfiguration.logNegativesToo){
              GAnaltyicsBridge.event("AdBlockDetector", "adblock-detection", "not-enabed");
            }
        }
    }
}

if (!window.GAnaltyicsBridge) {
    window.GAnaltyicsBridge = {
        event: function(eventCat, eventAction, eventLabel, eventCounter) {
            try {
                if (window.ga && window.ga.getAll != undefined) {
                    ga('send', 'event', eventCat, eventAction, eventLabel, eventCounter);
                }
                if (_gaq) {
                    _gaq.push(['_trackEvent', eventCat, eventAction, eventLabel, eventCounter]);
                }
            } catch (e) {
            }
        }
    };
}
