import express, { Request, Response, NextFunction } from 'express';
import {Blob} from 'buffer';

import 'express-async-errors';


// **** Init express **** //

const app = express();


// **** Set basic express settings **** //

app.use(express.urlencoded({extended: true}));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(new Date() + " === Request " + req.method + ": " + req.url + " ===");
    //console.log('headers', req.headers);
    //console.log('body', req.body);
    //console.log('query', req.query);
    //console.log('params', req.params);
    //console.log("=== End Request ===");
    next();
});

// **** Add API routes **** //

app.all('/v2', (req: Request, res: Response) => {
    console.log("USE V2 API")
    res.setHeader('Docker-Distribution-API-Version', 'registry/2.0');
    res.setHeader("WWW-Authenticate", "Bearer realm=\"http://registry.me:3000/v2/auth/login\"");
    return (res.status(200).send());
});

app.get('/v2/auth/login', (req: Request, res: Response) => {
    console.log("GET V2 AUTH LOGIN")
    return (res.status(200).json({token: "1234567890"}));
});

// **** Pushing image **** //

app.head('/v2/:repository/:name/blobs/:digest', (req: Request, res: Response) => {
    const { repository, name, digest } = req.params;
    console.log("HEAD UPLOAD IMAGE", repository, name, digest);
    return (res.status(200).send());
});

app.post('/v2/:name/:image/blobs/uploads', express.raw({type: "*/*", limit : '1000mb'}), async (req: Request, res: Response) => {
    const { name, image } = req.params;
    const buffer = req.body
    //const blob = new Blob([buffer], {type: "application/octet-stream"});
    console.log(new Date() + " POST UPLOAD IMAGE: ", name, image);
    //console.log(await blob.arrayBuffer())
    res.setHeader('Location', 'http://registry.me:3000/v2/' + name + '/blobs/uploads/1234567890');
    res.setHeader('Docker-Upload-UUID', '1234567890');
    //res.setHeader('Range', '0-10');
    console.log(new Date() + " POST UPLOAD IMAGE END");
    return (res.status(202).send());
});

/**
 * Upload a chunk of data for the specified upload.
 *
 */
app.patch('/v2/:name/blobs/uploads/:hash', express.raw({type: "*/*", limit : '1000mb'}), (req: Request, res: Response) => {
    const { name, hash } = req.params;
    const buffer = req.body
    const blob = new Blob([buffer], {type: "application/octet-stream"});
    // print size in byte of body
    console.log(new Date() + " PATCH UPLOAD IMAGE: ", name, hash, blob.size);
    res.setHeader('Location', 'http://registry.me:3000/v2/' + name + '/blobs/uploads/' + hash);
    res.setHeader('Docker-Upload-UUID', '1234567890');
    //res.setHeader('Range', '0-10');
    console.log(new Date() + " PATCH UPLOAD IMAGE END");
    return (res.status(202).send());
});

/**
 * Completed Upload
 * For an upload to be considered complete, the client must submit a
 * PUT request on the upload endpoint with a digest parameter.
 * If it is not provided, the upload will not be considered complete.
 */
app.put('/v2/:name/blobs/uploads/:hash', (req: Request, res: Response) => {
    const { name, hash } = req.params;
    console.log("PUT UPLOAD IMAGE: ", name, hash);
    res.setHeader('Location', 'http://registry.me:3000/v2/' + name + '/blobs/uploads/' + hash);
    res.setHeader('Docker-Upload-UUID', '1234567890');
    //res.setHeader('Range', '0-0');
    return (res.status(201).send());
});

// **** Export default **** //

export default app;
