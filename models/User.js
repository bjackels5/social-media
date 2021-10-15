// const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');


const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: 'A user exists with this user name',
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
            unique: "A user exists with this email address",
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

UserSchema.virtual('friendCount').get(() => {
    return this.friends ? this.friends.length : 0;
});

const User = model('User', UserSchema);

module.exports = User;