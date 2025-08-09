import express from 'express';
import { Protect_router } from '../Middleware/Protect_Route.js';
import { DeleteMessage, GetMessage,GetStreamToken, SendMessage, UpdateMessage } from '../controllers/message.controller.js';
const router = express.Router();

router.use(Protect_router);
router.get('/token', GetStreamToken);
router.get('/:id',GetMessage)
router.delete('/:id',DeleteMessage)
router.post('/send/:id',SendMessage)
router.patch('/:id',UpdateMessage)

export default router;