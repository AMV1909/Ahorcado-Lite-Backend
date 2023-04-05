import { game } from "../models/game.js";
import { generateWord } from "../utils/generateWord.js";
import { removeTilde } from "../utils/removeTilde.js";

export const gameSocket = (io) => {
    io.on("connection", (socket) => {
        let gameData = {
            _id: 1,
            word: "",
            good: [],
            bad: 0,
            availableLetters: [],
            win: false,
            lose: false,
        };

        socket.on("game", async () => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data) {
                        gameData = data;
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
                            .then((data) => (gameData = data))
                            .catch((err) => console.log(err));
                    }
                })
                .catch((err) => console.log(err));

            io.emit("game", gameData);
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
                .then((data) => (gameData = data))
                .catch((err) => console.log(err));

            io.emit("resetGame", gameData);
        });

        socket.on("letterSelected", async (letter) => {
            if (gameData.word.includes(letter)) {
                gameData.good.push(letter);
            } else {
                gameData.bad++;
            }

            gameData.availableLetters = gameData.availableLetters.filter(
                (l) => l !== letter
            );

            if (gameData.bad == 9) {
                gameData.lose = true;
            }

            if (gameData.good.length == gameData.word.length) {
                gameData.win = true;
            }

            await game
                .findOneAndUpdate({ _id: 1 }, gameData, { new: true })
                .then((data) => (gameData = data))
                .catch((err) => console.log(err));

            io.emit("letterSelected", gameData);
        });
    });
};
