import { Request, Response, NextFunction } from 'express';

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
    const { name, startDate, endDate } = req.body;

    if (!name || name.trim().length === 0 || name.length > 80) {
        return res.status(400).json({ message: 'Task name must be non-empty and not exceed 80 characters' });
    }

    if (endDate && !startDate) {
        return res.status(400).json({ message: 'Start date must be present if end date is provided' });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (startDate && !dateRegex.test(startDate)) {
        return res.status(400).json({ message: 'Start date must be formatted as YYYY-MM-DD' });
    }

    if (endDate && !dateRegex.test(endDate)) {
        return res.status(400).json({ message: 'End date must be formatted as YYYY-MM-DD' });
    }

    next();
};
