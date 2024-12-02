import { ZodSchema } from 'zod';

import { Request, Response, Router } from 'express';

export interface IJPRoutes {
    routes(): Router;
}

export interface IJPRouter {
    acao: (req: Request, res: Response) => Promise<Response>;
    verbo: VerboHTTPType;
    path?: string;
    validator?: ZodSchema;
}

export enum VerboHTTPType {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}
