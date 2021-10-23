const router = require('express').Router();

// uc = user controller
// I like having to use uc.functionName (instead of just functionName) so that I can easily tell
// that I'm using a function from another file
const uc = require('../../controllers/user-controller.js');

// fc = friendship controller
// I like having to use fc.functionName (instead of just functionName) so that I can easily tell
// that I'm using a function from another file
const fc = require('../../controllers/friends-controller.js');

// /api/users
router
    .route('/')
    .get(uc.getAllUser)
    .post(uc.createUser);

// /api/users/:id
router
    .route('/:id')
    .get(uc.getUserById)
    .put(uc.updateUser)
    .delete(uc.deleteUser);    

// /api/users/:userId/friends/:friendId
router
    .route('/:userId/friends/:friendId')
    .post(fc.createFriendship)
    .delete(fc.removeFriendship);


module.exports = router;