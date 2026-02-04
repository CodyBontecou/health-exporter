const numberAsInset = value => ({
  left: value,
  right: value,
  top: value,
  bottom: value
});

const addInsets = (a, b) => {
  var _a$left, _b$left, _a$right, _b$right, _a$top, _b$top, _a$bottom, _b$bottom;

  return {
    left: ((_a$left = a.left) !== null && _a$left !== void 0 ? _a$left : 0) + ((_b$left = b.left) !== null && _b$left !== void 0 ? _b$left : 0),
    right: ((_a$right = a.right) !== null && _a$right !== void 0 ? _a$right : 0) + ((_b$right = b.right) !== null && _b$right !== void 0 ? _b$right : 0),
    top: ((_a$top = a.top) !== null && _a$top !== void 0 ? _a$top : 0) + ((_b$top = b.top) !== null && _b$top !== void 0 ? _b$top : 0),
    bottom: ((_a$bottom = a.bottom) !== null && _a$bottom !== void 0 ? _a$bottom : 0) + ((_b$bottom = b.bottom) !== null && _b$bottom !== void 0 ? _b$bottom : 0)
  };
};

const touchDataToPressEvent = (data, timestamp, targetId) => ({
  identifier: data.id,
  locationX: data.x,
  locationY: data.y,
  pageX: data.absoluteX,
  pageY: data.absoluteY,
  target: targetId,
  timestamp: timestamp,
  touches: [],
  // Always empty - legacy compatibility
  changedTouches: [] // Always empty - legacy compatibility

});

const gestureToPressEvent = (event, timestamp, targetId) => ({
  identifier: event.handlerTag,
  locationX: event.x,
  locationY: event.y,
  pageX: event.absoluteX,
  pageY: event.absoluteY,
  target: targetId,
  timestamp: timestamp,
  touches: [],
  // Always empty - legacy compatibility
  changedTouches: [] // Always empty - legacy compatibility

});

const isTouchWithinInset = (dimensions, inset, touch) => {
  var _touch$x, _inset$right, _touch$y, _inset$bottom, _touch$x2, _inset$left, _touch$y2, _inset$top;

  return ((_touch$x = touch === null || touch === void 0 ? void 0 : touch.x) !== null && _touch$x !== void 0 ? _touch$x : 0) < ((_inset$right = inset.right) !== null && _inset$right !== void 0 ? _inset$right : 0) + dimensions.width && ((_touch$y = touch === null || touch === void 0 ? void 0 : touch.y) !== null && _touch$y !== void 0 ? _touch$y : 0) < ((_inset$bottom = inset.bottom) !== null && _inset$bottom !== void 0 ? _inset$bottom : 0) + dimensions.height && ((_touch$x2 = touch === null || touch === void 0 ? void 0 : touch.x) !== null && _touch$x2 !== void 0 ? _touch$x2 : 0) > -((_inset$left = inset.left) !== null && _inset$left !== void 0 ? _inset$left : 0) && ((_touch$y2 = touch === null || touch === void 0 ? void 0 : touch.y) !== null && _touch$y2 !== void 0 ? _touch$y2 : 0) > -((_inset$top = inset.top) !== null && _inset$top !== void 0 ? _inset$top : 0);
};

const gestureToPressableEvent = event => {
  const timestamp = Date.now(); // As far as I can see, there isn't a conventional way of getting targetId with the data we get

  const targetId = 0;
  const pressEvent = gestureToPressEvent(event, timestamp, targetId);
  return {
    nativeEvent: {
      touches: [pressEvent],
      changedTouches: [pressEvent],
      identifier: pressEvent.identifier,
      locationX: event.x,
      locationY: event.y,
      pageX: event.absoluteX,
      pageY: event.absoluteY,
      target: targetId,
      timestamp: timestamp,
      force: undefined
    }
  };
};

const gestureTouchToPressableEvent = event => {
  var _event$allTouches$at$, _event$allTouches$at, _event$allTouches$at$2, _event$allTouches$at2, _event$allTouches$at$3, _event$allTouches$at3, _event$allTouches$at$4, _event$allTouches$at4;

  const timestamp = Date.now(); // As far as I can see, there isn't a conventional way of getting targetId with the data we get

  const targetId = 0;
  const touchesList = event.allTouches.map(touch => touchDataToPressEvent(touch, timestamp, targetId));
  const changedTouchesList = event.changedTouches.map(touch => touchDataToPressEvent(touch, timestamp, targetId));
  return {
    nativeEvent: {
      touches: touchesList,
      changedTouches: changedTouchesList,
      identifier: event.handlerTag,
      locationX: (_event$allTouches$at$ = (_event$allTouches$at = event.allTouches.at(0)) === null || _event$allTouches$at === void 0 ? void 0 : _event$allTouches$at.x) !== null && _event$allTouches$at$ !== void 0 ? _event$allTouches$at$ : -1,
      locationY: (_event$allTouches$at$2 = (_event$allTouches$at2 = event.allTouches.at(0)) === null || _event$allTouches$at2 === void 0 ? void 0 : _event$allTouches$at2.y) !== null && _event$allTouches$at$2 !== void 0 ? _event$allTouches$at$2 : -1,
      pageX: (_event$allTouches$at$3 = (_event$allTouches$at3 = event.allTouches.at(0)) === null || _event$allTouches$at3 === void 0 ? void 0 : _event$allTouches$at3.absoluteX) !== null && _event$allTouches$at$3 !== void 0 ? _event$allTouches$at$3 : -1,
      pageY: (_event$allTouches$at$4 = (_event$allTouches$at4 = event.allTouches.at(0)) === null || _event$allTouches$at4 === void 0 ? void 0 : _event$allTouches$at4.absoluteY) !== null && _event$allTouches$at$4 !== void 0 ? _event$allTouches$at$4 : -1,
      target: targetId,
      timestamp: timestamp,
      force: undefined
    }
  };
};

export { numberAsInset, addInsets, isTouchWithinInset, gestureToPressableEvent, gestureTouchToPressableEvent };
//# sourceMappingURL=utils.js.map