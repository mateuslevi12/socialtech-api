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

// src/taskRoutes/taskRoutes.ts
var taskRoutes_exports = {};
__export(taskRoutes_exports, {
  default: () => taskRoutes_default
});
module.exports = __toCommonJS(taskRoutes_exports);
var import_express = require("express");
var import_client = require("@prisma/client");
var taskRoutes = (0, import_express.Router)();
var prisma = new import_client.PrismaClient();
taskRoutes.get("/", (req, res) => __async(void 0, null, function* () {
  const tasks = yield prisma.tasks.findMany();
  res.json(tasks);
}));
taskRoutes.post("/", (req, res) => __async(void 0, null, function* () {
  const { title } = req.body;
  const task = yield prisma.tasks.create({
    data: {
      title
    }
  });
  res.json(task);
}));
taskRoutes.put("/:id", (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = yield prisma.tasks.update({
    where: { id: Number(id) },
    data: { title, completed }
  });
  res.json(task);
}));
taskRoutes.delete("/:id", (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  yield prisma.tasks.delete({
    where: { id: Number(id) }
  });
  res.json({ message: "Tarefa deletada" });
}));
var taskRoutes_default = taskRoutes;
