import express from 'express';

import {
    sendFriendRequestFriend,
    acceptFriendRequest,
    declineFriendRequest,
    getAllFriends,
    getFriendRequests
} from '../controllers/friendController.js';

const router = express.Router();

router.post('/requests', sendFriendRequestFriend);
router.post('/requests/:requestId/accept', acceptFriendRequest);
router.post('/requests/:requestId/decline', declineFriendRequest);
router.get('/', getAllFriends);
router.get('/requests', getFriendRequests);

export default router;