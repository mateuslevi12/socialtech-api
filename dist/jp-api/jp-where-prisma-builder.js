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

// src/jp-api/jp-where-prisma-builder.ts
var jp_where_prisma_builder_exports = {};
__export(jp_where_prisma_builder_exports, {
  JPWherePrismaBuilder: () => JPWherePrismaBuilder,
  WhereOperatorEnum: () => WhereOperatorEnum
});
module.exports = __toCommonJS(jp_where_prisma_builder_exports);
var JPWherePrismaBuilder = class {
  constructor() {
    this.jpWhereFields = {};
  }
  addFilter(key, value, operator) {
    if (!value) {
      return this;
    }
    const jpWherePrisma = new JPWhereField(key, value, operator);
    this.jpWhereFields[key] = jpWherePrisma.builder();
    return this;
  }
  addCustomerFilter(jpWhere = {}, value) {
    if (!value) {
      return this;
    }
    this.jpWhereFields = Object.assign(this.jpWhereFields, jpWhere);
    return this;
  }
  builder() {
    return this.jpWhereFields;
  }
};
var JPWhereField = class {
  constructor(key, value, operator) {
    this.key = key;
    this.value = value;
    this.operator = operator;
  }
  builder() {
    if (!this.value) return;
    if (this.operator === 0 /* HAS */)
      return {
        has: this.value
      };
    if (this.operator === 1 /* HAS_SOME */)
      return {
        hasSome: this.value
      };
  }
};
var WhereOperatorEnum = /* @__PURE__ */ ((WhereOperatorEnum2) => {
  WhereOperatorEnum2[WhereOperatorEnum2["HAS"] = 0] = "HAS";
  WhereOperatorEnum2[WhereOperatorEnum2["HAS_SOME"] = 1] = "HAS_SOME";
  return WhereOperatorEnum2;
})(WhereOperatorEnum || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JPWherePrismaBuilder,
  WhereOperatorEnum
});
