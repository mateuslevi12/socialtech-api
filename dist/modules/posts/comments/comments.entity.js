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

// src/modules/posts/comments/comments.entity.ts
var comments_entity_exports = {};
__export(comments_entity_exports, {
  Comment: () => Comment
});
module.exports = __toCommonJS(comments_entity_exports);

// src/database.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var database_default = prisma;

// src/modules/posts/comments/comments.entity.ts
var Comment = class {
  constructor(data) {
    Object.assign(this, data);
  }
  getAllCommentsByPostId() {
    return __async(this, null, function* () {
      return yield database_default.comments.findMany({
        where: {
          postId: this.postId
        },
        include: {
          profile: {
            select: {
              username: true
            }
          }
        }
      });
    });
  }
  like() {
    return __async(this, null, function* () {
      return yield database_default.comments.update({
        where: {
          id: this.id
        },
        data: {
          likes: {
            increment: 1
          }
        }
      });
    });
  }
  unlike() {
    return __async(this, null, function* () {
      return yield database_default.comments.update({
        where: {
          id: this.id
        },
        data: {
          likes: {
            decrement: 1
          }
        }
      });
    });
  }
  create() {
    return __async(this, null, function* () {
      return yield database_default.comments.create({
        data: {
          content: this.content,
          post: {
            connect: {
              id: this.postId
            }
          },
          profile: {
            connect: {
              id: this.profileId
            }
          }
        }
      });
    });
  }
  update() {
    return __async(this, null, function* () {
      return yield database_default.comments.update({
        where: {
          id: this.id
        },
        data: {
          content: this.content
        }
      });
    });
  }
  delete() {
    return __async(this, null, function* () {
      return yield database_default.comments.delete({
        where: {
          id: this.id
        }
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Comment
});
