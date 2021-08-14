import Express from 'express';
import { index, postUrl, short } from '../controller/index.js';
import commonPage from '../middleware/commonPage.js';

const route = Express.Router();

route.get('/',commonPage ,index);
route.post('/', commonPage, postUrl);
route.get('/:url', short);


export default route;
