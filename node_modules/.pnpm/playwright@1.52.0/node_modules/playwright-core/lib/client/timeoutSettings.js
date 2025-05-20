"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var timeoutSettings_exports = {};
__export(timeoutSettings_exports, {
  DEFAULT_LAUNCH_TIMEOUT: () => DEFAULT_LAUNCH_TIMEOUT,
  DEFAULT_TIMEOUT: () => DEFAULT_TIMEOUT,
  TimeoutSettings: () => TimeoutSettings
});
module.exports = __toCommonJS(timeoutSettings_exports);
const DEFAULT_TIMEOUT = 3e4;
const DEFAULT_LAUNCH_TIMEOUT = 3 * 60 * 1e3;
class TimeoutSettings {
  constructor(platform, parent) {
    this._parent = parent;
    this._platform = platform;
  }
  setDefaultTimeout(timeout) {
    this._defaultTimeout = timeout;
  }
  setDefaultNavigationTimeout(timeout) {
    this._defaultNavigationTimeout = timeout;
  }
  defaultNavigationTimeout() {
    return this._defaultNavigationTimeout;
  }
  defaultTimeout() {
    return this._defaultTimeout;
  }
  navigationTimeout(options) {
    if (typeof options.timeout === "number")
      return options.timeout;
    if (this._defaultNavigationTimeout !== void 0)
      return this._defaultNavigationTimeout;
    if (this._platform.isDebugMode())
      return 0;
    if (this._defaultTimeout !== void 0)
      return this._defaultTimeout;
    if (this._parent)
      return this._parent.navigationTimeout(options);
    return DEFAULT_TIMEOUT;
  }
  timeout(options) {
    if (typeof options.timeout === "number")
      return options.timeout;
    if (this._platform.isDebugMode())
      return 0;
    if (this._defaultTimeout !== void 0)
      return this._defaultTimeout;
    if (this._parent)
      return this._parent.timeout(options);
    return DEFAULT_TIMEOUT;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_LAUNCH_TIMEOUT,
  DEFAULT_TIMEOUT,
  TimeoutSettings
});
