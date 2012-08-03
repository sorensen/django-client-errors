
// Client error tracking
// ---------------------

// (The MIT License)
// Copyright (c) 2011-2012 Beau Sorensen <mail@beausorensen.com>
// For details see https://github.com/sorensen/django_client_errors

;(function(win, nav, $) {
  'use strict'
  
  // Browser detection below taken from session.js 0.4.1
  // (c) 2012 Iain, CodeJoust
  // For details, see: https://github.com/codejoust/session.js
  
  // Browser (and OS) detection
  var browser = {
    detect: function() {
      return {
        browser: this.search(this.data.browser)
      , version: this.search(nav.userAgent) || this.search(nav.appVersion)
      , os: this.search(this.data.os)
      } 
    }

  , search: function(data) {
      var index
        , version
        , sIndex

      if (typeof data === "object") {
        // search for string match
        for (var i = 0; i < data.length; i++) {
          var dataString = data[i].string
            , dataProp = data[i].prop

          this.version_string = data[i].versionSearch || data[i].identity
          if (dataString) {
            if (!!~dataString.indexOf(data[i].subString)) {
              return data[i].identity
            }
          } else if (dataProp) {
            return data[i].identity
          }
        }
      } else {
        // search for version number
        index = data.indexOf(this.version_string)
        if (!~index) {
          return
        }
        version = data.substr(index + this.version_string.length + 1)
        sIndex = version.indexOf(' ')

        // Only use the string up to the first space if found
        if (!!~sIndex) {
          version = version.substr(0, sIndex)
        }
        return version
      }
    }

  , data: {
      browser: [
        { string: nav.userAgent, subString: "Chrome", identity: "Chrome" }
      , { string: nav.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb" }
      , { string: nav.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version" }
      , { prop: win.opera, identity: "Opera", versionSearch: "Version" }
      , { string: nav.vendor, subString: "iCab",identity: "iCab" }
      , { string: nav.vendor, subString: "KDE", identity: "Konqueror" }
      , { string: nav.userAgent, subString: "Firefox", identity: "Firefox" }
      , { string: nav.vendor, subString: "Camino", identity: "Camino" }
      , { string: nav.userAgent, subString: "Netscape", identity: "Netscape" }
      , { string: nav.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE" }
      , { string: nav.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv" }
      , { string: nav.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla" }
      ]

    , os: [
        { string: nav.platform, subString: "Win", identity: "Windows" }
      , { string: nav.platform, subString: "Mac", identity: "Mac" }
      , { string: nav.userAgent, subString: "iPhone", identity: "iPhone/iPod" }
      , { string: nav.userAgent, subString: "iPad", identity: "iPad" }
      , { string: nav.userAgent, subString: "Android", identity: "Android" }
      , { string: nav.platform, subString: "Linux", identity: "Linux" }
      ]}
  }

  var modules = {
    browser: function() {
      return browser.detect()
    }

  , locale: function() {
      var lang = ((
        nav.language
        || nav.browserLanguage
        || nav.systemLanguage
        || nav.userLanguage
      ) || '').split("-")

      if (lang.length === 2) {
        return { 
          country: lang[1].toLowerCase()
        , lang: lang[0].toLowerCase() 
        }
      } else if (lang) {
        return {
          lang: lang[0].toLowerCase()
        , country: null 
        }
      } else { 
        return {
          lang: null
        , country: null 
        } 
      }
    }

  , device: function() {
      var device = {
        screen: {
          width: win.screen.width
        , height: win.screen.height
        }
      }
      device.viewport = {
        width: win.innerWidth || doc.body.clientWidth || doc.documentElement.clientWidth
      , height: win.innerHeight || doc.body.clientHeight || doc.documentElement.clientHeight
      }
      device.is_tablet = !!nav.userAgent.match(/(iPad|SCH-I800|xoom|kindle)/i)
      device.is_phone = !device.is_tablet && !!nav.userAgent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i)
      device.is_mobile = device.is_tablet || device.is_phone
      return device
    }

  , plugins: function() {
      var check_plugin = function(name) {
        if (nav.plugins) {
          var plugin
            , i = 0
            , length = nav.plugins.length

          for (; i < length; i++ ) {
            plugin = nav.plugins[i]
            if (plugin && plugin.name && !!~plugin.name.toLowerCase().indexOf(name)) {
              return true
            } 
          }
          return false
        } 
        return false
      }
      return {
        flash: check_plugin("flash")
      , silverlight: check_plugin("silverlight")
      , java: check_plugin("java")
      , quicktime: check_plugin("quicktime")
      }
    }
  }

  // Attach to the onerror method
  window.onerror = function(msg, url, loc) {
    var href = win.clientErrorUrl || '/__error__/client/'
      , browser = modules.browser()
      , device = JSON.stringify(modules.device())
      , plugins = JSON.stringify(modules.plugins())
      , locale = JSON.stringify(modules.locale())

    if ($) {
      // Post if available
      $.post(href, {
        msg: msg
      , url: url
      , loc: loc
      , os: browser.os
      , bw: browser.browser
      , vs: browser.version
      , plugins: plugins
      , locale: locale
      , device: device
      })
    } else {
      // Image GET fallback, plugins, locale, and device not used
      // to save on URL size limit
      new Image().src = href 
        + '?msg=' + msg 
        + '&url=' + url 
        + '&loc=' + loc
        + '&os=' + browser.os
        + '&bw=' + browser.browser
        + '&vs=' + browser.version
        + '&plugins=' + plugins
        + '&locale=' + locale
        + '&device=' + device
    }
  }

})(window, navigator, window.jQuery || window.Zepto);
