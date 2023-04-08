import { game } from "../models/game.js";
import { generateWord } from "../utils/generateWord.js";
import { removeTilde } from "../utils/removeTilde.js";

export const gameSocket = (io) => {
    io.on("connection", (socket) => {
        // let gameData = {
        //     _id: 1,
        //     word: "",
        //     good: [],
        //     bad: 0,
        //     availableLetters: [],
        //     win: false,
        //     lose: false,
        // };

        socket.on("game", async () => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data) {
                        io.emit("game", data);
                    } else {
                        let word = generateWord();

                        while (word.length > 10) {
                            word = generateWord();
                        }

                        await game
                            .create({
                                _id: 1,
                                word: removeTilde(word).toUpperCase(),
                                good: [],
                                bad: 0,
                                availableLetters:
                                    "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(""),
                                win: false,
                                lose: false,
                            })
                            .then((data) => io.emit("game", data))
                            .catch((err) => console.log(err));
                    }
                })
                .catch((err) => console.log(err));
        });

        socket.on("resetGame", async () => {
            let word = generateWord();

            while (word.length > 10) {
                word = generateWord();
            }

            await game
                .findOneAndUpdate(
                    { _id: 1 },
                    {
                        _id: 1,
                        word: removeTilde(word).toUpperCase(),
                        good: [],
                        bad: 0,
                        availableLetters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(
                            ""
                        ),
                        win: false,
                        lose: false,
                    },
                    { new: true }
                )
                .then((data) => io.emit("resetGame", data))
                .catch((err) => console.log(err));
        });

        socket.on("letterSelected", async (letter) => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data.word.includes(letter)) {
                        data.good.push(letter);
                    } else {
                        data.bad++;
                    }

                    data.availableLetters = data.availableLetters.filter(
                        (l) => l !== letter
                    );

                    if (data.bad == 9) {
                        data.lose = true;
                    }

                    if (data.good.length == data.word.length) {
                        data.win = true;
                    }

                    console.log(data);

                    await game
                        .updateOne({ _id: 1 }, data)
                        .then(() => io.emit("letterSelected", data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        });
    });
};
