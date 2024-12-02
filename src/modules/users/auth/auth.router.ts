
import { Request, Response, Router } from "express";
import { RouterBuilder } from "../../../jp-api/router-builder";
import { IJPRoutes, VerboHTTPType } from "../../../jp-api/i-routes";
import { ExpressAppResponse } from "../../../utils/express-app-response";
import { User } from "../users.entity";

export class AuthRouter implements IJPRoutes {
    routes(): Router {
        return new RouterBuilder()
            .add({
                path: '/',
                acao: this.create,
                verbo: VerboHTTPType.POST
            })
            .add({
                path: '/login',
                acao: this.login,
                verbo: VerboHTTPType.POST
            })
            .builder()
    }

    private create = async (req: Request, res: Response) => {
        const user = new User(req.body)
        const response = await user.create()
        return ExpressAppResponse(res).success({ response: response });
    };

    private login = async (req: Request, res: Response) => {
        const user = new User(req.body)
        const response = await user.login()
        return ExpressAppResponse(res).success({ response: response });
    };

}
