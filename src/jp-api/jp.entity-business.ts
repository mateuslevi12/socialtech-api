import { ObjectUtil } from './utils/object-utils';
/**
 *
 * @description
 * - Interface  criada para que a classe abstrata possa entender que o objeto trafegado possui o atributo ID.
 */
interface IJPEntity {
    id: string;
}

/**
 *
 * @description
 * - Classe responsável por gerenciar regras básicas de CRUD para qualquer entidade que siga seu contrato.
 */
export abstract class JPEntityBusiness<T extends IJPEntity> {
    id: string;
    abstract etapaAtendimento: T;

    constructor(data: Partial<T>) {
        if (data) {
            Object.assign(this, {
                id: data.id,
            });

            this.id = !!this.id ? this.id : '';
        }
    }

    /**
     * @description
     * - Método que deve ser implementado pela classe que se extende.
     * - Aplicará as regras para filtrar os dados da entidade.
     * @param {function} filter Filtros passados para a classe implementadora.
     * @returns {Promise<Array<Partial<T>>>} Lista da entidade consultado em banco.
     */
    abstract consultarEmBanco(filter: any): Promise<Array<Partial<T>>>;
    /**
     * @description
     * - Método que deve ser implementado pela classe que se extende.
     * - Aplicará as regras para atualizar os dados da entidade.
     * @returns {Promise<Partial<T>>} Entidade atualizada.
     */
    abstract atualizarEmBanco(): Promise<Partial<T>>;
    /**
     * @description
     * - Método que deve ser implementado pela classe que se extende.
     * - Aplicará as regras para salvar os dados da entidade.
     * @returns { Promise<Partial<T>>} Entidade criada.
     */
    abstract salvarEmBanco(): Promise<Partial<T>>;

    /**
     * @description
     * - Método que estrutura a execução dos filtros e consulta em banco.
     * - Será normalmente utilizado pelas configurações nas ROTAS.
     * @returns {Promise<Array<Partial<T>>>} Entidade filtrada.
     */
    async filtrar(): Promise<Array<Partial<T>>> {
        const filter = this.criarFiltrosGenericos();
        return await this.consultarEmBanco(filter);
    }

    /**
     * @description
     * - Método que estrutura a execução de atualização e altera em banco.
     * - Será normalmente utilizado pelas configurações nas ROTAS.
     * @returns { Promise<Partial<T>>} Entidade atualizada.
     */
    async atualizar(): Promise<Partial<T>> {
        const data = this.criarDadosDeAtualizacao();
        return await this.atualizarEmBanco();
    }

    /**
     * @description
     * - Método que estrutura a execução de salvar e altera em banco.
     * - Será normalmente utilizado pelas configurações nas ROTAS.
     * @returns {Promise<Array<Partial<T>>>} Entidade criada.
     */
    async salvar(): Promise<Partial<T>> {
        return await this.salvarEmBanco();
    }

    private criarFiltrosGenericos() {
        var filter = {};

        Object.keys(this).forEach((key) => {
            if (ObjectUtil.possuiValor(this, key)) {
                filter[key] = ObjectUtil.buscarValor(this, key);
            }
        });
        return filter;
    }

    private criarDadosDeAtualizacao() {
        var filter = {};

        Object.keys(this).forEach((key) => {
            if (ObjectUtil.possuiValor(this, key)) {
                filter[key] = ObjectUtil.buscarValor(this, key);
            }
        });
        return filter;
    }
}
