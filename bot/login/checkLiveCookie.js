const axios = require("axios");

/**
 * Checks if the provided Facebook cookie is still valid/live.
 * @param {string} cookie Cookie string as `c_user=123;xs=123;datr=123;` format
 * @param {string} userAgent User agent string
 * @returns {Promise<Boolean>} True if cookie is valid, false if not
 */
module.exports = async function (cookie, userAgent) {
	try {
		const response = await axios({
			url: 'https://mbasic.facebook.com/settings',
			method: "GET",
			timeout: 10000, // 10s timeout to prevent hanging
			headers: {
				cookie,
				"user-agent": userAgent || 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36',
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
				"accept-language": "en-US,en;q=0.9",
				"sec-ch-prefers-color-scheme": "dark",
				"upgrade-insecure-requests": "1"
			}
		});
		
		// If response contains redirect to login or checkpoint, cookie is dead
		if (response.request.res.responseUrl.includes('/login/') || response.request.res.responseUrl.includes('checkpoint')) {
			return false;
		}

		// Standard check for valid session indicators
		return response.data.includes('/privacy/xcs/action/logging/') || 
			   response.data.includes('/notifications.php?') || 
			   response.data.includes('href="/login/save-password-interstitial') ||
			   response.data.includes('mbasic_logout_button');
	}
	catch (e) {
		return false;
	}
};
