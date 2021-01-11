import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import * as path from 'path';

import APIServer from './APIServer';
import Person from './entities/Person';

export const apiServer = new APIServer();
const fileName = path.resolve(__dirname, '../', 'entityDatabase');
export const db = new JsonDB(new Config(fileName, true, true, '/'));

apiServer.addEntity<Person>(Person);
apiServer.start();
