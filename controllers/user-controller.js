const { User, Thought } = require('../models');

const userController = {
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .sort({username: "asc"})
            // .populate({
            //     path: 'friends',
            //     select: '-__v'
            // })
            .select('-__v')
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getUserById({params}, res) {
        User.findOne({_id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: `No User found with this id`});
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createUser({body}, res) {
        User.create(body)
            .then(dbData => res.json(dbData))
            .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, { new: true, runValidators: true })
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
            }

            res.json(dbData);
        })
        .catch(err => ers.status(400).json(err));
    },

    deleteUser({params}, res) {
        User.findOneAndDelete({ _id: params.id})
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
            }
            if (dbData.friends) {
                dbData.friends.forEach(friendId => {
                    User.findOneAndUpdate(
                        { _id: friendId },
                        { $pull: { friends: dbData._id } },
                        { new: true }
                    )
                    .then(friendUser => {
                        if (!friendUser) {
                            return res.status(404).json({ message: 'No users with this id!' });
                        }
                    })
                });
            }
            if (dbData.thoughts) {
                dbData.thoughts.forEach(thoughtId => {
                    Thought.findOneAndDelete({ _id: thoughtId})
                    .then(deletedThought => {
                        if (!deletedThought) {
                            return res.status(404).json({ message: 'No thoughts with this id!' });
                        }
                    })
                    .catch(err => res.status(400).json(err));
                });
            }
            res.json({ message: `User ${dbData.username} and their associated thoughts and friendships have been deleted.` });
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;