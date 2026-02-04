export let EventTypes;

(function (EventTypes) {
  EventTypes[EventTypes["DOWN"] = 0] = "DOWN";
  EventTypes[EventTypes["ADDITIONAL_POINTER_DOWN"] = 1] = "ADDITIONAL_POINTER_DOWN";
  EventTypes[EventTypes["UP"] = 2] = "UP";
  EventTypes[EventTypes["ADDITIONAL_POINTER_UP"] = 3] = "ADDITIONAL_POINTER_UP";
  EventTypes[EventTypes["MOVE"] = 4] = "MOVE";
  EventTypes[EventTypes["ENTER"] = 5] = "ENTER";
  EventTypes[EventTypes["LEAVE"] = 6] = "LEAVE";
  EventTypes[EventTypes["CANCEL"] = 7] = "CANCEL";
})(EventTypes || (EventTypes = {}));

export let TouchEventType;

(function (TouchEventType) {
  TouchEventType[TouchEventType["UNDETERMINED"] = 0] = "UNDETERMINED";
  TouchEventType[TouchEventType["DOWN"] = 1] = "DOWN";
  TouchEventType[TouchEventType["MOVE"] = 2] = "MOVE";
  TouchEventType[TouchEventType["UP"] = 3] = "UP";
  TouchEventType[TouchEventType["CANCELLED"] = 4] = "CANCELLED";
})(TouchEventType || (TouchEventType = {}));
//# sourceMappingURL=interfaces.js.map