import Randomizer from "../lib/randomizer.js";

const simpleShuffle = () => {
    return {
        id: 'simple_substitution',
        name: 'Simple Shuffle',
        seed: true,
        legend(alphabet, seed) {
            let legend = {}
            let digits = alphabet.length
            let symbols = [...alphabet]

            let rnd = Randomizer().get()
            rnd.init_seed(seed);

            for (let step = 0; step < digits; step++) {
                let symbol = symbols.splice(rnd.random_int() % (symbols.length), 1);
                legend[alphabet[step]] = symbol[0]
            }

            return legend;
        }
    }
};

export default simpleShuffle();
