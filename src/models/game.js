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
            players: {
                type: Array,
                required: true,
                default: [],
            },
            turn: {
                type: Number,
                required: true,
                default: 0,
            },
            word: {
                type: String,
                required: true,
                default: "",
            },
            good: {
                type: Array,
                required: true,
                default: [],
            },
            bad: {
                type: Number,
                required: true,
                default: 0,
            },
            availableLetters: {
                type: Array,
                required: true,
                default: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(""),
            },
            win: {
                type: Boolean,
                required: true,
                default: false,
            },
            lose: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        {
            timestamps: false,
            versionKey: false,
        }
    )
);
