"use strict";

var utils = require("../utils");
var log = require("npmlog");
var url = require("url");

module.exports = function (defaultFuncs, api, ctx) {
  return function getUID(link, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
      };
    }

    // Link cleaning
    if (!link) return callback(new Error("Link missing."));
    
    // Handle simple numeric UID or username detection
    if (!link.includes("facebook.com") && !link.includes("messenger.com")) {
        // If it looks like a direct username or ID
        link = "https://www.facebook.com/" + link;
    }

    var checkUrl;
    try {
        checkUrl = new URL(link);
    } catch (e) {
        return callback(new Error("Invalid URL format."));
    }

    // Strategy 1: Clean URL if it's already a profile.php?id= format
    if (checkUrl.pathname === "/profile.php" && checkUrl.searchParams.has("id")) {
        return callback(null, checkUrl.searchParams.get("id"));
    }

    // Strategy 2: Use internal session to scrape the page (Most reliable)
    // Using the logged-in session avoids redirects to login page
    defaultFuncs
      .get(link, ctx.jar, {}, ctx.globalOptions)
      .then(function(resData) {
        var html = resData.body;
        
        // Try multiple regex patterns used by FB
        // Pattern 1: meta property="al:android:url" content="fb://profile/1000..."
        var match = html.match(/fb:\/\/profile\/(\d+)/);
        if (match) return match[1];

        // Pattern 2: "userID":"1000..."
        match = html.match(/"userID":"(\d+)"/);
        if (match) return match[1];

        // Pattern 3: "entity_id":"1000..."
        match = html.match(/"entity_id":"(\d+)"/);
        if (match) return match[1];

        // Pattern 4: profile_id=1000...
        match = html.match(/profile_id=(\d+)/);
        if (match) return match[1];

        throw new Error("Could not find UID. The link might be invalid or the user is hidden.");
      })
      .then(function(uid) {
        callback(null, uid);
      })
      .catch(function(err) {
        log.error("getUID", err);
        // Fallback: If scraping fails, try the graph search (getUserID)
        // This is useful for vanity URLs (e.g. facebook.com/zuck)
        var username = checkUrl.pathname.replace(/^\//, "").split("/")[0];
        if (username) {
            log.info("getUID", "Scraping failed, trying Graph Search fallback for:", username);
            api.getUserID(username, function(err, data) {
                if (err || !data || data.length === 0) return callback(new Error("UID not found."));
                return callback(null, data[0].userID);
            });
        } else {
            return callback(err);
        }
      });

    return returnPromise;
  };
};
