const router = require('express').Router();

const tc = require('../../controllers/thought-controller');

// /api/thoughts
router
    .route('/')
    .get(tc.getAllThought)
    .post(tc.addThought);


// /api/thoughts/<thoughtId>
router.route('/:thoughtId')
    .get(tc.getThoughtById)
    .put(tc.updateThought)
    .delete(tc.removeThought);

// /api/thoughts/<thoughtId>/reactions
router
    .route('/:thoughtId/reactions')
    .post(tc.addReaction);

// /api/thoughts/<thoughtId>/<reactionId>
router
    .route('/:thoughtId/:reactionId')
    .delete(tc.removeReaction)
    .ddlete(tc.updateReaction);

module.exports = router;