
import { Request, Response, Router } from "express";
import { IJPRoutes, VerboHTTPType } from "../../jp-api/i-routes";
import { RouterBuilder } from "../../jp-api/router-builder";
import { ExpressAppResponse } from "../../utils/express-app-response";
import { Profile } from "./profiles.entity";

export class ProfilesRouter implements IJPRoutes {
    routes(): Router {
        return new RouterBuilder()
            .add({
                path: '/',
                acao: this.create,
                verbo: VerboHTTPType.POST
            })
            .add({
                path: '/:username',
                acao: this.list,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/getDetails/:userId',
                acao: this.getDetails,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/getDetailsProfile/:userId',
                acao: this.findByUserId,
                verbo: VerboHTTPType.GET
            })
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
                path: '/toggleFollow/:followingId',
                acao: this.toggleFollow,
                verbo: VerboHTTPType.PUT
            })
            .builder()
    }


    private create = async (req: Request, res: Response) => {
        const profile = new Profile(req.body)
        const response = await profile.create()
        return ExpressAppResponse(res).success({ response: response });
    };

    private list = async (req: Request, res: Response) => {
        const profile = new Profile({
            username: req.params.username
        })
        const response = await profile.findByUsername()
        return ExpressAppResponse(res).success({ response: response });
    };

    private getDetails = async (req: Request, res: Response) => {
        const profile = new Profile({
            userId: req.params.userId
        })
        const response = await profile.getDetails()
        return ExpressAppResponse(res).success({ response: response });
    };
    private findByUserId = async (req: Request, res: Response) => {
        const profile = new Profile({
            userId: req.params.userId
        })
        const response = await profile.findByUserId() 
        return ExpressAppResponse(res).success({ response: response });
    };

    private update = async (req: Request, res: Response) => {
        const profile = new Profile({
            userId: req.params.userId,
            ...req.body
        })
        const response = await profile.update()
        return ExpressAppResponse(res).success({ response: response });
    };

    private delete = async (req: Request, res: Response) => {
        const post = new Profile({
            userId: req.params.userId
        })
        const response = await post.delete()
        return ExpressAppResponse(res).success({ response: response });
    };

    private toggleFollow = async (req: Request, res: Response) => {
        const profile = new Profile({
            followingId: req.params.followingId,
            userId: req.query.userId as string,
            action: req.query.action as "follow" | "unfollow"
        })

        console.log(req.query)
        console.log(req.params.followingId)
        console.log(req.query)
        const response = await profile.toggleFollow()
        return ExpressAppResponse(res).success({ response: response });
    };

}
