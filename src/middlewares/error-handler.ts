import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { Prisma } from "@prisma/client";
import { ExpressAppResponse } from "../utils/express-app-response";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log("Error: " + err.message);
    if (err instanceof(AppError)) {
        const appError = err as AppError;

        return ExpressAppResponse(res).error(appError.status, appError.message); 
    }
    else if (err instanceof(ZodError)) {
        return ExpressAppResponse(res).error(500, err.message); 
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return ExpressAppResponse(res).error(500, "erro no banco de dados"); 
    }
    else {
        return ExpressAppResponse(res).error(500, err.message); 
    }
}

export default errorHandler;

class AppError {
    public message: string;
    public status: number;

    constructor(message: string, status: number) {
        this.message = message;
        this.status = status;
    }
}

export { AppError }