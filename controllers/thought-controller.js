const { Thought, User } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        console.log("getAllThought");
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getThoughtById({params}, res) {
        Thought.findOne({_id: params.thoughtId })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: `No Thought found with this id`});
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // add thought to user
    addThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => { // _id is the thought id
                console.log(`adding a thought to userId: ${body.userId}`);
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbData);
            })
            .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, body, { new: true, runValidators: true })
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbData);
            })
            .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbData);
            })
            .catch(err => res.json(err));
    },

    // remove a thought from a user
    removeThought({ params, body }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));

    },

    updateReaction({ params, body }, res) {
        // how do I get the reaction in the array? is there a mongoose array function similar to $pull and $push for $update?
        // Thought.findOneAndUpdate({_id: params.thoughtId}, body, { new: true, runValidators: true })
        //     .then(dbData => {
        //         if (!dbData) {
        //             res.status(404).json({ message: 'No Thought found with this id!' });
        //             return;
        //         }
        //         res.json(dbData);
        //     })
        //     .catch(err => res.json(err));
    },

    // remove a reaction from a thought
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
            .then(dbData => res.json(dbData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;