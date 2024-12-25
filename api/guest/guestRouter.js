import express from 'express';
import {login, join} from './guestController.js';

const guestRouter = express.Router();

guestRouter.post('/login', login);
guestRouter.post('/join', join);

export default guestRouter;