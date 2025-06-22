// src/id.ts
var idCounter = 0;
function generateId(prefix = "stellarix") {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}
function generateUniqueId() {
  return generateId("sx");
}
function generateComponentId(componentName) {
  return generateId(componentName.toLowerCase());
}
function generateAriaId(prefix = "aria") {
  return generateId(prefix);
}

// src/dom.ts
var isBrowser = () => typeof window !== "undefined";
function getElementById(id) {
  return isBrowser() ? document.getElementById(id) : null;
}
function focusElement(element) {
  if (element && typeof element.focus === "function") {
    try {
      element.focus();
      return document.activeElement === element;
    } catch (e) {
      return false;
    }
  }
  return false;
}
function createElement(tagName, attributes = {}) {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}
function addGlobalEventListener(eventName, handler, options) {
  if (!isBrowser())
    return () => {
    };
  window.addEventListener(eventName, handler, options);
  return () => {
    window.removeEventListener(eventName, handler, options);
  };
}

// src/accessibility.ts
var AriaRole = /* @__PURE__ */ ((AriaRole2) => {
  AriaRole2["Button"] = "button";
  AriaRole2["Checkbox"] = "checkbox";
  AriaRole2["Dialog"] = "dialog";
  AriaRole2["ListBox"] = "listbox";
  AriaRole2["Menu"] = "menu";
  AriaRole2["MenuItem"] = "menuitem";
  AriaRole2["Option"] = "option";
  AriaRole2["Switch"] = "switch";
  AriaRole2["Tab"] = "tab";
  AriaRole2["TabList"] = "tablist";
  AriaRole2["TabPanel"] = "tabpanel";
  AriaRole2["Toolbar"] = "toolbar";
  return AriaRole2;
})(AriaRole || {});
function getButtonA11yProps(isPressed, isDisabled) {
  return {
    role: "button" /* Button */,
    "aria-pressed": isPressed ? "true" : void 0,
    "aria-disabled": isDisabled ? "true" : void 0
  };
}
function getCheckboxA11yProps(checked, isDisabled) {
  return {
    role: "checkbox" /* Checkbox */,
    "aria-checked": typeof checked === "boolean" ? String(checked) : void 0,
    "aria-disabled": isDisabled ? "true" : void 0
  };
}
function getFirstFocusableElement(container) {
  if (!isBrowser() || !container)
    return null;
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return focusableElements.length > 0 ? focusableElements[0] : null;
}
function createFocusTrap(container) {
  if (!isBrowser() || !container) {
    return {
      activate: () => {
      },
      deactivate: () => {
      }
    };
  }
  let previouslyFocusedElement = null;
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const handleKeyDown = (event) => {
    if (event.key !== "Tab")
      return;
    if (!firstElement || !lastElement)
      return;
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  };
  return {
    activate: () => {
      previouslyFocusedElement = document.activeElement;
      container.addEventListener("keydown", handleKeyDown);
      if (firstElement) {
        firstElement.focus();
      }
    },
    deactivate: () => {
      container.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }
  };
}
function announceToScreenReader(message, priority = "polite") {
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", priority);
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  announcer.style.cssText = `
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `;
  document.body.appendChild(announcer);
  announcer.textContent = message;
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer);
    }
  }, 1e3);
}

// src/object.ts
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(
            target[key],
            source[key]
          );
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
function isObject(item) {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}
function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}
function pick(obj, keys) {
  const result = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}
function memoize(fn) {
  const cache = /* @__PURE__ */ new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
function isEmpty(value) {
  if (value == null)
    return true;
  if (Array.isArray(value) || typeof value === "string")
    return value.length === 0;
  if (isObject(value))
    return Object.keys(value).length === 0;
  return false;
}

// src/index.ts
var VERSION = "0.0.1";
export {
  AriaRole,
  VERSION,
  addGlobalEventListener,
  announceToScreenReader,
  createElement,
  createFocusTrap,
  deepMerge,
  focusElement,
  generateAriaId,
  generateComponentId,
  generateId,
  generateUniqueId,
  getButtonA11yProps,
  getCheckboxA11yProps,
  getElementById,
  getFirstFocusableElement,
  isBrowser,
  isEmpty,
  isObject,
  memoize,
  omit,
  pick
};
//# sourceMappingURL=index.mjs.map