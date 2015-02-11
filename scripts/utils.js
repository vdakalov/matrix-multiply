window.each = function(obj, context, handler) {
    var index, item, name, _ref, _ref1;
    index = 0;
    if (arguments.length === 1) {
        _ref = [obj, this, null], handler = _ref[0], obj = _ref[1], context = _ref[2];
    }
    if (arguments.length === 2) {
        _ref1 = [context, null], handler = _ref1[0], context = _ref1[1];
    }
    if (typeof obj === 'object' && obj !== null && typeof handler === 'function') {
        for (name in obj) {
            if (obj.hasOwnProperty(name) &&
              (name !== 'length' || !(obj instanceof Array || obj instanceof NodeList))) {
                item = obj[name];
                if (context) {
                    handler.call(context, item, name, index++);
                } else {
                    handler(item, name, index++);
                }
            }
        }
    }
    return obj;
};

window.grep = function(obj, context, handler) {
    var isArr, list, _ref, _ref1;
    if (arguments.length === 1) {
        _ref = [obj, this, null], handler = _ref[0], obj = _ref[1], context = _ref[2];
    }
    if (arguments.length === 2) {
        _ref1 = [context, null], handler = _ref1[0], context = _ref1[1];
    }
    isArr = obj instanceof Array;
    list = isArr ? [] : {};
    each(obj, context, function(value, key, index) {
        if (handler.call(context, value, key, index) !== false) {
            if (isArr) {
                return list.push(value);
            } else {
                return list[key] = value;
            }
        }
    });
    return list;
};

window.collect = function(obj, context, handler) {
    var isArr, list, _ref, _ref1;
    if (arguments.length === 1) {
        _ref = [obj, this, null], handler = _ref[0], obj = _ref[1], context = _ref[2];
    }
    if (arguments.length === 2) {
        _ref1 = [context, null], handler = _ref1[0], context = _ref1[1];
    }
    isArr = obj instanceof Array;
    list = isArr ? [] : {};
    each(obj, context, function(value, key, index) {
        var result;
        result = context ? handler.call(context, value, key, index) : handler(value, key, index);
        if (result !== false) {
            return list[key] = result;
        }
    });
    return list;
};

window.collectEntries = function(obj, context, handler) {
    var list, _ref, _ref1;
    if (arguments.length === 1) {
        _ref = [obj, this, null], handler = _ref[0], obj = _ref[1], context = _ref[2];
    }
    if (arguments.length === 2) {
        _ref1 = [context, null], handler = _ref1[0], context = _ref1[1];
    }
    list = {};
    each(obj, context, function(value, key, index) {
        var result;
        result = context ? handler.call(context, value, key, index) : handler(value, key, index);
        if (result !== false) {
            return list[result[0]] = result[1];
        }
    });
    return list;
};

window.repeat = function(number, context, handler) {
    var list, _i, _ref, _ref1, _ref2, _results;
    if (arguments.length === 1) {
        _ref = [number, this, null], handler = _ref[0], number = _ref[1], context = _ref[2];
    }
    if (arguments.length === 2) {
        _ref1 = [context, null], handler = _ref1[0], context = _ref1[1];
    }
    list = [];
    each((function() {
        _results = [];
        for (var _i = 0, _ref2 = number - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; 0 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
        return _results;
    }).apply(this), context, function(value, key, index) {
        var result;
        result = context ? handler.call(context, value, key, index) : handler(value, key, index);
        if (result !== false) {
            return list.push(result);
        }
    });
    return list;
};

window.bind = function(el, eventName, handler) {
    if (window.addEventListener) {
        el.addEventListener(eventName, handler, false);
    } else {
        el.attachEvent("on" + eventName, handler);
    }
};

window.query = function(selector, all){
    var fnc = all ? 'querySelectorAll': 'querySelector';
    if (fnc in document) {
        return document[fnc](selector);
    }

    var prefix = selector.substr(0, 1),
        name = selector.substr(1),
        result;

    switch (prefix) {
        case ".": result = document.getElementsByClassName(name); break;
        case "#": result = document.getElementById(name); break;
        default : result = document.getElementsByTagName(name); break;
    }

    if (result && !all) {
        result = result.item(0);
    }

    return  result;
};

window.addClass = function(el, name){
    removeClass(el, name);
    el.className += " " + name;
};

window.removeClass = function(el, name){
    var re = new RegExp("(^"+name+"\\s+|\\s+"+name+"$|\\s+"+name+")", "g");
    el.className = (el.className || "").replace(re, "");
};