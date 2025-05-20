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
var builtins_exports = {};
__export(builtins_exports, {
  Date: () => Date,
  Intl: () => Intl,
  Map: () => Map,
  Set: () => Set,
  builtins: () => builtins,
  cancelAnimationFrame: () => cancelAnimationFrame,
  cancelIdleCallback: () => cancelIdleCallback,
  clearInterval: () => clearInterval,
  clearTimeout: () => clearTimeout,
  performance: () => performance,
  requestAnimationFrame: () => requestAnimationFrame,
  requestIdleCallback: () => requestIdleCallback,
  setInterval: () => setInterval,
  setTimeout: () => setTimeout
});
module.exports = __toCommonJS(builtins_exports);
function builtins(global) {
  global = global ?? globalThis;
  if (!global["__playwright_builtins__"]) {
    const builtins2 = {
      setTimeout: global.setTimeout?.bind(global),
      clearTimeout: global.clearTimeout?.bind(global),
      setInterval: global.setInterval?.bind(global),
      clearInterval: global.clearInterval?.bind(global),
      requestAnimationFrame: global.requestAnimationFrame?.bind(global),
      cancelAnimationFrame: global.cancelAnimationFrame?.bind(global),
      requestIdleCallback: global.requestIdleCallback?.bind(global),
      cancelIdleCallback: global.cancelIdleCallback?.bind(global),
      performance: global.performance,
      eval: global.eval?.bind(global),
      Intl: global.Intl,
      Date: global.Date,
      Map: global.Map,
      Set: global.Set
    };
    Object.defineProperty(global, "__playwright_builtins__", { value: builtins2, configurable: false, enumerable: false, writable: false });
  }
  return global["__playwright_builtins__"];
}
const instance = builtins();
const setTimeout = instance.setTimeout;
const clearTimeout = instance.clearTimeout;
const setInterval = instance.setInterval;
const clearInterval = instance.clearInterval;
const requestAnimationFrame = instance.requestAnimationFrame;
const cancelAnimationFrame = instance.cancelAnimationFrame;
const requestIdleCallback = instance.requestIdleCallback;
const cancelIdleCallback = instance.cancelIdleCallback;
const performance = instance.performance;
const Intl = instance.Intl;
const Date = instance.Date;
const Map = instance.Map;
const Set = instance.Set;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Date,
  Intl,
  Map,
  Set,
  builtins,
  cancelAnimationFrame,
  cancelIdleCallback,
  clearInterval,
  clearTimeout,
  performance,
  requestAnimationFrame,
  requestIdleCallback,
  setInterval,
  setTimeout
});
