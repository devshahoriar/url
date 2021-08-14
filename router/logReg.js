import express from 'express';
import { dashboard, deleteUrl, logIn, logout, regS, regstrationPost, resetPage, resetPassCode, resetPost, signInPost, updataePass } from '../controller/logInreg.js';
import checkAuth from '../middleware/checkAuth.js';
import checkLogin from '../middleware/checkLogin.js';

const logInroute = express.Router();

logInroute.get('/login', checkAuth, logIn);
logInroute.post('/login', signInPost);
logInroute.get('/regs', checkAuth, regS);
logInroute.post('/regs', regstrationPost);
logInroute.get('/dashboard',checkLogin,dashboard)
logInroute.get('/logout', logout);
logInroute.get('/url/:del', checkLogin, deleteUrl);
logInroute.get('/reset', checkAuth, resetPage);
logInroute.post('/reset', checkAuth, resetPost);
logInroute.get('/reset/pass',resetPassCode);
logInroute.post('/reset/pass',updataePass);

export default logInroute;