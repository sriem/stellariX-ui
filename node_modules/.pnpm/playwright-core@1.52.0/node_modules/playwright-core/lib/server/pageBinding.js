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
var pageBinding_exports = {};
__export(pageBinding_exports, {
  createPageBindingScript: () => createPageBindingScript,
  deliverBindingResult: () => deliverBindingResult,
  takeBindingHandle: () => takeBindingHandle
});
module.exports = __toCommonJS(pageBinding_exports);
var import_builtins = require("../utils/isomorphic/builtins");
var import_utilityScriptSerializers = require("../utils/isomorphic/utilityScriptSerializers");
function addPageBinding(playwrightBinding, bindingName, needsHandle, utilityScriptSerializersFactory, builtins2) {
  const { serializeAsCallArgument } = utilityScriptSerializersFactory(builtins2);
  const binding = globalThis[playwrightBinding];
  globalThis[bindingName] = (...args) => {
    const me = globalThis[bindingName];
    if (needsHandle && args.slice(1).some((arg) => arg !== void 0))
      throw new Error(`exposeBindingHandle supports a single argument, ${args.length} received`);
    let callbacks = me["callbacks"];
    if (!callbacks) {
      callbacks = new builtins2.Map();
      me["callbacks"] = callbacks;
    }
    const seq = (me["lastSeq"] || 0) + 1;
    me["lastSeq"] = seq;
    let handles = me["handles"];
    if (!handles) {
      handles = new builtins2.Map();
      me["handles"] = handles;
    }
    const promise = new Promise((resolve, reject) => callbacks.set(seq, { resolve, reject }));
    let payload;
    if (needsHandle) {
      handles.set(seq, args[0]);
      payload = { name: bindingName, seq };
    } else {
      const serializedArgs = [];
      for (let i = 0; i < args.length; i++) {
        serializedArgs[i] = serializeAsCallArgument(args[i], (v) => {
          return { fallThrough: v };
        });
      }
      payload = { name: bindingName, seq, serializedArgs };
    }
    binding(JSON.stringify(payload));
    return promise;
  };
  globalThis[bindingName].__installed = true;
}
function takeBindingHandle(arg) {
  const handles = globalThis[arg.name]["handles"];
  const handle = handles.get(arg.seq);
  handles.delete(arg.seq);
  return handle;
}
function deliverBindingResult(arg) {
  const callbacks = globalThis[arg.name]["callbacks"];
  if ("error" in arg)
    callbacks.get(arg.seq).reject(arg.error);
  else
    callbacks.get(arg.seq).resolve(arg.result);
  callbacks.delete(arg.seq);
}
function createPageBindingScript(playwrightBinding, name, needsHandle) {
  return `(${addPageBinding.toString()})(${JSON.stringify(playwrightBinding)}, ${JSON.stringify(name)}, ${needsHandle}, (${import_utilityScriptSerializers.source}), (${import_builtins.builtins})())`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPageBindingScript,
  deliverBindingResult,
  takeBindingHandle
});
