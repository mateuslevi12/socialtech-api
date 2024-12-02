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

// src/middlewares/error-handler.ts
var error_handler_exports = {};
__export(error_handler_exports, {
  AppError: () => AppError,
  default: () => error_handler_default
});
module.exports = __toCommonJS(error_handler_exports);
var import_zod = require("zod");
var import_client = require("@prisma/client");

// src/utils/express-app-response.ts
function ExpressAppResponse(res) {
  return new _ExpressAppResponse(res);
}
var _ExpressAppResponse = class {
  constructor(res) {
    this.res = res;
  }
  unauthorized(data, message) {
    return this.res.status(401).send({
      status: "error",
      message,
      data
    });
  }
  not_found(data) {
    return this.res.status(404).send({
      status: "error",
      message: "not found",
      data
    });
  }
  created(data) {
    return this.res.status(404).send({
      status: "success",
      message: "created",
      data
    });
  }
  success(data, message) {
    return this.res.status(200).send({
      status: "success",
      message,
      data
    });
  }
  error(status, message, data) {
    return this.res.status(status).send({
      status: "error",
      message,
      data
    });
  }
};

// src/middlewares/error-handler.ts
function errorHandler(err, req, res, next) {
  console.log("Error: " + err.message);
  if (err instanceof AppError) {
    const appError = err;
    return ExpressAppResponse(res).error(appError.status, appError.message);
  } else if (err instanceof import_zod.ZodError) {
    return ExpressAppResponse(res).error(500, err.message);
  } else if (err instanceof import_client.Prisma.PrismaClientKnownRequestError) {
    return ExpressAppResponse(res).error(500, "erro no banco de dados");
  } else {
    return ExpressAppResponse(res).error(500, err.message);
  }
}
var error_handler_default = errorHandler;
var AppError = class {
  constructor(message, status) {
    this.message = message;
    this.status = status;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppError
});
