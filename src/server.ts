import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';


// **** Init express **** //

const app = express();


// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// **** Add API routes **** //

app.all('/', (req: Request, res: Response, next: NextFunction) => {
    // print body
    console.log(req.headers);
    console.log(req.body);
    const callback_url = req.query.callback_url;
    if (!callback_url)
        return res.status(400).send('Missing callback_url');
    res.status(200).json({
        state: 'success',
        description: 'Hello World',
        context: 'Hello World',
        target_url: null,
    });
});

// **** Export default **** //

export default app;
