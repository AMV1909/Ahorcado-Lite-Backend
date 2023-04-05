import { Schema, model } from "mongoose";

export const game = model(
    "Game",
    new Schema(
        {
            _id: {
                type: Number,
                required: true,
                default: 1,
            },
            word: String,
            good: [String],
            bad: Number,
            availableLetters: [String],
            win: Boolean,
            lose: Boolean,
        },
        {
            timestamps: false,
            versionKey: false,
        }
    )
);
