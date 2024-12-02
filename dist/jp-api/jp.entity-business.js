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

// src/jp-api/jp.entity-business.ts
var jp_entity_business_exports = {};
__export(jp_entity_business_exports, {
  JPEntityBusiness: () => JPEntityBusiness
});
module.exports = __toCommonJS(jp_entity_business_exports);

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

// src/jp-api/jp.entity-business.ts
var JPEntityBusiness = class {
  constructor(data) {
    if (data) {
      Object.assign(this, {
        id: data.id
      });
      this.id = !!this.id ? this.id : "";
    }
  }
  /**
   * @description
   * - Método que estrutura a execução dos filtros e consulta em banco.
   * - Será normalmente utilizado pelas configurações nas ROTAS.
   * @returns {Promise<Array<Partial<T>>>} Entidade filtrada.
   */
  filtrar() {
    return __async(this, null, function* () {
      const filter = this.criarFiltrosGenericos();
      return yield this.consultarEmBanco(filter);
    });
  }
  /**
   * @description
   * - Método que estrutura a execução de atualização e altera em banco.
   * - Será normalmente utilizado pelas configurações nas ROTAS.
   * @returns { Promise<Partial<T>>} Entidade atualizada.
   */
  atualizar() {
    return __async(this, null, function* () {
      const data = this.criarDadosDeAtualizacao();
      return yield this.atualizarEmBanco();
    });
  }
  /**
   * @description
   * - Método que estrutura a execução de salvar e altera em banco.
   * - Será normalmente utilizado pelas configurações nas ROTAS.
   * @returns {Promise<Array<Partial<T>>>} Entidade criada.
   */
  salvar() {
    return __async(this, null, function* () {
      return yield this.salvarEmBanco();
    });
  }
  criarFiltrosGenericos() {
    var filter = {};
    Object.keys(this).forEach((key) => {
      if (ObjectUtil.possuiValor(this, key)) {
        filter[key] = ObjectUtil.buscarValor(this, key);
      }
    });
    return filter;
  }
  criarDadosDeAtualizacao() {
    var filter = {};
    Object.keys(this).forEach((key) => {
      if (ObjectUtil.possuiValor(this, key)) {
        filter[key] = ObjectUtil.buscarValor(this, key);
      }
    });
    return filter;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JPEntityBusiness
});
