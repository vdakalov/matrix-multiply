(function(){
    'use strict';

    var stateClassName = 'checked',
        buttons = query(".radio", true),
        groups = {};

    function createEvent(el, name) {
        var event;
        if (document.createEventObject) {
            event = document.createEvent("Event");
        } else {
            event = document.createEvent("HTMLEvents");
        }

        event.initEvent(name, true, true);
        el.dispatchEvent(event);
    }

    function setState(obj, value) {
        if (value !== undefined) {

            if (value === null) {
                obj.radio.checked = !obj.radio.checked;

            } else {
                obj.radio.checked = typeof value == "boolean" ? value : false;
            }

            removeClass(obj.el, stateClassName);

            if (obj.radio.checked) {
                addClass(obj.el, stateClassName);
            }

            // create event
            createEvent(obj.radio, "change");
        }
    }

    function state(obj, value) {

        if (obj.name !== null && obj.name in groups) {
            unCheckGroup(obj.name);
        }

        setState(obj, value);

        return obj.radio.checked;
    }

    function unCheckGroup(name) {
        each(groups[name], function(obj){
            setState(obj, false);
        });
    }

    // load radio buttons
    each(buttons, function(button){

        var radio = button.getElementsByTagName("input").item(0),
            name = radio ? radio.name : null,
            obj;

        if (!(name in groups)) {
            groups[name] = [];
        }

        obj = {
            el: button,
            name: name,
            radio: radio
        };

        groups[name].push(obj);

        setState(obj, radio.checked);

        // update state
        bind(button, "click", state.bind(this, obj, null));
        bind(button, "keypress", function(event){
            if (event.keyCode === 32) {
                state(obj, true);
            }
        });

    });

}());