import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/declarations/major/EnvVars';
import server from './server';


// **** Start server **** //

const msg = ('🐳 Docker Hub webhook is started on port: ' + EnvVars.port.toString());
server.listen(EnvVars.port, () => logger.info(msg));
