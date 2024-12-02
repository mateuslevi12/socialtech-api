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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/modules/users/auth/auth.router.ts
var auth_router_exports = {};
__export(auth_router_exports, {
  AuthRouter: () => AuthRouter
});
module.exports = __toCommonJS(auth_router_exports);

// src/jp-api/router-builder.ts
var import_express = require("express");
var import_zod = require("zod");

// src/jp-api/utils/object-utils.ts
var ObjectUtil = class _ObjectUtil {
  constructor() {
  }
  static buscarValor(item, atributo = null, retornoDefault = null) {
    if (!item) {
      return retornoDefault;
    }
    if (!atributo) {
      return item;
    }
    if (typeof atributo === "number" || atributo.indexOf(".") === -1) {
      if (item[atributo] == null || item[atributo] === void 0 || item[atributo] == "") {
        return retornoDefault;
      }
      return item[atributo];
    } else {
      const fields = atributo.split(".");
      let value = item;
      for (let i = 0, len = fields.length; i < len; ++i) {
        if (value == null || value == "") {
          return retornoDefault;
        }
        value = value[fields[i]];
      }
      return value ? value : retornoDefault;
    }
  }
  static atribuirValor(item, atributo, valor) {
    const atributos = atributo.split(".");
    const propriedadeAAtribuir = atributos.pop();
    let itemAtual = item;
    atributos.some((atributo2) => {
      itemAtual = itemAtual[atributo2];
      return !itemAtual;
    });
    if (itemAtual) {
      itemAtual[propriedadeAAtribuir] = valor;
    }
  }
  static possuiValor(item, atributo) {
    const valor = _ObjectUtil.buscarValor(item, atributo, null);
    return valor != null;
  }
  static estaVazio(item) {
    if (item == null || item === void 0) return true;
    if (Object.keys(item).length <= 0) return true;
    return false;
  }
};

// src/middlewares/entity-validator.ts
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

// src/jp-api/router-builder.ts
var RouterBuilder = class {
  constructor() {
    this.router = (0, import_express.Router)();
  }
  //@TODO: Serjola criar a documentacao aqui.
  useRoutes(router, path = "") {
    this.router.use(path, router);
    return this;
  }
  /**
   * @description Criará a rota com base nos parâmetros passados. Essa função pode substituir qualquer outra
   * @param {function} acao A função de execução na rota. Obrigatório
   * @param {string} verbo O valor determinará o verbo HTTP a ser utilizado. Obrigatório
   * @param {string} path O recurso a ser disponibilizado na rota. Default vazio
   * @param {string} validator A validação a ser aplicada na rota. Default vazio
   * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
   */
  add(iRouter) {
    const verbo = ObjectUtil.buscarValor(iRouter, "verbo", "");
    const path = ObjectUtil.buscarValor(iRouter, "path", "");
    const acao = iRouter.acao;
    const schemaValidation = ObjectUtil.buscarValor(iRouter, "validator", import_zod.z.any());
    this.router[verbo](path, entityValidator(schemaValidation), acao);
    return this;
  }
  /**
   * @description Criará uma rota do tipo GET
   * @param {function} [acao] A função de execução na rota. Obrigatório.
   * @param {string} path O recurso a ser disponibilizado na rota. Default vazio
   * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
   * @deprecated
   * - utilizar o método abaixo.
   * - new RouterBuilder().add()
   */
  get(acao, path = "") {
    this.router.get(path, acao);
    return this;
  }
  /**
   * @description Criará uma rota do tipo POST
   * @param {function} [acao] A função de execução na rota. Obrigatório.
   * @param {string} path O recurso a ser disponibilizado na rota. Default vazio
   * @param {ZodSchema} schema  A validação a ser aplicada na rota. Default vazio
   * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
   * @deprecated
   * - utilizar o método abaixo.
   * - new RouterBuilder().add()
   */
  post(acao, path = "", schema = import_zod.z.any()) {
    this.router.post(path, entityValidator(schema), acao);
    return this;
  }
  /**
   * @description Criará uma rota do tipo DELETE
   * @param {function} [acao] A função de execução na rota. Obrigatório.
   * @param {string} path O recurso a ser disponibilizado na rota. Default vazio
   * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
   * @deprecated
   * - utilizar o método abaixo.
   * - new RouterBuilder().add()
   */
  delete(acao, path = "") {
    this.router.delete(path, acao);
    return this;
  }
  /**
   * @description Criará uma rota do tipo PUT
   * @param {function} [acao] A função de execução na rota. Obrigatório.
   * @param {string} path O recurso a ser disponibilizado na rota. Default vazio
   * @param {ZodSchema} schema  A validação a ser aplicada na rota. Default vazio
   * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
   * @deprecated
   * - utilizar o método abaixo.
   * - new RouterBuilder().add()
   */
  put(acao, path = "", schema = import_zod.z.any()) {
    this.router.put(path, entityValidator(schema), acao);
    return this;
  }
  /**
   * @returns {Router} A instância das rotas construídas.
   */
  builder() {
    return this.router;
  }
  /**
   * @description Criará um middleware para todas as rotas
   * @param {function} [use] A função de execução nao middleware das rotas.
   * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
   */
  middleware(use) {
    this.router.use(use);
    return this;
  }
};

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

// src/modules/users/users.entity.ts
var import_bcrypt = require("bcrypt");

// src/database.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var database_default = prisma;

// src/modules/users/users.entity.ts
var import_passport = __toESM(require("passport"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var User = class {
  constructor(data) {
    Object.assign(this, data);
  }
  loginWithGoogle(req, res, next) {
    return __async(this, null, function* () {
      import_passport.default.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    });
  }
  handleGoogleCallback(req, res, next) {
    return __async(this, null, function* () {
      import_passport.default.authenticate("google", { failureRedirect: "/" }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect("/");
        req.logIn(user, (err2) => {
          if (err2) return next(err2);
          return res.redirect("/dashboard");
        });
      })(req, res, next);
    });
  }
  list() {
    return __async(this, null, function* () {
      return yield database_default.user.findMany({
        include: {
          profile: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });
    });
  }
  create() {
    return __async(this, null, function* () {
      try {
        const hashPassword = yield (0, import_bcrypt.hash)(this.password, 6);
        return yield database_default.user.create({
          data: {
            name: this.name,
            email: this.email,
            password: hashPassword
          }
        });
      } catch (error) {
        throw new Error("N\xE3o foi poss\xEDvel criar o usu\xE1rio.");
      }
    });
  }
  login() {
    return __async(this, null, function* () {
      var _a, _b;
      try {
        const user = yield database_default.user.findUnique({
          where: {
            email: this.email
          },
          include: {
            profile: {
              select: {
                id: true,
                username: true
              }
            }
          }
        });
        if (!user) {
          throw new Error("Credenciais inv\xE1lidas.");
        }
        const comparePassword = yield (0, import_bcrypt.compare)(this.password, user.password);
        if (!comparePassword) {
          throw new Error("Credenciais inv\xE1lidas.");
        }
        const token = import_jsonwebtoken.default.sign(
          {
            id: user.id,
            email: user.email
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d"
          }
        );
        return { token, user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: {
            id: (_a = user == null ? void 0 : user.profile) == null ? void 0 : _a.id,
            username: (_b = user == null ? void 0 : user.profile) == null ? void 0 : _b.username
          }
        } };
      } catch (error) {
        throw new Error("N\xE3o foi poss\xEDvel fazer o login. Verifique as credenciais.");
      }
    });
  }
  update() {
    return __async(this, null, function* () {
      try {
        const dataToUpdate = {
          name: this.name,
          email: this.email
        };
        if (this.password) {
          const hashPassword = yield (0, import_bcrypt.hash)(this.password, 6);
          dataToUpdate.password = hashPassword;
        }
        yield database_default.user.update({
          where: {
            id: this.id
          },
          data: dataToUpdate
        });
      } catch (error) {
        console.error("Erro ao atualizar usu\xE1rio:", error);
        throw new Error("N\xE3o foi poss\xEDvel atualizar o usu\xE1rio.");
      }
    });
  }
  delete() {
    return __async(this, null, function* () {
      try {
        yield database_default.user.delete({
          where: {
            id: this.id
          }
        });
      } catch (error) {
        throw new Error("N\xE3o foi poss\xEDvel excluir o usu\xE1rio.");
      }
    });
  }
};

// src/modules/users/auth/auth.router.ts
var AuthRouter = class {
  constructor() {
    this.create = (req, res) => __async(this, null, function* () {
      const user = new User(req.body);
      const response = yield user.create();
      return ExpressAppResponse(res).success({ response });
    });
    this.login = (req, res) => __async(this, null, function* () {
      const user = new User(req.body);
      const response = yield user.login();
      return ExpressAppResponse(res).success({ response });
    });
  }
  routes() {
    return new RouterBuilder().add({
      path: "/",
      acao: this.create,
      verbo: "post" /* POST */
    }).add({
      path: "/login",
      acao: this.login,
      verbo: "post" /* POST */
    }).builder();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthRouter
});
