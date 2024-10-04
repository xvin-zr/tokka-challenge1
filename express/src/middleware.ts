import type { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const validateInputErrors: RequestHandler = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(400).json({ errors: err.array() });
        return;
    }

    next();
};
