import { Response } from "express";

export function ExpressAppResponse(res: Response) {
    return new _ExpressAppResponse(res);
}

class _ExpressAppResponse {
    constructor(private res: Response) {

    }

    unauthorized(data?: any, message?: string): Response {
        return this.res.status(401).send({
            status: "error",
            message: message,
            data
        })
    }

    not_found(data?: any): Response {
        return this.res.status(404).send({
            status: "error",
            message: "not found",
            data
        })
    }

    created(data?: {}): Response {
        return this.res.status(404).send({
            status: "success",
            message: "created",
            data
        })
    }

    success(data?: {}, message?: string, ): Response {
        return this.res.status(200).send({
            status: "success",
            message,
            data
        })
    }

    error(status, message?: string, data?: any) {
        return this.res.status(status).send({
            status: "error",
            message: message,
            data
        })
    }   
}