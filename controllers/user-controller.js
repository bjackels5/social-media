const { User } = require('../models');

const userController = {
    getAllUser(req, res) {
        User.find({})
            // .populate({
            //     path: 'comments',
            //     select: '-__v'
            // })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getUserById({params}, res) {
        User.findOne({_id: params.id })
        // .populate({
        //     path: 'comments',
        //     select: '-__v'
        // })
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
            res.json(dbData);
        })
        .catch(err => res.status(400).json(err));
    }
};


module.exports = userController;