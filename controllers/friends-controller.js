const { User } = require('../models');
/*
From the requirements mockup, adding person1 to person2's friend list does not add person2 to person1's friend list. 
That's a follow, not a friend. I've implemented it so that it's a friendship: both users are added to each other's friend list.
*/

const friendsController = {
    // create a friendship between two users.
    createFriendship({ params }, res) {
        // userId and friendId are both in params

        // Add the friendship to friendId first, then add the friendship to userId. This way the User returned from
        // findOneAndUpdate will be userId and can be returned 
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

    // remove a friendship between two users
    removeFriendship({params}, res) {
        // Remove the friendship from friendId first, then remove the friendship from userId. This way the User returned from
        // findOneAndUpdate will be userId and can be returned 
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