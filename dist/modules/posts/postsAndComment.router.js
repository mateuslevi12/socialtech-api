var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// src/modules/posts/postsAndComment.router.ts
var postsAndComment_router_exports = {};
__export(postsAndComment_router_exports, {
  PostsRouter: () => PostsRouter
});
module.exports = __toCommonJS(postsAndComment_router_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostsRouter
});
