
import { Request, Response, Router } from "express";
import { IJPRoutes, VerboHTTPType } from "../../jp-api/i-routes";
import { RouterBuilder } from "../../jp-api/router-builder";
import { ExpressAppResponse } from "../../utils/express-app-response";
import { Chat } from "./chats.entity";

export class ChatsRouter implements IJPRoutes {
    routes(): Router {
        return new RouterBuilder()
            .add({
                path: '/',
                acao: this.create,
                verbo: VerboHTTPType.POST
            })
            .add({
                path: '/',
                acao: this.list,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/sendMessage/:chatId',
                acao: this.sendMessage,
                verbo: VerboHTTPType.PUT
            })
            .add({
                path: '/deleteMessage/:messageId',
                acao: this.deleteMessage,
                verbo: VerboHTTPType.DELETE
            })
            .builder()
    }


    private create = async (req: Request, res: Response) => {
        const chat = new Chat(req.body)
        const response = await chat.create()
        return ExpressAppResponse(res).success({ response: response });
    };

    private list = async (req: Request, res: Response) => {
        const profile = new Chat(req.body)
        const response = await profile.list()
        return ExpressAppResponse(res).success({ response: response });
    };

    private sendMessage = async (req: Request, res: Response) => {
        const profile = new Chat({
            chatId: req.params.chatId,
            ...req.body
        })
        const response = await profile.send()
        return ExpressAppResponse(res).success({ response: response });
    };

    private deleteMessage = async (req: Request, res: Response) => {
        const post = new Chat({
            messageId: req.params.messageId
        })
        const response = await post.deleteMessage()
        return ExpressAppResponse(res).success({ response: response });
    };

}
