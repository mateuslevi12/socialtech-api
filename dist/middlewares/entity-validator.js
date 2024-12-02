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

// src/middlewares/entity-validator.ts
var entity_validator_exports = {};
__export(entity_validator_exports, {
  entityValidator: () => entityValidator
});
module.exports = __toCommonJS(entity_validator_exports);
function entityValidator(schema) {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }
    try {
      const data = schema.parse(req.body);
    } catch (err) {
      const zodError = err;
      console.log(err);
      const messages = zodError.errors.map((err2) => {
        const message = `${err2.path} ${err2.message}`;
        return message;
      });
      throw new Error(JSON.stringify(messages));
    }
    return next();
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  entityValidator
});
