// const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');


const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Username is Required',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dayjs(createdAtVal).format("MMM D, YYYY [at] h:mma")
        },
        email: {
            type: String,
            unique: true,
            required: 'Email is Required',
            match: [/^[a-z0-9\.-_]+@[a-z0-9\.-]+\.[a-z]{2,6}$/]

        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Note to self: do NOT change this to '.get( () => {' notation - you won't have access to 'this'.
UserSchema.virtual('friendCount').get( function() {
    // return this.friends? this.friends.length : 0;
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;