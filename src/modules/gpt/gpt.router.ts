
import { Request, Response, Router } from "express";
import { IJPRoutes, VerboHTTPType } from "../../jp-api/i-routes";
import { RouterBuilder } from "../../jp-api/router-builder";
import { ExpressAppResponse } from "../../utils/express-app-response";
import { sendMessageFromAssistant } from "./sendMessageFromAssistant";

export class GptRouter implements IJPRoutes {
    routes(): Router {
        return new RouterBuilder()
            .add({
                path: '/',
                acao: this.send,
                verbo: VerboHTTPType.POST
            })
            .builder()
    }

    private send = async (req: Request, res: Response) => {

        const contant = req.body.content
        const username = req.body.username

        const response = await sendMessageFromAssistant(username, contant)

        return ExpressAppResponse(res).success({ response: response });
    };

}
