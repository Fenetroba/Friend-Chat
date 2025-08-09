import express from 'express';
import { Protect_router } from '../Middleware/Protect_Route.js';
import { FriendsList, FriendsRequest, getOutGoingReq, RecommendedUsers, RequestFriend, RequestFriend_accept, UpDateProfile,AllUsers } from '../controllers/User.controller.js';
const router = express.Router();

router.use(Protect_router);

router.get('/recommended-users',RecommendedUsers)
router.get('/friends-list',FriendsList)
router.post('/friends-request/:friendId',RequestFriend)
router.put('/friends-request/:requestId/accept',RequestFriend_accept)
router.get('/friends-request',FriendsRequest)
router.get('/getOutgoingReq',getOutGoingReq)
router.put('/UpdateProfile',UpDateProfile)
router.get('/all_users/:name',AllUsers)

export default router;