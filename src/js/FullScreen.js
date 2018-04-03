/**
 * @author chenchu
 * @date 2015 6 15
 * @info full screen api
 */
+(function (window, document) {
	var fullScreenApi = {
		supportsFullScreen: false,
		isFullScreen: function () { return false; },
		requestFullScreen: function (el) { },
		cancelFullScreen: function () { },
		fullScreenEventName: "",
		prefix: ""
	};

	if (document.fullscreenEnabled) {
		fullScreenApi.supportsFullScreen = true;
	} else if (document.webkitFullscreenEnabled) {
		fullScreenApi.prefix = "webkit";
		fullScreenApi.supportsFullScreen = true;
	} else if (document.mozFullScreenEnabled) {
		fullScreenApi.prefix = "moz";
		fullScreenApi.supportsFullScreen = true;
	} else if (document.msFullscreenEnabled) {
		fullScreenApi.prefix = "ms";
		fullScreenApi.supportsFullScreen = true;
	}

	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix !== "ms" ? (fullScreenApi.prefix + "fullscreenchange") : "MSFullscreenChange";

		fullScreenApi.isFullScreen = function () {
			return document.fullscreenElement ||
				document.webkitFullscreenElement ||
				document.mozFullScreenElement ||
				document.msFullscreenElement ||
				false;
		};

		fullScreenApi.requestFullScreen = function (el) {
			if (el.requestFullscreen) {
				el.requestFullscreen();
			} else if (el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen();
			} else if (el.mozRequestFullScreen) {
				el.mozRequestFullScreen();
			} else if (el.msRequestFullscreen) {
				el.msRequestFullscreen();
			}
		};

		fullScreenApi.cancelFullScreen = function () {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		};
	}

	if (typeof define === "function" && define.amd) {
		define([], function () {
			return fullScreenApi;
		});
	} else {
		window.fullScreenApi = fullScreenApi;
	}
})(window, document);