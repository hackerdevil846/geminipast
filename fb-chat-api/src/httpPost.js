"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  return function httpPost(url, form, callback, notAPI) {
    return new Promise(function (resolve, reject) {
      // Validate required parameters
      if (!defaultFuncs || typeof defaultFuncs.post !== "function") {
        const error = new Error("defaultFuncs is invalid or missing post method");
        log.error("httpPost", error.message);
        if (typeof callback === "function") callback(error);
        return reject(error);
      }

      if (!ctx) {
        const error = new Error("Context (ctx) is required");
        log.error("httpPost", error.message);
        if (typeof callback === "function") callback(error);
        return reject(error);
      }

      // Validate URL
      if (typeof url !== "string" || !url.trim()) {
        const error = new Error("Invalid URL provided: " + String(url));
        log.error("httpPost", error.message);
        if (typeof callback === "function") callback(error);
        return reject(error);
      }

      // Handle parameter overloading safely
      if (typeof callback === "undefined" && typeof form === "function") {
        callback = form;
        form = {};
      }

      // Ensure callback is a function or undefined
      if (callback && typeof callback !== "function") {
        log.warn("httpPost", "Callback parameter is not a function, ignoring");
        callback = undefined;
      }

      // Ensure form is a valid object
      if (typeof form !== "object" || form === null) {
        form = {};
      }

      // Safe callback wrapper with complete error prevention
      const safeCallback = function (err, data) {
        try {
          if (typeof callback === "function") {
            setTimeout(() => {
              try {
                callback(err, data);
              } catch (callbackErr) {
                log.error("httpPost", "Callback execution error (async):", callbackErr.message);
              }
            }, 0);
          }
          
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        } catch (safeError) {
          log.error("httpPost", "Safe callback error:", safeError.message);
          // Ensure promise is always settled
          if (err) {
            reject(err);
          } else {
            resolve(data || null);
          }
        }
      };

      // Validate context dependencies
      if (!ctx.jar) {
        const error = new Error("Cookie jar (ctx.jar) is required");
        log.error("httpPost", error.message);
        return safeCallback(error);
      }

      try {
        // Prepare request options safely
        const requestOptions = notAPI ? (ctx.globalOptions || {}) : (ctx.globalOptions || {});
        const jar = ctx.jar || null;

        // Determine which post function to use
        let requestPromise;
        if (notAPI) {
          if (!utils || typeof utils.post !== "function") {
            throw new Error("Utils post method is not available");
          }
          requestPromise = utils.post(url, jar, form, requestOptions);
        } else {
          if (!defaultFuncs.post) {
            throw new Error("defaultFuncs post method is not available");
          }
          requestPromise = defaultFuncs.post(url, jar, form, requestOptions);
        }

        // Validate that we got a promise
        if (!requestPromise || typeof requestPromise.then !== "function") {
          throw new Error("Request did not return a valid promise");
        }

        // Execute the request with timeout protection
        const timeout = setTimeout(() => {
          const timeoutError = new Error(`Request timeout for URL: ${url}`);
          log.error("httpPost", timeoutError.message);
          safeCallback(timeoutError);
        }, 30000); // 30 second timeout

        requestPromise
          .then(function (resData) {
            clearTimeout(timeout);
            
            if (!resData) {
              const error = new Error("No response data received from: " + url);
              log.error("httpPost", error.message);
              return safeCallback(error);
            }

            try {
              // Safely extract response body with comprehensive type checking
              let responseBody;
              let statusCode = resData.statusCode || 0;
              let headers = resData.headers || {};

              if (Buffer.isBuffer(resData.body)) {
                responseBody = resData.body.toString('utf8');
              } else if (typeof resData.body === 'string') {
                responseBody = resData.body;
              } else if (resData.body && typeof resData.body === 'object') {
                try {
                  responseBody = JSON.stringify(resData.body);
                } catch (stringifyError) {
                  log.warn("httpPost", "Could not stringify response body, using default");
                  responseBody = String(resData.body);
                }
              } else if (resData.body !== undefined && resData.body !== null) {
                responseBody = String(resData.body);
              } else {
                responseBody = '';
              }

              log.verbose("httpPost", `Request successful - URL: ${url}, Status: ${statusCode}`);
              
              safeCallback(null, {
                body: responseBody,
                statusCode: statusCode,
                headers: headers,
                originalResponse: resData
              });
            } catch (parseError) {
              log.error("httpPost", "Error parsing response:", parseError.message);
              safeCallback(parseError);
            }
          })
          .catch(function (error) {
            clearTimeout(timeout);
            log.error("httpPost", `Request failed - URL: ${url}, Error:`, error.message);
            safeCallback(error);
          });
      } catch (executionError) {
        log.error("httpPost", "Execution error:", executionError.message);
        safeCallback(executionError);
      }
    });
  };
};
