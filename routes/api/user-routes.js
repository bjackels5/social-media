const router = require('express').Router();

// uc = user controller
// I like having to use uc.functionName (instead of just functionName) so that I can easily tell
// that I'm using a function from another file
const uc = require('../../controllers/user-controller.js');

const fc = require('../../controllers/friends-controller.js');

//Set up GET all ahd POST at /api/users
router
    .route('/')
    .get(uc.getAllUser)
    .post(uc.createUser);

//Set up GET one, PUT, and DELETE at /api/users/:id
router
    .route('/:id')
    .get(uc.getUserById)
    .put(uc.updateUser)
    .delete(uc.deleteUser);    

// Set up POST to create a friendship, DELETE to delete a friendship at /api/users/:userId/friends/:friendId
router
    .route('/:userId/friends/:friendId')
    .post(fc.createFriendship)
    .delete(fc.removeFriendship);


module.exports = router;