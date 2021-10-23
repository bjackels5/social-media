const { User, Thought } = require('../models');

const userController = {
    
    // get all users with their thoughts populated. Do NOT populate the friend list, just let the IDs be shown. I wanted
    // to make it show the friends usernames, but I could not find a way to suppress the friendCount virtual. I don't want
    // the entire info of the friends when loading ALL users, that would just be too much data and too unwieldy. But googling
    // how to suppress virtuals from running when using .populate specifically told me that it can't be done. Alrighty, then.
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .sort({username: "asc"})
            .select('-__v')
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one user with their thoughts and friends populated. Since it's just one user, it's ok to populate the
    // friend list
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

    // update user by id: it's really just the username or email that can be updated this way
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

    // delete a user, including removing them from all friend arrays and removing all of the user's thoughts from the dataabase.
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