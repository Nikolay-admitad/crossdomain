 
// cookie lifetime
var daysToStore = 90;
 
// name of the cookie that stores all cpa utm tags
var utmsCookieName = 'utm_params_admitad';
 
// Give the URL parameters variable names
 
var utmsCookieValue = '?';

var getSourceUtmCookie = function (cookieName) {
   var matches = document.cookie.match(new RegExp(
       '(?:^|; )' + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
   ));
   return matches ? decodeURIComponent(matches[1]) : undefined;
};

function getParameterByName(name) {
   var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
   var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
   var results = regex.exec(location.search);
   return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function addParamsToUtmCookie(utmName, utmValue){
   if (utmValue){
       utmsCookieValue = utmsCookieValue + utmName + utmValue + '&';
   }
}

addParamsToUtmCookie('utm_source=',getParameterByName('utm_source'));
addParamsToUtmCookie('utm_medium=',getParameterByName('utm_medium'));
addParamsToUtmCookie('utm_campaign=',getParameterByName('utm_campaign'));
addParamsToUtmCookie('utm_content=',getParameterByName('utm_content'));
 
/*
If you need to replace other parameters to transfer between domains, replace the parameter name and value for the function
Example addingParamsToUtmCookie('admitad_uid=',getParameterByName('admitad_uid'));
*/
addParamsToUtmCookie('tagtag_uid=',getParameterByName('tagtag_uid'));
 
if (location.search) {
   utmsCookieValue = utmsCookieValue.slice(0,-1);
}
 
// a function to get the source from the cookie named cookie_name
var getSourceCookie = function (cookieName) {
   var matches = document.cookie.match(new RegExp(
       '(?:^|; )' + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
   ));
   return matches ? decodeURIComponent(matches[1]) : undefined;
};
 
// a function to set the source in the cookie named cookie_name
var setUtmsCookie = function () {
   if (!utmsCookieValue) { return; }
   var period = daysToStore * 60 * 60 * 24 * 1000; // в секундах
   var expiresDate = new Date(new Date().getTime() + period);
   var cookieString = utmsCookieName + '=' + utmsCookieValue + '; path=/; expires=' + expiresDate.toGMTString();
   document.cookie = cookieString;
   document.cookie = cookieString + '; domain=.' + location.host;
};

setUtmsCookie();

var links = document.getElementsByTagName("a");
 
// If there is a cookie with utm tags, then we add tags when switching to another domain
var utms = getSourceCookie(utmsCookieName);
if (utms) {
   for (var i = 0; i < links.length; i++) {
       var link = links[i];
       if (link.host == location.host || link.host == '') { continue };
       if (link.href.indexOf('?') > 0) {
           link.href = link.href + utms.replace("?", "&");
       } else {
           link.href = link.href + utms;
       }
   }
}
