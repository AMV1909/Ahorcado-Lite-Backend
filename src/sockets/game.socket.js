import { game } from "../models/game.js";
import { generateWord } from "../utils/generateWord.js";
import { removeTilde } from "../utils/removeTilde.js";

export const gameSocket = (io) => {
    io.on("connection", async (socket) => {
        socket.on("joinGame", async (player) => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data) {
                        //If the player is not in the game, add it as an object with the socket id and the player
                        if (!data.players.some((p) => p.id == socket.id)) {
                            data.players.push({ id: socket.id, name: player });
                        }

                        await game
                            .updateOne({ _id: 1 }, data)
                            .then(() => io.emit("game", data))
                            .catch((err) => console.log(err));
                    } else {
                        let word = generateWord();

                        while (word.length > 10) {
                            word = generateWord();
                        }

                        await game
                            .create({
                                players: [socket.id],
                                word: toUpperCase(),
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
                .findOneAndReplace(
                    { _id: 1 },
                    {
                        word: toUpperCase(),
                    },
                    { new: true }
                )
                .then((data) => {
                    io.emit("game", data);
                    io.emit("resetGame");
                })
                .catch((err) => console.log(err));
        });

        socket.on("letterSelected", async (letter) => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    data.turn = (data.turn + 1) % data.players.length;

                    if (removeTilde(data.word).includes(letter)) {
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

                    data.win = true;
                    data.word.split("").forEach((wordLetter) => {
                        if (!data.good.includes(wordLetter)) {
                            data.win = false;
                        }
                    });

                    await game
                        .updateOne({ _id: 1 }, data)
                        .then(() => io.emit("game", data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        });

        socket.on("disconnect", async () => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data) {
                        data.turn = 0;

                        data.players = data.players.filter(
                            (player) => player.id != socket.id
                        );

                        await game
                            .updateOne({ _id: 1 }, data)
                            .then(() => io.emit("game", data))
                            .catch((err) => console.log(err));
                    }
                })
                .catch((err) => console.log(err));
        });
    });
};
