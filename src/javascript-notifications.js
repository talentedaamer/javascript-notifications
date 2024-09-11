/*
 * Module Type:     JavaScript Module
 * Module Version:  v1.0.1
 * Module Name:     javascript-notifications
 * Author Name:     Aamer Shahzad
 * Author Email:    talentedaamer@gmail.com
 * Module URL:      https://talentedaamer.github.io/javascript-notifications/
 * Github URL:      https://github.com/talentedaamer/javascript-notifications/
 * License Type:    MIT License
 * License URL:     https://github.com/talentedaamer/javascript-notifications/blob/main/LICENSE
 *
 * Copyright        2024 javascript-notifications
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Expose the factory function for CommonJS-like environments.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.javascriptNotifications = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    var color_bg = '#ffffff';
    var color_text = '#323330';
    var color_btn_bg = '';
    var color_btn_text = '';

    var notification_container;
    var notification_element;
    var notification_id = 0;
    var notification_content;

    const notificationType = Object.freeze({
        STANDARD: 'standard',
        WARNING: 'warning',
        SUCCESS: 'success',
        ERROR: 'error',
        INFO: 'info',
    });

    var notification = {
        getContainer: getContainer,
        options: {},
        clear: clear,
        remove: remove,
        subscribe: subscribe,
        standard: standard,
        warning: warning,
        success: success,
        error: error,
        info: info,
    };

    var settings = Object.assign({}, getOptions(), notification.options);

    function getOptions() {
        return {
            title: '',
            content: '',
            titleClass: 'jsn-title',
            contentClass: 'jsn-message 01 class-1 !!_ ca!',
            iconClass: 'jsn-info 01 class-1 !!_ ca!',
            targetElement: 'body',
            containerId: 'jsn-container',
            containerClass: 'jsn-container 01 class-1 !!_ ca!',
            notificationClass: 'jsn-notification 01 class-1 !!_ ca!',
            positionClass: 'jsn-top-center 01 class-1 !!_ ca!',
            closeHtml: '<button type="button">&times;</button>',
            closeClass: 'toast-close-button 01 class-1 !!_ ca!',
            rtl: false
        }
    }

    function standard(title, content, optionsOverride) {
        return notify({
            type: notificationType.STANDARD,
            title: title,
            content: content,
            iconClass: 'jsn-error',
            optionsOverride: optionsOverride,
        });
    }

    function clear() {};
    function remove() {};
    function subscribe() {};

    function warning() {};
    function success() {};
    function error() {};
    function info() {};

    /**
     * create and return notifications container element
     *
     * @param options
     * @returns {HTMLDivElement}
     */
    function createContainer(options) {
        // create html element <div>
        var containerEl = document.createElement('div');

        // append id and classes to the element
        containerEl.id = options.containerId;
        // containerEl.classList.add(options.containerClass, options.positionClass);

        containerEl.style.padding       = '10px';
        containerEl.style.position      = 'fixed';
        containerEl.style.top           = '0px';
        containerEl.style.left          = '0px';
        containerEl.style.right         = '0px';
        containerEl.style.zIndex        = '1000';

        // find the targetElement in the dom
        const target = document.querySelector(options.targetElement);

        target.appendChild(containerEl);

        return containerEl;
    }

    function createHtmlElement(args = {}, target = null) {
        var defaults = {
            id: null,
            tag: 'div',
            classList: [],
            styleList: {}
        }
        var options = Object.assign({}, defaults, args);

        var id = options.id;
        var tag = options.tag;
        var classList = options.classList;
        var styleList = options.styleList;

        var element = document.createElement(tag);

        if (id) {
            element.id = id;
        }

        arrToClassList(classList).forEach(function (className) {
            element.classList.add(className);
        });

        if (styleList && typeof styleList === 'object' && !Array.isArray(styleList)) {
            var style_keys = Object.keys(styleList);
            style_keys.forEach(function (key, i) {
                var style_prop = style_keys[i];
                var style_value = styleList[style_prop];
                if (typeof style_prop === 'string' && isStringOrNumber(style_value)) {
                    if (style_prop in element.style) {
                        element.style[style_prop] = style_value;
                    }
                }
            });
        }

        if (target instanceof HTMLElement) {
            if (document.contains(target)) {
                target.appendChild(element);
            }
        }

        return element;
    }

    /**
     * get notifications container by options.containerId or
     * if create is true, create and return new notifications container
     *
     * @param options
     * @param create
     * @returns {HTMLElement}
     */
    function getContainer(options, create) {
        // find container by options.containerId
        var container = document.getElementById(options.containerId);

        // if container found return it
        if (container) {
            return container
        }

        // if create is true, create ne container
        if (create) {
            container = createContainer(options);
        }

        return container;
    }

    function strToBoolean(str) {
        if (strOrBool === true || strOrBool === 'true') {
            return true;
        }
        return false;
    }

    function strToArray(str, separator = " ") {
        var arr = [];
        if (typeof str === 'string') {
            arr = str.split(separator);
        }

        return arr;
    }

    function arrToClassList(arr) {
        var classList = [];
        if (Array.isArray(arr) && arr.length > 0) {
            arr.forEach( function (item) {
                if (isValidClassName(item)) {
                    classList.push(item);
                }
            });
        }

        return classList;
    }

    function isStringOrNumber(value) {
        return typeof value === 'string' || typeof value === 'number';
    }

    function isValidClassName(className) {
        return typeof className === 'string' && /^[a-zA-Z0-9-_]+$/.test(className);
    }

    function sanitize(text = '') {
        return text
            .replace(/&/g, '&amp;')    // Escape ampersand
            .replace(/"/g, '&quot;')   // Escape double quotes
            .replace(/'/g, '&#39;')    // Escape single quotes
            .replace(/</g, '&lt;')     // Escape less than sign
            .replace(/>/g, '&gt;')     // Escape greater than sign
            .replace(/\(/g, '&#40;')   // Escape opening parenthesis
            .replace(/\)/g, '&#41;')   // Escape closing parenthesis
            .replace(/\//g, '&#47;')   // Escape forward slash
            .replace(/\\/g, '&#92;');  // Escape backslash
    }

    function notify(args = {}) {
        var options = getOptions();

        var iconClass = args.iconClass || options.iconClass;

        if (typeof args.optionsOverride !== 'undefined') {
            options = Object.assign({}, options, args.optionsOverride);
            iconClass = args.optionsOverride.iconClass || iconClass;
        }

        if (args.content === notification_content) {
            return;
        } else {
            notification_content = args.content;
        }

        notification_id++;

        notification_container = getContainer(options, true);

        // notificationEl.style.background     = color_bg;
        // notificationEl.style.padding        = '15px';
        // notificationEl.style.margin         = '0 0 10px';
        // notificationEl.style.border         = '1px solid ' + color_text;
        // notificationEl.style.borderRadius   = '5px';
        // notificationEl.style.boxShadow      = '0 2px 6px rgba(0, 0, 0, 0.2)';

        // target.appendChild(notificationEl);

        // return notificationEl;

        notification_element = createHtmlElement({
            classList: strToArray(options.notificationClass),
            styleList: {
                background: color_bg,
                padding: '15px',
                margin: '0 0 10px',
                border: '1px solid ' + color_text,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }
        }, notification_container);

        console.log(">> notification_element", notification_element);

        // const userInput = '<script>alert("XSS attack!")</script>';
        // const safeText = sanitize(userInput);

        // console.log(">> regix", /^[a-zA-Z0-9-_]+$/.test('_class-name'));

        // var $toastElement = $('<div/>');
        // var $titleElement = $('<div/>');
        // var $messageElement = $('<div/>');
        // var $progressElement = $('<div/>');
        // var $closeElement = $(options.closeHtml);

        console.log(">> notification_container", notification_container);
        console.log(">> notification_element", notification_element);
    }

    return notification;

}));

