"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var errorContext_exports = {};
__export(errorContext_exports, {
  attachErrorContext: () => attachErrorContext
});
module.exports = __toCommonJS(errorContext_exports);
var fs = __toESM(require("fs/promises"));
var path = __toESM(require("path"));
var import_utils = require("playwright-core/lib/utils");
var import_util = require("./util");
var import_babelBundle = require("./transform/babelBundle");
async function attachErrorContext(testInfo, format, sourceCache, ariaSnapshot) {
  if (format === "json") {
    if (!ariaSnapshot)
      return;
    testInfo._attach({
      name: `_error-context`,
      contentType: "application/json",
      body: Buffer.from(JSON.stringify({
        pageSnapshot: ariaSnapshot
      }))
    }, void 0);
    return;
  }
  const meaningfulSingleLineErrors = new Set(testInfo.errors.filter((e) => e.message && !e.message.includes("\n")).map((e) => e.message));
  for (const error of testInfo.errors) {
    for (const singleLineError of meaningfulSingleLineErrors.keys()) {
      if (error.message?.includes(singleLineError))
        meaningfulSingleLineErrors.delete(singleLineError);
    }
  }
  const errors = [...testInfo.errors.entries()].filter(([, error]) => {
    if (!error.message)
      return false;
    if (!error.message.includes("\n") && !meaningfulSingleLineErrors.has(error.message))
      return false;
    return true;
  });
  for (const [index, error] of errors) {
    const metadata = testInfo.config.metadata;
    if (testInfo.attachments.find((a) => a.name === `_error-context-${index}`))
      continue;
    const lines = [
      `# Test info`,
      "",
      `- Name: ${testInfo.titlePath.slice(1).join(" >> ")}`,
      `- Location: ${testInfo.file}:${testInfo.line}:${testInfo.column}`,
      "",
      "# Error details",
      "",
      "```",
      (0, import_util.stripAnsiEscapes)(error.stack || error.message || ""),
      "```"
    ];
    if (ariaSnapshot) {
      lines.push(
        "",
        "# Page snapshot",
        "",
        "```yaml",
        ariaSnapshot,
        "```"
      );
    }
    const parsedError = error.stack ? (0, import_utils.parseErrorStack)(error.stack, path.sep) : void 0;
    const inlineMessage = (0, import_util.stripAnsiEscapes)(parsedError?.message || error.message || "").split("\n")[0];
    const location = parsedError?.location || { file: testInfo.file, line: testInfo.line, column: testInfo.column };
    const source = await loadSource(location.file, sourceCache);
    const codeFrame = (0, import_babelBundle.codeFrameColumns)(
      source,
      {
        start: {
          line: location.line,
          column: location.column
        }
      },
      {
        highlightCode: false,
        linesAbove: 100,
        linesBelow: 100,
        message: inlineMessage || void 0
      }
    );
    lines.push(
      "",
      "# Test source",
      "",
      "```ts",
      codeFrame,
      "```"
    );
    if (metadata.gitDiff) {
      lines.push(
        "",
        "# Local changes",
        "",
        "```diff",
        metadata.gitDiff,
        "```"
      );
    }
    const filePath = testInfo.outputPath(errors.length === 1 ? `error-context.md` : `error-context-${index}.md`);
    await fs.writeFile(filePath, lines.join("\n"), "utf8");
    testInfo._attach({
      name: `_error-context-${index}`,
      contentType: "text/markdown",
      path: filePath
    }, void 0);
  }
}
async function loadSource(file, sourceCache) {
  let source = sourceCache.get(file);
  if (!source) {
    source = await fs.readFile(file, "utf8");
    sourceCache.set(file, source);
  }
  return source;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  attachErrorContext
});
