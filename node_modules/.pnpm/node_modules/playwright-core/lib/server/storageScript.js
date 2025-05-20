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
var storageScript_exports = {};
__export(storageScript_exports, {
  collect: () => collect,
  restore: () => restore
});
module.exports = __toCommonJS(storageScript_exports);
async function collect(serializersSource, builtins, isFirefox, recordIndexedDB) {
  const { serializeAsCallArgument } = serializersSource(builtins);
  async function collectDB(dbInfo) {
    if (!dbInfo.name)
      throw new Error("Database name is empty");
    if (!dbInfo.version)
      throw new Error("Database version is unset");
    function idbRequestToPromise(request) {
      return new Promise((resolve, reject) => {
        request.addEventListener("success", () => resolve(request.result));
        request.addEventListener("error", () => reject(request.error));
      });
    }
    function isPlainObject(v) {
      const ctor = v?.constructor;
      if (isFirefox) {
        const constructorImpl = ctor?.toString();
        if (constructorImpl?.startsWith("function Object() {") && constructorImpl?.includes("[native code]"))
          return true;
      }
      return ctor === Object;
    }
    function trySerialize(value) {
      let trivial = true;
      const encoded = serializeAsCallArgument(value, (v) => {
        const isTrivial = isPlainObject(v) || Array.isArray(v) || typeof v === "string" || typeof v === "number" || typeof v === "boolean" || Object.is(v, null);
        if (!isTrivial)
          trivial = false;
        return { fallThrough: v };
      });
      if (trivial)
        return { trivial: value };
      return { encoded };
    }
    const db = await idbRequestToPromise(indexedDB.open(dbInfo.name));
    const transaction = db.transaction(db.objectStoreNames, "readonly");
    const stores = await Promise.all([...db.objectStoreNames].map(async (storeName) => {
      const objectStore = transaction.objectStore(storeName);
      const keys = await idbRequestToPromise(objectStore.getAllKeys());
      const records = await Promise.all(keys.map(async (key) => {
        const record = {};
        if (objectStore.keyPath === null) {
          const { encoded: encoded2, trivial: trivial2 } = trySerialize(key);
          if (trivial2)
            record.key = trivial2;
          else
            record.keyEncoded = encoded2;
        }
        const value = await idbRequestToPromise(objectStore.get(key));
        const { encoded, trivial } = trySerialize(value);
        if (trivial)
          record.value = trivial;
        else
          record.valueEncoded = encoded;
        return record;
      }));
      const indexes = [...objectStore.indexNames].map((indexName) => {
        const index = objectStore.index(indexName);
        return {
          name: index.name,
          keyPath: typeof index.keyPath === "string" ? index.keyPath : void 0,
          keyPathArray: Array.isArray(index.keyPath) ? index.keyPath : void 0,
          multiEntry: index.multiEntry,
          unique: index.unique
        };
      });
      return {
        name: storeName,
        records,
        indexes,
        autoIncrement: objectStore.autoIncrement,
        keyPath: typeof objectStore.keyPath === "string" ? objectStore.keyPath : void 0,
        keyPathArray: Array.isArray(objectStore.keyPath) ? objectStore.keyPath : void 0
      };
    }));
    return {
      name: dbInfo.name,
      version: dbInfo.version,
      stores
    };
  }
  return {
    localStorage: Object.keys(localStorage).map((name) => ({ name, value: localStorage.getItem(name) })),
    indexedDB: recordIndexedDB ? await Promise.all((await indexedDB.databases()).map(collectDB)).catch((e) => {
      throw new Error("Unable to serialize IndexedDB: " + e.message);
    }) : void 0
  };
}
async function restore(serializersSource, builtins, originState) {
  const { parseEvaluationResultValue } = serializersSource(builtins);
  for (const { name, value } of originState.localStorage || [])
    localStorage.setItem(name, value);
  await Promise.all((originState.indexedDB ?? []).map(async (dbInfo) => {
    const openRequest = indexedDB.open(dbInfo.name, dbInfo.version);
    openRequest.addEventListener("upgradeneeded", () => {
      const db2 = openRequest.result;
      for (const store of dbInfo.stores) {
        const objectStore = db2.createObjectStore(store.name, { autoIncrement: store.autoIncrement, keyPath: store.keyPathArray ?? store.keyPath });
        for (const index of store.indexes)
          objectStore.createIndex(index.name, index.keyPathArray ?? index.keyPath, { unique: index.unique, multiEntry: index.multiEntry });
      }
    });
    function idbRequestToPromise(request) {
      return new Promise((resolve, reject) => {
        request.addEventListener("success", () => resolve(request.result));
        request.addEventListener("error", () => reject(request.error));
      });
    }
    const db = await idbRequestToPromise(openRequest);
    const transaction = db.transaction(db.objectStoreNames, "readwrite");
    await Promise.all(dbInfo.stores.map(async (store) => {
      const objectStore = transaction.objectStore(store.name);
      await Promise.all(store.records.map(async (record) => {
        await idbRequestToPromise(
          objectStore.add(
            record.value ?? parseEvaluationResultValue(record.valueEncoded),
            record.key ?? parseEvaluationResultValue(record.keyEncoded)
          )
        );
      }));
    }));
  })).catch((e) => {
    throw new Error("Unable to restore IndexedDB: " + e.message);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collect,
  restore
});
