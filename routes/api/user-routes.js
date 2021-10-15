const router = require('express').Router();

// uc = user controller
// I like having to use uc.functionName so that I can easily tell that I'm using a function from
// another file
const uc = require('../../controllers/user-controller.js');


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

module.exports = router;