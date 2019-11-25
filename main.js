define(function(require, exports, module) {
    "use strict";

    // Brackets modules
    var EditorManager = brackets.getModule("editor/EditorManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var tagRegExp = new RegExp(/^[a-z\-]+[1-6]*$/);

    var overlay = {
        token: function(stream/*, state*/) {
            var arr;
            arr = stream.match(/<(\/|)([a-z\-]+[1-6]*)(|(.*?)[^?%\-$])>/);
            if (arr && tagRegExp.test(arr[2])) {
                return "dreamweaver-javascript-tag-" + arr[2].toUpperCase();
            }
            while (stream.next() != null && !stream.match(/<(\/|)|(\/|)>/, false)) {}
            return null;
        }
    };

    function tag_color_change() {
        var cmVariables = document.getElementById("editor-holder").querySelectorAll(".cm-variable, .cm-variable-1, .cm-variable-2, .cm-variable-3, .cm-string, .cm-property");

		var valueProperties = [
			"NaN",
			"Infinity",
			"undefined"
		];
        var valuePropertiesRegExp = new RegExp("(\\$startValueProperties|" + valueProperties.join('|') + "|\\$endValueProperties)","g");

		var functionProperties = [
			"eval",
			"parseInt",
			"parseFloat",
			"isNaN",
			"isFinite",
			"decodeURI",
			"decodeURIComponent",
			"encodeURI",
			"encodeURIComponent",
			"escape",
			"unescape"
		];
		var functionPropertiesRegExp = new RegExp("(startFunctionProperties|" + functionProperties.join('|') + "|endFunctionProperties)","g");

		var constructorProperties = [
			"Object",
			"Function",
			"Array",
			"ArrayBuffer",
			"String",
			"Boolean",
			"Number",
			"DataView",
			"Date",
			"Promise",
			"RegExp",
			"Map",
			"WeakMap",
			"Set",
			"WeakSet",
			"SharedArrayBuffer",
			"Symbol",
			"Error",
			"EvalError",
			"RangeError",
			"ReferenceError",
			"SyntaxError",
			"TypeError",
			"URIError"
		];
        var constructorPropertiesRegExp = new RegExp("(startConstructorProperties|" + constructorProperties.join('|') + "|endConstructorProperties)","g");

		var otherProperties = [
			"Atomics",
			"Math",
			"JSON",
			"Reflect",
			"Proxy",
		];
		var otherPropertiesRegExp = new RegExp("(startOtherProperties|" + otherProperties.join('|') + "|endOtherProperties)","g");

		var objectConstructor = [
			"getPrototypeOf",
			"setPrototypeOf",
			"getOwnPropertyDescriptor",
			"getOwnPropertyDescriptors",
			"getOwnPropertyNames",
			"getOwnPropertySymbols",
			"assign",
			"create",
			"defineProperty",
			"defineProperties",
			"entries",
			"is",
			"keys",
			"values",
			"seal",
			"isSealed",
			"freeze",
			"isFrozen",
			"preventExtensions",
			"isExtensible"
		];
        var objectConstructorRegExp = new RegExp("(startObjectConstructor|" + objectConstructor.join('|') + "|endObjectConstructor)","g");

		var arrayProperties = [
			"toString",
			"toLocaleString",
			"concat",
			"copyWithin",
			"entries",
			"fill",
			"join",
			"find",
			"findIndex",
			"includes",
			"keys",
			"pop",
			"push",
			"reverse",
			"shift",
			"slice",
			"sort",
			"splice",
			"unshift",
			"indexOf",
			"lastIndexOf",
			"every",
			"some",
			"forEach",
			"map",
			"filter",
			"reduce",
			"reduceRight",
			"values"
		];
        var arrayPropertiesRegExp = new RegExp("(startArrayProperties|" + arrayProperties.join('|') + "|endArrayProperties)","g");

		var stringProperties = [
			"toString",
			"valueOf",
			"charAt",
			"charCodeAt",
			"codePointAt",
			"concat",
			"endsWith",
			"includes",
			"indexOf",
			"lastIndexOf",
			"localeCompare",
			"match",
			"normalize",
			"padEnd",
			"padStart",
			"repeat",
			"replace",
			"search",
			"slice",
			"split",
			"startsWith",
			"substr",
			"substring",
			"toLowerCase",
			"toLocaleLowerCase",
			"toUpperCase",
			"toLocaleUpperCase",
			"trim"
		];
        var stringPropertiesRegExp = new RegExp("(startStringProperties|" + stringProperties.join('|') + "|endStringProperties)","g");

        // Dirty method to avoid running when its not necessary.
        var ignore = [
            "ignore",
            "ignoreClasses",
            "html",
            "elm",
            "cm",
            "cmMode",
            "variable",
            "cmVariables",
            "RegExp",
            "components",
            "Array",
            "console",
            "EditorManager",
            "editor",
            "MODES",
            "overlay",
            "tag_color_change",
            "AppInit",
            "MainViewManager",
            "updateUI",
            "ExtensionUtils",
            "module",
            "valuePropertiesRegExp",
            "functionPropertiesRegExp",
            "constructorPropertiesRegExp",
            "otherPropertiesRegExp",
            "objectConstructorRegExp",
            "arrayPropertiesRegExp",
            "stringPropertiesRegExp"
        ];
        
        var ignoreClasses = [
            "cm-angular",
            "cm-cakephp"           
        ];
        
        Array.prototype.forEach.call(cmVariables, function(elm) {
            var html = elm.innerHTML;

            html = html.replace(/^(#|\.)/, "");
            html = html.replace(/['"]+/g, "");
            
            // Dirty method to avoid running when its not necessary.
            if (ignore.indexOf(html) !== -1) {  
                return;
            }
            
            // Dirty method to avoid running when its not necessary.
            if (ignoreClasses.indexOf(elm.classList) !== -1) {  
                return;
            }
            
            if (!/\s/.test(html)) {
                if (valuePropertiesRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-value-properties-" + html, "cm-javascript");
                }
                else if (functionPropertiesRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-function-properties-" + html, "cm-javascript");
                }
                else if (constructorPropertiesRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-constructor-properties-" + html, "cm-javascript");
                }
                else if (otherPropertiesRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-other-properties-" + html, "cm-javascript");
                }
                else if (objectConstructorRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-object-constructor-" + html, "cm-javascript");
                }
                else if (arrayPropertiesRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-array-properties-" + html, "cm-javascript");
                }
                else if (stringPropertiesRegExp.test(html)) {
                    elm.classList.add("cm-dreamweaver-javascript-string-properties-" + html, "cm-javascript");
                } else {
                    //console.log(html);                    
                }
            }
        });
    }
    
    // Constants
    var MODES = ["javascript", "typescript", "text/x-brackets-html", "application/x-ejs"];
    function updateUI() {
        var editor = EditorManager.getCurrentFullEditor();
        if(!editor){
            return;
        }
        
        var cm = editor._codeMirror,
            cmMode;

        // Only apply the overlay in a mode that *might* contain Javascript
        cmMode = cm.options.mode;

        if ((typeof cmMode) !== "string") {
            cmMode = cm.options.mode.name;
        }

        if (MODES.indexOf(cmMode) !== -1) {                
            cm.removeOverlay(overlay);
            cm.addOverlay(overlay);
            cm.on("update", tag_color_change);
        }
    }

    // Initialize extension
    AppInit.appReady(function() {
        MainViewManager.on("currentFileChange", updateUI);
        ExtensionUtils.loadStyleSheet(module, "main.less");
    });
});