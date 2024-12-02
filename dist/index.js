var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/index.ts
var import_express2 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

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

// src/modules/users/users.entity.ts
var import_bcrypt = require("bcrypt");
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

// src/modules/users/users.router.ts
var UserRouter = class {
  constructor() {
    this.list = (req, res) => __async(this, null, function* () {
      const user = new User(req.body);
      const response = yield user.list();
      return ExpressAppResponse(res).success({ response });
    });
    this.update = (req, res) => __async(this, null, function* () {
      const user = new User(__spreadValues({
        id: req.params.userId
      }, req.body));
      const response = yield user.update();
      return ExpressAppResponse(res).success({ response });
    });
    this.delete = (req, res) => __async(this, null, function* () {
      const user = new User({
        id: req.params.userId
      });
      const response = yield user.delete();
      return ExpressAppResponse(res).success({ response });
    });
  }
  routes() {
    return new RouterBuilder().add({
      path: "/:userId",
      acao: this.update,
      verbo: "put" /* PUT */
    }).add({
      path: "/:userId",
      acao: this.delete,
      verbo: "delete" /* DELETE */
    }).add({
      path: "/",
      acao: this.list,
      verbo: "get" /* GET */
    }).builder();
  }
};

// src/modules/posts/posts.entity.ts
var Post = class {
  constructor(data) {
    Object.assign(this, data);
  }
  findById() {
    return __async(this, null, function* () {
      return yield database_default.posts.findUnique({
        where: {
          id: this.postId
        },
        include: {
          profile: {
            include: {
              user: true
            }
          },
          comments: {
            include: {
              profile: {
                include: {
                  user: true
                }
              }
            }
          },
          likes: true
        }
      });
    });
  }
  list() {
    return __async(this, null, function* () {
      const page = this.page || 1;
      const pageSize = 20;
      const sevenDaysAgo = /* @__PURE__ */ new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      try {
        const posts = yield database_default.posts.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            OR: [
              {
                AND: [
                  {
                    profile: {
                      following: {
                        some: {
                          followerId: this.userId
                        }
                      }
                    }
                  },
                  {
                    createdAt: {
                      gte: sevenDaysAgo
                    }
                  }
                ]
              },
              {
                profile: {
                  id: this.profileId
                }
              }
            ]
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            profile: {
              select: {
                username: true,
                user: {
                  select: {
                    name: true
                  }
                }
              }
            },
            _count: {
              select: {
                comments: true,
                likes: true
              }
            },
            likes: {
              where: {
                userId: this.userId
              },
              select: {
                id: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        });
        console.log("posts", posts);
        const formattedPosts = posts.map((post) => ({
          id: post.id,
          likes: post._count.likes,
          content: post.content,
          profile: post.profile,
          comments: post._count.comments,
          createdAt: post.createdAt,
          liked: post.likes.length > 0,
          user: {
            name: post.profile.user.name
          }
        }));
        return formattedPosts;
      } catch (error) {
        throw new Error("N\xE3o foi poss\xEDvel listar os posts dos perfis seguidos.");
      }
    });
  }
  ILiked() {
    return __async(this, null, function* () {
      return yield database_default.like.findMany({
        where: {
          user: {
            user: {
              id: this.userId
            }
          }
        },
        include: {
          post: {
            include: {
              _count: {
                select: {
                  comments: true,
                  likes: true
                }
              },
              profile: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });
    });
  }
  myPosts() {
    return __async(this, null, function* () {
      return yield database_default.posts.findMany({
        where: {
          profileId: this.profileId
        }
      });
    });
  }
  toggleLike() {
    return __async(this, null, function* () {
      try {
        const existingLike = yield database_default.like.findUnique({
          where: {
            postId_userId: {
              postId: this.postId,
              userId: this.userId
            }
          }
        });
        if (existingLike) {
          yield database_default.like.delete({
            where: {
              postId_userId: {
                postId: this.postId,
                userId: this.userId
              }
            }
          });
          return { message: "Post descurtido com sucesso." };
        } else {
          yield database_default.like.create({
            data: {
              post: {
                connect: {
                  id: this.postId
                }
              },
              user: {
                connect: {
                  id: this.userId
                }
              }
            }
          });
          return { message: "Post curtido com sucesso." };
        }
      } catch (error) {
        console.error("Erro ao alternar o estado de curtida:", error);
        throw new Error("N\xE3o foi poss\xEDvel alternar o estado de curtida.");
      }
    });
  }
  create() {
    return __async(this, null, function* () {
      yield database_default.posts.create({
        data: {
          content: this.content,
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
      yield database_default.posts.update({
        where: {
          id: this.postId
        },
        data: {
          content: this.content
        }
      });
    });
  }
  delete() {
    return __async(this, null, function* () {
      yield database_default.posts.delete({
        where: {
          id: this.postId
        }
      });
    });
  }
};

// src/modules/profiles/profiles.entity.ts
var Profile = class {
  constructor(data) {
    Object.assign(this, data);
  }
  getDetails() {
    return __async(this, null, function* () {
      const details = yield database_default.profile.findUnique({
        where: {
          userId: this.userId
        },
        select: {
          id: true,
          username: true,
          posts: true,
          description: true,
          followers: {
            select: {
              followerId: true
            }
          },
          following: {
            select: {
              followerId: true
            }
          }
        }
      });
      const responseDetails = {
        id: details.id,
        username: details.username,
        posts: details.posts,
        description: details.description,
        followersCount: details.followers.length,
        followingCount: details.following.length
      };
      return responseDetails;
    });
  }
  findByUserId() {
    return __async(this, null, function* () {
      const profile = yield database_default.profile.findUnique({
        where: {
          userId: this.userId
        },
        include: {
          user: {
            select: {
              name: true
            }
          },
          posts: {
            include: {
              comments: true,
              likes: true
            }
          },
          followers: {
            select: {
              follower: {
                select: {
                  username: true
                }
              }
            }
          },
          following: {
            select: {
              following: {
                select: {
                  username: true
                }
              }
            }
          }
        }
      });
      console.log(this.userId);
      const postInstance = new Post({
        userId: this.userId
      });
      const postsIliked = yield postInstance.ILiked();
      console.log(postsIliked);
      const postsWithCounts = profile.posts.map((post) => __spreadProps(__spreadValues({}, post), {
        likes: post.likes.length,
        comments: post.comments.length
      }));
      const profileWithPostsLiked = {
        id: profile.id,
        username: profile.username,
        user: profile.user,
        posts: postsWithCounts,
        description: profile.description,
        followers: profile.followers,
        following: profile.following,
        postsLiked: postsIliked
      };
      return profileWithPostsLiked;
    });
  }
  create() {
    return __async(this, null, function* () {
      console.log("this");
      console.log(this);
      const userExists = yield database_default.user.findUnique({
        where: {
          id: this.userId
        }
      });
      console.log(userExists);
      if (!userExists) {
        throw new Error("User not found. Cannot create profile without a valid user.");
      }
      return yield database_default.profile.create({
        data: {
          username: this.username,
          description: this.description,
          user: {
            connect: {
              id: this.userId
            }
          }
        }
      });
    });
  }
  update() {
    return __async(this, null, function* () {
      yield database_default.profile.update({
        where: {
          id: this.userId
        },
        data: {
          username: this.username
        }
      });
    });
  }
  delete() {
    return __async(this, null, function* () {
      yield database_default.profile.delete({
        where: {
          id: this.userId
        }
      });
    });
  }
  findByUsername() {
    return __async(this, null, function* () {
      const profile = yield database_default.profile.findUnique({
        where: {
          username: this.username
        },
        include: {
          posts: true,
          followers: {
            select: {
              following: true
            }
          },
          following: {
            select: {
              follower: true
            }
          }
        }
      });
      return profile;
    });
  }
  toggleFollow() {
    return __async(this, null, function* () {
      if (this.userId === this.followingId) {
        throw new Error("A user cannot follow themselves.");
      }
      console.log("userId:", this.userId);
      console.log("followingId:", this.followingId);
      console.log("action:", this.action);
      const profileExists = yield database_default.profile.findUnique({ where: { id: this.userId } });
      const targetExists = yield database_default.profile.findUnique({ where: { id: this.followingId } });
      if (!profileExists || !targetExists) {
        throw new Error("One of the profiles does not exist.");
      }
      const connectOrDisconnect = this.action === "follow" ? "connect" : "disconnect";
      if (this.action === "follow") {
        yield database_default.follows.upsert({
          where: {
            followerId_followingId: {
              followerId: this.followingId,
              followingId: this.userId
            }
          },
          create: {
            followerId: this.followingId,
            followingId: this.userId
          },
          update: {}
          // Update vazio
        });
      } else if (this.action === "unfollow") {
        yield database_default.follows.delete({
          where: {
            followerId_followingId: {
              followerId: this.followingId,
              followingId: this.userId
            }
          }
        });
      } else {
        throw new Error('Invalid action. Use "follow" or "unfollow".');
      }
    });
  }
};

// src/modules/profiles/profiles.router.ts
var ProfilesRouter = class {
  constructor() {
    this.create = (req, res) => __async(this, null, function* () {
      const profile = new Profile(req.body);
      const response = yield profile.create();
      return ExpressAppResponse(res).success({ response });
    });
    this.list = (req, res) => __async(this, null, function* () {
      const profile = new Profile({
        username: req.params.username
      });
      const response = yield profile.findByUsername();
      return ExpressAppResponse(res).success({ response });
    });
    this.getDetails = (req, res) => __async(this, null, function* () {
      const profile = new Profile({
        userId: req.params.userId
      });
      const response = yield profile.getDetails();
      return ExpressAppResponse(res).success({ response });
    });
    this.findByUserId = (req, res) => __async(this, null, function* () {
      const profile = new Profile({
        userId: req.params.userId
      });
      const response = yield profile.findByUserId();
      return ExpressAppResponse(res).success({ response });
    });
    this.update = (req, res) => __async(this, null, function* () {
      const profile = new Profile(__spreadValues({
        userId: req.params.userId
      }, req.body));
      const response = yield profile.update();
      return ExpressAppResponse(res).success({ response });
    });
    this.delete = (req, res) => __async(this, null, function* () {
      const post = new Profile({
        userId: req.params.userId
      });
      const response = yield post.delete();
      return ExpressAppResponse(res).success({ response });
    });
    this.toggleFollow = (req, res) => __async(this, null, function* () {
      const profile = new Profile({
        followingId: req.params.followingId,
        userId: req.query.userId,
        action: req.query.action
      });
      console.log(req.query);
      console.log(req.params.followingId);
      console.log(req.query);
      const response = yield profile.toggleFollow();
      return ExpressAppResponse(res).success({ response });
    });
  }
  routes() {
    return new RouterBuilder().add({
      path: "/",
      acao: this.create,
      verbo: "post" /* POST */
    }).add({
      path: "/:username",
      acao: this.list,
      verbo: "get" /* GET */
    }).add({
      path: "/getDetails/:userId",
      acao: this.getDetails,
      verbo: "get" /* GET */
    }).add({
      path: "/getDetailsProfile/:userId",
      acao: this.findByUserId,
      verbo: "get" /* GET */
    }).add({
      path: "/:userId",
      acao: this.update,
      verbo: "put" /* PUT */
    }).add({
      path: "/:userId",
      acao: this.delete,
      verbo: "delete" /* DELETE */
    }).add({
      path: "/toggleFollow/:followingId",
      acao: this.toggleFollow,
      verbo: "put" /* PUT */
    }).builder();
  }
};

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

// src/modules/chat/chats.router.ts
var ChatsRouter = class {
  constructor() {
    this.create = (req, res) => __async(this, null, function* () {
      const chat = new Chat(req.body);
      const response = yield chat.create();
      return ExpressAppResponse(res).success({ response });
    });
    this.list = (req, res) => __async(this, null, function* () {
      const profile = new Chat(req.body);
      const response = yield profile.list();
      return ExpressAppResponse(res).success({ response });
    });
    this.sendMessage = (req, res) => __async(this, null, function* () {
      const profile = new Chat(__spreadValues({
        chatId: req.params.chatId
      }, req.body));
      const response = yield profile.send();
      return ExpressAppResponse(res).success({ response });
    });
    this.deleteMessage = (req, res) => __async(this, null, function* () {
      const post = new Chat({
        messageId: req.params.messageId
      });
      const response = yield post.deleteMessage();
      return ExpressAppResponse(res).success({ response });
    });
  }
  routes() {
    return new RouterBuilder().add({
      path: "/",
      acao: this.create,
      verbo: "post" /* POST */
    }).add({
      path: "/",
      acao: this.list,
      verbo: "get" /* GET */
    }).add({
      path: "/sendMessage/:chatId",
      acao: this.sendMessage,
      verbo: "put" /* PUT */
    }).add({
      path: "/deleteMessage/:messageId",
      acao: this.deleteMessage,
      verbo: "delete" /* DELETE */
    }).builder();
  }
};

// src/middlewares/authJWT.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var authenticateJWT = (req, res, next) => {
  var _a;
  const token = (_a = req.headers.authorization) == null ? void 0 : _a.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token de autentica\xE7\xE3o n\xE3o fornecido." });
    return;
  }
  import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Token inv\xE1lido ou expirado." });
      return;
    }
    req.user = user;
    next();
  });
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

// src/modules/posts/postsAndComment.router.ts
var PostsRouter = class {
  constructor() {
    this.create = (req, res) => __async(this, null, function* () {
      const post = new Post(__spreadValues({
        profileId: req.params.profileId
      }, req.body));
      const response = yield post.create();
      return ExpressAppResponse(res).success({ response });
    });
    this.list = (req, res) => __async(this, null, function* () {
      const post = new Post({
        profileId: req.params.profileId
      });
      const response = yield post.list();
      console.log("chamdnooo", response);
      return ExpressAppResponse(res).success({ response });
    });
    this.findPostDetails = (req, res) => __async(this, null, function* () {
      const post = new Post({
        postId: req.params.postId
      });
      const response = yield post.findById();
      return ExpressAppResponse(res).success({ response });
    });
    this.update = (req, res) => __async(this, null, function* () {
      const post = new Post(__spreadValues({
        postId: req.params.postId
      }, req.body));
      const response = yield post.update();
      return ExpressAppResponse(res).success({ response });
    });
    this.delete = (req, res) => __async(this, null, function* () {
      const post = new Post({
        postId: req.params.postId
      });
      const response = yield post.delete();
      return ExpressAppResponse(res).success({ response });
    });
    this.iLiked = (req, res) => __async(this, null, function* () {
      const post = new Post(req.body);
      const response = yield post.ILiked();
      return ExpressAppResponse(res).success({ response });
    });
    this.toggleLike = (req, res) => __async(this, null, function* () {
      const post = new Post({
        postId: req.params.postId,
        userId: req.params.userId
      });
      const response = yield post.toggleLike();
      return ExpressAppResponse(res).success({ response });
    });
    // ---------------- COMMENTS ---------------- //
    this.comment = (req, res) => __async(this, null, function* () {
      const comment = new Comment({
        postId: req.params.postId,
        profileId: req.params.profileId,
        content: req.body.content
      });
      const response = yield comment.create();
      return ExpressAppResponse(res).success({ response });
    });
    this.getAllCommentsByPostId = (req, res) => __async(this, null, function* () {
      const comment = new Comment({
        postId: req.params.postId
      });
      const response = yield comment.getAllCommentsByPostId();
      return ExpressAppResponse(res).success({ response });
    });
    this.likeComment = (req, res) => __async(this, null, function* () {
      const comment = new Comment({
        id: req.params.commentId
      });
      const response = yield comment.like();
      return ExpressAppResponse(res).success({ response });
    });
    this.unlikeComment = (req, res) => __async(this, null, function* () {
      const comment = new Comment({
        id: req.params.commentId
      });
      const response = yield comment.unlike();
      return ExpressAppResponse(res).success({ response });
    });
    this.updateComment = (req, res) => __async(this, null, function* () {
      const comment = new Comment(__spreadValues({
        id: req.params.commentId
      }, req.body));
      const response = yield comment.update();
      return ExpressAppResponse(res).success({ response });
    });
    this.deleteComment = (req, res) => __async(this, null, function* () {
      const comment = new Comment({
        id: req.params.commentId
      });
      const response = yield comment.delete();
      return ExpressAppResponse(res).success({ response });
    });
  }
  routes() {
    return new RouterBuilder().add({
      path: "/:profileId",
      acao: this.create,
      verbo: "post" /* POST */
    }).add({
      path: "/:profileId",
      acao: this.list,
      verbo: "get" /* GET */
    }).add({
      path: "/details/:postId",
      acao: this.findPostDetails,
      verbo: "get" /* GET */
    }).add({
      path: "/:postId",
      acao: this.update,
      verbo: "put" /* PUT */
    }).add({
      path: "/:postId",
      acao: this.delete,
      verbo: "delete" /* DELETE */
    }).add({
      path: "/like/:postId/:userId",
      acao: this.toggleLike,
      verbo: "put" /* PUT */
    }).add({
      path: "/iLiked",
      acao: this.iLiked,
      verbo: "get" /* GET */
    }).add({
      path: "/:postId/comments",
      acao: this.getAllCommentsByPostId,
      verbo: "get" /* GET */
    }).add({
      path: "/:postId/comments/:profileId",
      acao: this.comment,
      verbo: "post" /* POST */
    }).add({
      path: "/comments/:commentId",
      acao: this.updateComment,
      verbo: "put" /* PUT */
    }).add({
      path: "/comments/:commentId",
      acao: this.deleteComment,
      verbo: "delete" /* DELETE */
    }).add({
      path: "/:postId/comments/like/:commentId",
      acao: this.likeComment,
      verbo: "put" /* PUT */
    }).add({
      path: "/:postId/comments/unlike/:commentId",
      acao: this.unlikeComment,
      verbo: "put" /* PUT */
    }).builder();
  }
};

// src/index.ts
var app = (0, import_express2.default)();
var port = 3e3;
app.use((0, import_cors.default)());
app.use(import_express2.default.json());
app.use("/gpt", authenticateJWT, new GptRouter().routes());
app.use("/profile", authenticateJWT, new ProfilesRouter().routes());
app.use("/chats", authenticateJWT, new ChatsRouter().routes());
app.use("/users", authenticateJWT, new UserRouter().routes());
app.use("/posts", authenticateJWT, new PostsRouter().routes());
app.use("/auth", new AuthRouter().routes());
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
