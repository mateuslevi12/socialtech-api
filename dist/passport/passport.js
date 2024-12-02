var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/passport/passport.ts
var import_passport = __toESM(require("passport"));
var import_passport_google_oauth20 = require("passport-google-oauth20");

// src/database.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var database_default = prisma;

// src/passport/passport.ts
import_passport.default.use(
  new import_passport_google_oauth20.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      // Variável de ambiente com o Client ID do Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Variável de ambiente com o Client Secret do Google
      callbackURL: "/auth/google/callback"
      // Endpoint para onde o Google redireciona após o login
    },
    (accessToken, refreshToken, profile, done) => __async(exports, null, function* () {
      try {
        let user = yield database_default.user.findUnique({
          where: {
            email: profile.emails[0].value
            // O email é usado como chave única
          }
        });
        if (!user) {
          user = yield database_default.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: ""
              // Para usuários Google, a senha pode ser deixada em branco ou outro tratamento especial
            }
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    })
  )
);
import_passport.default.serializeUser((user, done) => {
  done(null, user.id);
});
import_passport.default.deserializeUser((id, done) => __async(exports, null, function* () {
  try {
    const user = yield database_default.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));
