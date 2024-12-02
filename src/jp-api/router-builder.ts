import { Request, Response, Router } from 'express';
import { ZodSchema, z } from 'zod';
import { IJPRouter } from './i-routes';
import { ObjectUtil } from './utils/object-utils';
import { entityValidator } from '../middlewares/entity-validator';

/**
 *
 * @description
 * - Construtor de rotas padronizadas.
 * - Essa classe irá disponibilizar formas de construir as ROTAS através de métodos. Confirá-os através do intelisense.
 * @recomended utilizar o método add(iRouter: IJPRouter)
 * @example new RouterBuilder().add()
 */
export class RouterBuilder {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    //@TODO: Serjola criar a documentacao aqui.
    public useRoutes(router: Router, path: string = ''): RouterBuilder {
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
    public add(iRouter: IJPRouter): RouterBuilder {
        const verbo = ObjectUtil.buscarValor(iRouter, 'verbo', '');
        const path = ObjectUtil.buscarValor(iRouter, 'path', '');
        const acao = iRouter.acao;
        const schemaValidation = ObjectUtil.buscarValor(iRouter, 'validator', z.any());
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
    public get(acao: (req: Request, res: Response) => Promise<Response>, path: string = ''): RouterBuilder {
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
    public post(
        acao: (req: Request, res: Response) => Promise<Response>,
        path: string = '',
        schema: ZodSchema = z.any()
    ): RouterBuilder {
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
    public delete(acao: (req: Request, res: Response) => Promise<Response>, path: string = ''): RouterBuilder {
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
    public put(
        acao: (req: Request, res: Response) => Promise<Response>,
        path: string = '',
        schema: ZodSchema = z.any()
    ): RouterBuilder {
        this.router.put(path, entityValidator(schema), acao);
        return this;
    }

    /**
     * @returns {Router} A instância das rotas construídas.
     */
    public builder(): Router {
        return this.router;
    }

    /**
     * @description Criará um middleware para todas as rotas
     * @param {function} [use] A função de execução nao middleware das rotas.
     * @returns {RouterBuilder} A própria instancia do objeto. Afinal é um BUILDER
     */
    public middleware(
        use: (req: Request, res: Response, next: any) => Promise<Response>
    ): RouterBuilder {
        this.router.use(use);
        return this;
    }
}
