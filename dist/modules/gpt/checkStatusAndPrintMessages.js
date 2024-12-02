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

// src/modules/gpt/checkStatusAndPrintMessages.ts
var checkStatusAndPrintMessages_exports = {};
__export(checkStatusAndPrintMessages_exports, {
  checkStatusAndPrintMessages: () => checkStatusAndPrintMessages
});
module.exports = __toCommonJS(checkStatusAndPrintMessages_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkStatusAndPrintMessages
});
