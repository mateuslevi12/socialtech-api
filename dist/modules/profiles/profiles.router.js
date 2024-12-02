var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/modules/profiles/profiles.router.ts
var profiles_router_exports = {};
__export(profiles_router_exports, {
  ProfilesRouter: () => ProfilesRouter
});
module.exports = __toCommonJS(profiles_router_exports);

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

// src/database.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var database_default = prisma;

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProfilesRouter
});
