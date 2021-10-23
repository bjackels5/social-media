const { Schema, model, Types } = require('mongoose');
const dayjs = require('dayjs');

// Just creating the Schema for Reactions, no Model
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
        _id: false
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
        reactions: [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

// Note to self: do NOT change this to '.get( () => {' notation - you won't have access to 'this'.
ThoughtSchema.virtual('reactionCount').get( function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;