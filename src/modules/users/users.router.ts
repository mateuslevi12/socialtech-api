
import { Request, Response, Router } from "express";
import { IJPRoutes, VerboHTTPType } from "../../jp-api/i-routes";
import { RouterBuilder } from "../../jp-api/router-builder";
import { ExpressAppResponse } from "../../utils/express-app-response";
import { User } from "./users.entity";
 
export class UserRouter implements IJPRoutes {
    routes(): Router {
        return new RouterBuilder()
            .add({
                path: '/:userId',
                acao: this.update,
                verbo: VerboHTTPType.PUT
            })
            .add({
                path: '/:userId',
                acao: this.delete,
                verbo: VerboHTTPType.DELETE
            })
            .add({
                path: '/',
                acao: this.list,
                verbo: VerboHTTPType.GET
            })
            .builder()
    }

    private list = async (req: Request, res: Response) => {
        const user = new User(req.body)
        const response = await user.list()
        return ExpressAppResponse(res).success({ response: response });
    };

    private update = async (req: Request, res: Response) => {
        const user = new User({
            id: req.params.userId,
            ...req.body
        })
        const response = await user.update()
        return ExpressAppResponse(res).success({ response: response });
    };

    private delete = async (req: Request, res: Response) => {
        const user = new User({
            id: req.params.userId
        })
        const response = await user.delete()
        return ExpressAppResponse(res).success({ response: response });
    };

}
