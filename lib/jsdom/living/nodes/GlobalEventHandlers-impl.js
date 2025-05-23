"use strict";

const { appendHandler, createEventAccessor } = require("../helpers/create-event-accessor");

// Must be kept in sync with GlobalEventHandlers.webidl.
const events = new Set([
  "abort",
  "auxclick",
  "beforeinput",
  "beforematch",
  "beforetoggle",
  "blur",
  "cancel",
  "canplay",
  "canplaythrough",
  "change",
  "click",
  "close",
  "contextlost",
  "contextmenu",
  "contextrestored",
  "copy",
  "cuechange",
  "cut",
  "dblclick",
  "drag",
  "dragend",
  "dragenter",
  "dragleave",
  "dragover",
  "dragstart",
  "drop",
  "durationchange",
  "emptied",
  "ended",
  "error",
  "focus",
  "formdata",
  "input",
  "invalid",
  "keydown",
  "keypress",
  "keyup",
  "load",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "paste",
  "pause",
  "play",
  "playing",
  "progress",
  "ratechange",
  "reset",
  "resize",
  "scroll",
  "scrollend",
  "securitypolicyviolation",
  "seeked",
  "seeking",
  "select",
  "slotchange",
  "stalled",
  "submit",
  "suspend",
  "timeupdate",
  "toggle",
  "volumechange",
  "waiting",
  "webkitanimationend",
  "webkitanimationiteration",
  "webkitanimationstart",
  "webkittransitionend",
  "wheel",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "pointerover",
  "pointerenter",
  "pointerdown",
  "pointermove",
  "pointerrawupdate",
  "pointerup",
  "pointercancel",
  "pointerout",
  "pointerleave",
  "gotpointercapture",
  "lostpointercapture"
]);

class GlobalEventHandlersImpl {
  _initGlobalEvents() {
    this._registeredHandlers = new Set();
    this._eventHandlers = Object.create(null);
  }

  _getEventHandlerTarget() {
    return this;
  }

  _getEventHandlerFor(event) {
    const target = this._getEventHandlerTarget(event);
    if (!target) {
      return null;
    }

    return target._eventHandlers[event];
  }

  _setEventHandlerFor(event, handler) {
    const target = this._getEventHandlerTarget(event);
    if (!target) {
      return;
    }

    if (!target._registeredHandlers.has(event) && handler !== null) {
      target._registeredHandlers.add(event);
      appendHandler(target, event);
    }
    target._eventHandlers[event] = handler;
  }

  _globalEventChanged(event) {
    const propName = "on" + event;
    if (!(propName in this)) {
      return;
    }

    // Only translate attribute changes into properties when runScripts: "dangerously" is set.
    // Documents without a browsing context (i.e. without a _defaultView) never run scripts.
    const runScripts = "_runScripts" in this ? this._runScripts : (this._ownerDocument._defaultView || {})._runScripts;
    if (runScripts !== "dangerously") {
      return;
    }

    const val = this.getAttributeNS(null, propName);
    const handler = val === null ? null : { body: val };
    this._setEventHandlerFor(event, handler);
  }
}

for (const event of events) {
  createEventAccessor(GlobalEventHandlersImpl.prototype, event);
}

module.exports = {
  implementation: GlobalEventHandlersImpl,
  events
};
