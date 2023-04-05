import { words, animals, types } from "palabras-aleatorias-data";

export const generateWord = () => {
    const typeWord = Math.floor(Math.random() * 3);
    switch (typeWord) {
        case 0:
            return words[Math.floor(Math.random() * words.length)].Word;
        case 1:
            return animals[Math.floor(Math.random() * animals.length)].name;
        case 2:
            return types[Math.floor(Math.random() * types.length)];
        default:
            break;
    }
};
