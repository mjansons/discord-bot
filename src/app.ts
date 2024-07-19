import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

const app = express();

app.use(helmet());

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Function was called');
    next();
});

app.route('/')
    .get((req: Request, res: Response) => {
        res.send('you made a get request');
    })
    .post((req: Request, res: Response) => {
        res.send('you made a post request');
    });

export default app;
