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

    var content_element;
    var notification_content;
    var close_element;
    var notification_close;
    

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
            content: '',
            contentClass: 'jsn-message',
            positionClass: 'jsn-top-center',
            targetElement: 'body',
            containerId: 'jsn-container',
            containerClass: 'jsn-container',
            notificationClass: 'jsn-notification',
            closeHtml: '<button type="button">&times;</button>',
            closeClass: 'toast-close-button',
            rtl: false
        }
    }

    function standard(content, optionsOverride) {
        return notify({
            type: notificationType.STANDARD,
            content: content,
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



    function createHtmlElement(args = {}, id = null, target = null) {
        var defaults = {
            tag: 'div',
            classList: [],
            styleList: {}
        }
        var options = Object.assign({}, defaults, args);

        var tag = options.tag;
        var classList = options.classList;
        var styleList = options.styleList;

        var container = document.getElementById(id);
        if (container) {
            return container
        }

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

        if (typeof target === 'string') {
            target = document.querySelector(target);
        }
        
        if (target instanceof HTMLElement) {
            target.appendChild(element);
        }

        return element;
    }

    function createContainer(options) {
        return createHtmlElement({
            classList: strToArray(options.containerClass + ' ' + options.positionClass),
            styleList: {
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: '10px',
                position: 'fixed',
            }
        }, options.containerId, options.targetElement);
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

        return [...new Set(arr)];
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

        // var iconClass = args.iconClass || options.iconClass;

        if (typeof args.optionsOverride !== 'undefined') {
            options = Object.assign({}, options, args.optionsOverride);
            // iconClass = args.optionsOverride.iconClass || iconClass;
        }

        if (args.content === notification_content) {
            return;
        } else {
            notification_content = args.content;
        }

        notification_id++;
    
        // containerEl.classList.add(options.containerClass, options.positionClass);
        notification_container = createContainer(options);
        // console.log(">> 🍉", notification_container);
        
        notification_element = createHtmlElement({
            classList: strToArray(options.notificationClass),
            styleList: {
                background: color_bg,
                padding: '15px',
                margin: '0 0 10px',
                border: '1px solid ' + color_text,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }
        }, null, notification_container);

        // var content_wrap_element = createHtmlElement({
        //     classList: strToArray("jsn-title-content"),
        //     styleList: {
        //         width: '100%',
        //     }
        // }, null, notification_element);

        // if (args.title) {
        //     title_element = createHtmlElement({classList: strToArray(options.titleClass)}, null, content_wrap_element);
        //     title_element.append(args.title);
        // }

        if (args.content) {
            content_element = createHtmlElement({
                classList: strToArray(options.contentClass),
                styleList: {
                    width: '100%',
                }
            }, null, notification_element);
            content_element.append(args.content);
        }

        close_element = createHtmlElement({classList: strToArray(options.closeClass)}, null, notification_element);
        close_element.innerHTML = settings.closeHtml;

        console.log(">> 🍒", close_element.firstChild);

        close_element.firstChild.style.border = '0px'
        
        
        // close_element.addEventListener('click', function () {
        //     console.log(">> close", notification_id);
        // });
        // if (options.closeButton) {
        //     $closeElement.addClass(options.closeClass).attr('role', 'button');
        //     $toastElement.prepend($closeElement);
        // }
        // const userInput = '<script>alert("XSS attack!")</script>';
        // const safeText = sanitize(userInput);
        // var $progressElement = $('<div/>');
        // var $closeElement = $(options.closeHtml);
        // console.log(">> notification_container", notification_container);
        // console.log(">> notification_element", notification_element);
    }

    return notification;

}));

