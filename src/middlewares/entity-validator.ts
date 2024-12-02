import { ZodError, ZodSchema } from 'zod';

export function entityValidator(schema: ZodSchema) {
    return (req, res, next) => {
        if (!schema) {
            return next();
        }

        try {
            const data = schema.parse(req.body);
        } catch (err) {
            const zodError = err as ZodError;
            console.log(err);
            const messages = zodError.errors.map((err) => {
                const message = `${err.path} ${err.message}`;

                return message;
            });
            throw new Error(JSON.stringify(messages));
        }

        return next();
    };
}

export interface IEntityValidator {
    getSchema(): ZodSchema;
}
