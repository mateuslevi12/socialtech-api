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

// src/modules/users/users.entity.ts
var users_entity_exports = {};
__export(users_entity_exports, {
  User: () => User
});
module.exports = __toCommonJS(users_entity_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  User
});
