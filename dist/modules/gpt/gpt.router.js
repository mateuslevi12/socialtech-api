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

// src/modules/gpt/gpt.router.ts
var gpt_router_exports = {};
__export(gpt_router_exports, {
  GptRouter: () => GptRouter
});
module.exports = __toCommonJS(gpt_router_exports);

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

// src/modules/gpt/openai.ts
var import_config = require("dotenv/config");
var import_openai = __toESM(require("openai"));
var openai = new import_openai.default({
  apiKey: process.env.OPENAI_API_KEY
});

// src/modules/gpt/checkStatusAndPrintMessages.ts
function checkStatusAndPrintMessages(threadId, runId) {
  return __async(this, null, function* () {
    try {
      let runStatus;
      let attempts = 0;
      do {
        runStatus = yield openai.beta.threads.runs.retrieve(threadId, runId);
        console.log(`Tentativa ${attempts + 1}: Status da execu\xE7\xE3o - ${runStatus.status}`);
        if (runStatus.status === "in_progress") {
          yield sleep(2e3);
        }
        attempts++;
      } while (runStatus.status !== "completed" && attempts < 10);
      if (runStatus.status === "completed") {
        const messages = yield openai.beta.threads.messages.list(threadId);
        const assistantMessage = messages.data.find((msg) => msg.role === "assistant");
        if (assistantMessage && assistantMessage.content) {
          if (Array.isArray(assistantMessage.content)) {
            const messageContent = assistantMessage.content[0];
            if (messageContent.type === "text" && messageContent.text) {
              console.log({
                role: assistantMessage.role,
                content: messageContent.text
              });
              return {
                role: assistantMessage.role,
                content: messageContent.text
              };
            } else {
              console.log("Conte\xFAdo n\xE3o \xE9 do tipo texto.");
            }
          } else {
            console.log("Mensagem n\xE3o cont\xE9m conte\xFAdo esperado.");
          }
        } else {
          console.log("Nenhuma mensagem do assistant encontrada.");
          return null;
        }
      } else {
        console.log("A execu\xE7\xE3o n\xE3o foi completada ap\xF3s v\xE1rias tentativas.");
        return null;
      }
    } catch (error) {
      console.error("Erro ao verificar status e imprimir mensagens:", error);
      throw error;
    }
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/database.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var database_default = prisma;

// src/modules/gpt/verifyChatExists.ts
function verifyChatExists(userName) {
  return __async(this, null, function* () {
    let chat = yield database_default.messagesChatBot.findFirst({
      where: {
        userName
      }
    });
    if (!chat) {
      const thread = yield openai.beta.threads.create();
      chat = yield database_default.messagesChatBot.create({
        data: {
          threadId: thread.id,
          userName
        }
      });
    }
    return chat;
  });
}

// src/modules/gpt/sendMessageFromAssistant.ts
var assistant = process.env.ASSISTANT_ID || "";
function sendMessageFromAssistant(username, message) {
  return __async(this, null, function* () {
    try {
      let chatRequest = yield verifyChatExists(username);
      yield openai.beta.threads.messages.create(chatRequest.threadId, {
        role: "user",
        content: message
      });
      const run = yield openai.beta.threads.runs.create(chatRequest.threadId, {
        assistant_id: assistant
      });
      const messages = yield checkStatusAndPrintMessages(chatRequest.threadId, run.id);
      const messageClean = cleanResponse(messages == null ? void 0 : messages.content.value);
      const messageSendForUser = {
        role: messages.role,
        content: messageClean
      };
      return messageSendForUser;
    } catch (error) {
      console.error("Erro ao enviar mensagem do assistente:", error);
      throw error;
    }
  });
}
function cleanResponse(response) {
  return response == null ? void 0 : response.replace(/【.+†source】/g, "");
}

// src/modules/gpt/gpt.router.ts
var GptRouter = class {
  constructor() {
    this.send = (req, res) => __async(this, null, function* () {
      const contant = req.body.content;
      const username = req.body.username;
      const response = yield sendMessageFromAssistant(username, contant);
      return ExpressAppResponse(res).success({ response });
    });
  }
  routes() {
    return new RouterBuilder().add({
      path: "/",
      acao: this.send,
      verbo: "post" /* POST */
    }).builder();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GptRouter
});
