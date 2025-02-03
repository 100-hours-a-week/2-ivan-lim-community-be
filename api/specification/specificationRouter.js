import express from 'express';
import { test } from './specificationController.js';

const specificationRouter = express.Router();


specificationRouter.get("/check-nickname",test);

export default specificationRouter;