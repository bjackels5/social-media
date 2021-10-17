const { Schema, model, Types } = require('mongoose');
const dayjs = require('dayjs');

const ReactionSchema = new Schema(
    {
        reactionId: { // avoid confusion with parent comment _id
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            trim: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dayjs(createdAtVal).format("MMM D, YYYY [at] h:mma")
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

const ThoughtSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        thoughtText: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dayjs(createdAtVal).format("MMM D, YYYY [at] h:mma")
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get( () => {
    return this.reactions ? this.reactions.length : 0;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;