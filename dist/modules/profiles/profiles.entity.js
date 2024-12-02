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

// src/modules/profiles/profiles.entity.ts
var profiles_entity_exports = {};
__export(profiles_entity_exports, {
  Profile: () => Profile
});
module.exports = __toCommonJS(profiles_entity_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Profile
});
