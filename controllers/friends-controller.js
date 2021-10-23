const { User } = require('../models');

const friendsController = {
    createFriendship({ params }, res) {
        // userId and friendId are both in params
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $addToSet: { friends: params.userId } },
            { new: true }
        )
            .then(dbFriendData => {
                if (!dbFriendData) {
                    res.status(404).json({ message: 'No friend found with this id!' });
                    return;
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $addToSet: { friends: params.friendId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ mesage: "No user found with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));

    },

    removeFriendship({params}, res) {
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: params.userId } },
            { new: true }
        )
            .then(dbFriendData => {
                if (!dbFriendData) {
                    res.status(404).json({ message: 'No friend found with this id!' });
                    return;
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { friends: params.friendId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ mesage: "No user found with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    }
}

module.exports = friendsController;