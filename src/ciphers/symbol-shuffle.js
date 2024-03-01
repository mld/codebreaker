import Randomizer from "../lib/randomizer.js";

const symbolShuffle = () => {
    return {
        id: 'symbol_shuffle',
        name: 'Symbol Shuffle',
        symbols: true,
        seed: true,
        legend(alphabet, symbols, seed) {
            let digits = alphabet.length
            let legend = {}

            // initialize randomizer with custom seed, making the legend repeatable
            let rnd = Randomizer().get()
            rnd.init_seed(seed);

            // generate the legend
            for (let step = 0; step < digits; step++) {
                let symbolNo = rnd.random_int() % (symbols.length);
                let symbol = symbols.splice(symbolNo, 1);
                legend[alphabet[step]] = symbol[0]
            }
            return legend;
        }
    }
};

export default symbolShuffle();

