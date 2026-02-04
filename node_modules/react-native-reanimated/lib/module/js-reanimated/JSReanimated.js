'use strict';

import { isChromeDebugger, isJest, isWeb, isWindowAvailable } from "../PlatformChecker.js";
import { SensorType } from "../commonTypes.js";
import { mockedRequestAnimationFrame } from "../mockedRequestAnimationFrame.js";
import { logger } from "../logger/index.js";
import { ReanimatedError } from "../errors.js";

// In Node.js environments (like when static rendering with Expo Router)
// requestAnimationFrame is unavailable, so we use our mock.
// It also has to be mocked for Jest purposes (see `initializeUIRuntime`).
const requestAnimationFrameImpl = isJest() || !globalThis.requestAnimationFrame ? mockedRequestAnimationFrame : globalThis.requestAnimationFrame;
export default class JSReanimated {
  nextSensorId = 0;
  sensors = new Map();
  platform = undefined;
  makeShareableClone() {
    throw new ReanimatedError('makeShareableClone should never be called in JSReanimated.');
  }
  scheduleOnUI(worklet) {
    // @ts-ignore web implementation has still not been updated after the rewrite, this will be addressed once the web implementation updates are ready
    requestAnimationFrameImpl(worklet);
  }
  createWorkletRuntime(_name, _initializer) {
    throw new ReanimatedError('createWorkletRuntime is not available in JSReanimated.');
  }
  scheduleOnRuntime() {
    throw new ReanimatedError('scheduleOnRuntime is not available in JSReanimated.');
  }
  registerEventHandler(_eventHandler, _eventName, _emitterReactTag) {
    throw new ReanimatedError('registerEventHandler is not available in JSReanimated.');
  }
  unregisterEventHandler(_) {
    throw new ReanimatedError('unregisterEventHandler is not available in JSReanimated.');
  }
  enableLayoutAnimations() {
    if (isWeb()) {
      logger.warn('Layout Animations are not supported on web yet.');
    } else if (isJest()) {
      logger.warn('Layout Animations are no-ops when using Jest.');
    } else if (isChromeDebugger()) {
      logger.warn('Layout Animations are no-ops when using Chrome Debugger.');
    } else {
      logger.warn('Layout Animations are not supported on this configuration.');
    }
  }
  configureLayoutAnimationBatch() {
    // no-op
  }
  setShouldAnimateExitingForTag() {
    // no-op
  }
  registerSensor(sensorType, interval, _iosReferenceFrame, eventHandler) {
    if (!isWindowAvailable()) {
      // the window object is unavailable when building the server portion of a site that uses SSG
      // this check is here to ensure that the server build won't fail
      return -1;
    }
    if (this.platform === undefined) {
      this.detectPlatform();
    }
    if (!(this.getSensorName(sensorType) in window)) {
      // https://w3c.github.io/sensors/#secure-context
      logger.warn('Sensor is not available.' + (isWeb() && location.protocol !== 'https:' ? ' Make sure you use secure origin with `npx expo start --web --https`.' : '') + (this.platform === Platform.WEB_IOS ? ' For iOS web, you will also have to also grant permission in the browser: https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2.' : ''));
      return -1;
    }
    if (this.platform === undefined) {
      this.detectPlatform();
    }
    const sensor = this.initializeSensor(sensorType, interval);
    sensor.addEventListener('reading', this.getSensorCallback(sensor, sensorType, eventHandler));
    sensor.start();
    this.sensors.set(this.nextSensorId, sensor);
    return this.nextSensorId++;
  }
  getSensorCallback = (sensor, sensorType, eventHandler) => {
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
      case SensorType.GRAVITY:
        return () => {
          let {
            x,
            y,
            z
          } = sensor;

          // Web Android sensors have a different coordinate system than iOS
          if (this.platform === Platform.WEB_ANDROID) {
            [x, y, z] = [-x, -y, -z];
          }
          // TODO TYPESCRIPT on web ShareableRef is the value itself so we call it directly
          eventHandler({
            x,
            y,
            z,
            interfaceOrientation: 0
          });
        };
      case SensorType.GYROSCOPE:
      case SensorType.MAGNETIC_FIELD:
        return () => {
          const {
            x,
            y,
            z
          } = sensor;
          // TODO TYPESCRIPT on web ShareableRef is the value itself so we call it directly
          eventHandler({
            x,
            y,
            z,
            interfaceOrientation: 0
          });
        };
      case SensorType.ROTATION:
        return () => {
          let [qw, qx, qy, qz] = sensor.quaternion;

          // Android sensors have a different coordinate system than iOS
          if (this.platform === Platform.WEB_ANDROID) {
            [qy, qz] = [qz, -qy];
          }

          // reference: https://stackoverflow.com/questions/5782658/extracting-yaw-from-a-quaternion
          const yaw = -Math.atan2(2.0 * (qy * qz + qw * qx), qw * qw - qx * qx - qy * qy + qz * qz);
          const pitch = Math.sin(-2.0 * (qx * qz - qw * qy));
          const roll = -Math.atan2(2.0 * (qx * qy + qw * qz), qw * qw + qx * qx - qy * qy - qz * qz);
          // TODO TYPESCRIPT on web ShareableRef is the value itself so we call it directly
          eventHandler({
            qw,
            qx,
            qy,
            qz,
            yaw,
            pitch,
            roll,
            interfaceOrientation: 0
          });
        };
    }
  };
  unregisterSensor(id) {
    const sensor = this.sensors.get(id);
    if (sensor !== undefined) {
      sensor.stop();
      this.sensors.delete(id);
    }
  }
  subscribeForKeyboardEvents(_) {
    if (isWeb()) {
      logger.warn('useAnimatedKeyboard is not available on web yet.');
    } else if (isJest()) {
      logger.warn('useAnimatedKeyboard is not available when using Jest.');
    } else if (isChromeDebugger()) {
      logger.warn('useAnimatedKeyboard is not available when using Chrome Debugger.');
    } else {
      logger.warn('useAnimatedKeyboard is not available on this configuration.');
    }
    return -1;
  }
  unsubscribeFromKeyboardEvents(_) {
    // noop
  }
  initializeSensor(sensorType, interval) {
    const config = interval <= 0 ? {
      referenceFrame: 'device'
    } : {
      frequency: 1000 / interval
    };
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
        return new window.Accelerometer(config);
      case SensorType.GYROSCOPE:
        return new window.Gyroscope(config);
      case SensorType.GRAVITY:
        return new window.GravitySensor(config);
      case SensorType.MAGNETIC_FIELD:
        return new window.Magnetometer(config);
      case SensorType.ROTATION:
        return new window.AbsoluteOrientationSensor(config);
    }
  }
  getSensorName(sensorType) {
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
        return 'Accelerometer';
      case SensorType.GRAVITY:
        return 'GravitySensor';
      case SensorType.GYROSCOPE:
        return 'Gyroscope';
      case SensorType.MAGNETIC_FIELD:
        return 'Magnetometer';
      case SensorType.ROTATION:
        return 'AbsoluteOrientationSensor';
    }
  }
  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent === undefined) {
      this.platform = Platform.UNKNOWN;
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.platform = Platform.WEB_IOS;
    } else if (/android/i.test(userAgent)) {
      this.platform = Platform.WEB_ANDROID;
    } else {
      this.platform = Platform.WEB;
    }
  }
  getViewProp(_viewTag, _propName, _component, _callback) {
    throw new ReanimatedError('getViewProp is not available in JSReanimated.');
  }
  configureProps() {
    throw new ReanimatedError('configureProps is not available in JSReanimated.');
  }
  executeOnUIRuntimeSync(_shareable) {
    throw new ReanimatedError('`executeOnUIRuntimeSync` is not available in JSReanimated.');
  }
}
var Platform = /*#__PURE__*/function (Platform) {
  Platform["WEB_IOS"] = "web iOS";
  Platform["WEB_ANDROID"] = "web Android";
  Platform["WEB"] = "web";
  Platform["UNKNOWN"] = "unknown";
  return Platform;
}(Platform || {});
//# sourceMappingURL=JSReanimated.js.map