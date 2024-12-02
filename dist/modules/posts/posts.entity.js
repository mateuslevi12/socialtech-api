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

// src/modules/posts/posts.entity.ts
var posts_entity_exports = {};
__export(posts_entity_exports, {
  Post: () => Post
});
module.exports = __toCommonJS(posts_entity_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Post
});
