/*!
 * OpenLayer 3 tile url function to load tile seeded with TileCache url scheme
 * @package ol3-tilecache
 * @author Vladimir Vershinin (https://github.com/ghettovoice)
 * @version 1.1.2
 * @licence MIT https://opensource.org/licenses/MIT
 *          Based on OpenLayers 3. Copyright 2005-2016 OpenLayers Contributors. All rights reserved. http://openlayers.org
 * @copyright (c) 2016, Vladimir Vershinin (https://github.com/ghettovoice)
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("openlayers"));
	else if(typeof define === 'function' && define.amd)
		define(["openlayers"], factory);
	else if(typeof exports === 'object')
		exports["TileCacheUrlFunction"] = factory(require("openlayers"));
	else
		root["ol"] = root["ol"] || {}, root["ol"]["TileCacheUrlFunction"] = factory(root["ol"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _tileUrlFunction = __webpack_require__(1);

	var tileUrlFunction = _interopRequireWildcard(_tileUrlFunction);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = tileUrlFunction; /**
	                                    * OpenLayer 3 tile url function to load tile seeded with TileCache url scheme.
	                                    *
	                                    * @package ol3-tilecache
	                                    * @author Vladimir Vershinin <ghettovoice@gmail.com>
	                                    * @licence MIT https://opensource.org/licenses/MIT
	                                    *          Based on OpenLayers 3. Copyright 2005-2016 OpenLayers Contributors. All rights reserved. http://openlayers.org
	                                    * @copyright (c) 2016, Vladimir Vershinin
	                                    */

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createTileUrlFunction = createTileUrlFunction;
	exports.createTileUrlFunctionFromTemplate = createTileUrlFunctionFromTemplate;
	exports.createTileUrlFunctionFromTemplates = createTileUrlFunctionFromTemplates;

	var _openlayers = __webpack_require__(3);

	var _openlayers2 = _interopRequireDefault(_openlayers);

	var _util = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var zRegEx = /\{z\}/g;
	var zPadRegEx = /\{0z\}/g;
	var xRegEx = /\{x\d?\}/g;
	var yRegEx = /\{y\d?\}/g;
	var dashYRegEx = /\{-y\d?\}/g;

	/**
	 * Basic create factory.
	 *
	 * @param {string} url Url template
	 * @param {ol.tilegrid.TileGrid} [tileGrid] Tile grid.
	 * @returns {ol.TileUrlFunctionType}
	 * @static
	 * @public
	 */
	function createTileUrlFunction(url) {
	    var tileGrid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _openlayers2.default.tilegrid.createXYZ();

	    return createTileUrlFunctionFromTemplates(expandUrl(url), tileGrid);
	}

	/**
	 * Creates tile URL function from single template.
	 *
	 * @param {string} template Source url
	 * @param {ol.tilegrid.TileGrid} [tileGrid] Tile grid.
	 * @returns {ol.TileUrlFunctionType}
	 * @private
	 */
	function createTileUrlFunctionFromTemplate(template) {
	    var tileGrid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _openlayers2.default.tilegrid.createXYZ();

	    return(
	        /**
	         * @param {ol.TileCoord} tileCoord Tile Coordinate.
	         * @return {string | undefined} Tile URL.
	         */
	        function (tileCoord) {
	            if (tileCoord != null) {
	                return template.replace(zRegEx, zoomReplacer(tileCoord[0])).replace(zPadRegEx, zoomReplacer(tileCoord[0], true)).replace(xRegEx, coordReplacer(tileCoord[1])).replace(yRegEx, function (part) {
	                    var y = -tileCoord[2] - 1;

	                    return coordReplacer(y)(part);
	                }).replace(dashYRegEx, function (part) {
	                    var z = tileCoord[0];
	                    var range = tileGrid.getFullTileRange(z);
	                    // The {-y} placeholder requires a tile grid with extent
	                    (0, _util.assert)(range, 'Tile grid with defined extent');

	                    var y = range.getHeight() + tileCoord[2];

	                    return coordReplacer(y)(part);
	                });
	            }
	        }
	    );
	}

	/**
	 * Creates tile URL function from multiple templates.
	 *
	 * @param {string[]} templates Url templates
	 * @param {ol.tilegrid.TileGrid} [tileGrid] Tile grid.
	 * @returns {ol.TileUrlFunctionType}
	 * @private
	 */
	function createTileUrlFunctionFromTemplates(templates) {
	    var tileGrid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _openlayers2.default.tilegrid.createXYZ();

	    return createTileUrlFunctionFromTileUrlFunctions(templates.map(function (tileUrlFunction) {
	        return createTileUrlFunctionFromTemplate(tileUrlFunction, tileGrid);
	    }));
	}

	/**
	 * @param zoom
	 * @param pad
	 * @returns {function}
	 * @private
	 */
	function zoomReplacer(zoom, pad) {
	    return function () {
	        return pad ? (0, _util.zeroPad)(zoom, 2) : zoom.toString();
	    };
	}

	/**
	 * @param coord
	 * @returns {function}
	 * @private
	 */
	function coordReplacer(coord) {
	    return function (part) {
	        var match = part.match(/\d/);

	        if (match) {
	            return (0, _util.zeroPad)(coord, 9).slice((match[0] - 1) * 3, match[0] * 3);
	        }

	        return coord.toString();
	    };
	}

	/**
	 * @param {string} url
	 * @returns {Array.<string>}
	 * @private
	 */
	function expandUrl(url) {
	    var urls = [];
	    var match = /\{(\d)-(\d)\}/.exec(url) || /\{([a-z])-([a-z])\}/.exec(url);

	    if (match) {
	        var startCharCode = match[1].charCodeAt(0);
	        var stopCharCode = match[2].charCodeAt(0);

	        for (var charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
	            urls.push(url.replace(match[0], String.fromCharCode(charCode)));
	        }
	    } else {
	        urls.push(url);
	    }

	    return urls;
	}

	/**
	 * @param {Array.<ol.TileUrlFunctionType>} tileUrlFunctions
	 * @returns {ol.TileUrlFunctionType}
	 * @private
	 */
	function createTileUrlFunctionFromTileUrlFunctions(tileUrlFunctions) {
	    if (tileUrlFunctions.length === 1) {
	        return tileUrlFunctions[0];
	    }

	    return(
	        /**
	         * @param {ol.TileCoord} tileCoord Tile Coordinate.
	         * @param {number} pixelRatio Pixel ratio.
	         * @param {ol.proj.Projection} projection Projection.
	         * @return {string | undefined} Tile URL.
	         */
	        function (tileCoord, pixelRatio, projection) {
	            if (tileCoord != null) {
	                var h = (tileCoord[1] << tileCoord[0]) + tileCoord[2];
	                var index = (0, _util.modulo)(h, tileUrlFunctions.length);

	                return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
	            }
	        }
	    );
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.zeroPad = zeroPad;
	exports.modulo = modulo;
	exports.assert = assert;
	/**
	 * Left zero pad.
	 *
	 * @param {string | number} num
	 * @param {number} places
	 * @returns {string}
	 */
	function zeroPad(num, places) {
	    var zero = places - num.toString().length + 1;

	    return (new Array(parseInt(zero > 0 && zero, 10)).join("0") + num).toString().slice(-places);
	}

	/**
	 * The % operator in JavaScript returns the remainder of a / b, but differs from
	 * some other languages in that the result will have the same sign as the
	 * dividend. For example, -1 % 8 == -1, whereas in some other languages
	 * (such as Python) the result would be 7. This function emulates the more
	 * correct modulo behavior, which is useful for certain applications such as
	 * calculating an offset index in a circular list.
	 *
	 * @param {number} a The dividend.
	 * @param {number} b The divisor.
	 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
	 *     or b < x <= 0, depending on the sign of b).
	 * @link https://closure-library.googlecode.com/git-history/docs/local_closure_goog_math_math.js.source.html#line73
	 */
	function modulo(a, b) {
	    var m = a % b;

	    return m * b < 0 ? m + b : m;
	}

	/**
	 * @param {*} value
	 * @param {string} [message]
	 * @throws {Error} Throws on false value
	 */
	function assert(value) {
	    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Assertion failed';

	    if (!value) {
	        throw new Error(message);
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;