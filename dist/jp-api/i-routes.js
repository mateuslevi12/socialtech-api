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

// src/jp-api/i-routes.ts
var i_routes_exports = {};
__export(i_routes_exports, {
  VerboHTTPType: () => VerboHTTPType
});
module.exports = __toCommonJS(i_routes_exports);
var VerboHTTPType = /* @__PURE__ */ ((VerboHTTPType2) => {
  VerboHTTPType2["GET"] = "get";
  VerboHTTPType2["POST"] = "post";
  VerboHTTPType2["PUT"] = "put";
  VerboHTTPType2["DELETE"] = "delete";
  return VerboHTTPType2;
})(VerboHTTPType || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VerboHTTPType
});
