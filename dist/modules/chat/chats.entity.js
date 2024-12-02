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

// src/modules/chat/chats.entity.ts
var chats_entity_exports = {};
__export(chats_entity_exports, {
  Chat: () => Chat
});
module.exports = __toCommonJS(chats_entity_exports);

// src/database.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var database_default = prisma;

// src/modules/chat/chats.entity.ts
var Chat = class {
  constructor(data) {
    Object.assign(this, data);
  }
  list() {
    return __async(this, null, function* () {
      return yield database_default.chat.findMany({
        include: {
          profiles: {
            select: {
              username: true
            }
          }
        }
      });
    });
  }
  verifyChatExists() {
    return __async(this, null, function* () {
      let chat = yield database_default.chat.findUnique({
        where: {
          id: this.chatId
        }
      });
      if (!chat) {
        yield database_default.chat.create({});
      }
      return chat;
    });
  }
  create() {
    return __async(this, null, function* () {
      return yield this.verifyChatExists();
    });
  }
  send() {
    return __async(this, null, function* () {
      let chat = yield this.verifyChatExists();
      return yield database_default.message.create({
        data: {
          chat: {
            connect: {
              id: chat.id
            }
          },
          content: this.content,
          sender: {
            connect: {
              id: this.senderId
            }
          }
        }
      });
    });
  }
  deleteMessage() {
    return __async(this, null, function* () {
      return yield database_default.message.delete({
        where: {
          id: this.messageId
        }
      });
    });
  }
  listMessage() {
    return __async(this, null, function* () {
      return yield database_default.message.findMany({
        where: {
          chatId: this.chatId
        },
        select: {
          sender: {
            select: {
              id: true,
              username: true
            }
          },
          content: true,
          createdAt: true
        }
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chat
});
