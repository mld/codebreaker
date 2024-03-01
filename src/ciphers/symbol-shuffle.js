import MersenneTwister from "mersenne-twister";

const symbolShuffle = () => {
  return {
    id: "symbol_shuffle",
    name: "Symbol Shuffle",
    symbols: true,
    seed: true,
    legend(alphabet, symbols, seed) {
      const digits = alphabet.length;
      let legend = {};

      // initialize randomizer with custom seed, making the legend repeatable
      const rnd = new MersenneTwister();
      rnd.init_seed(seed);

      // generate the legend
      for (let step = 0; step < digits; step++) {
        const symbolNo = rnd.random_int() % symbols.length;
        const symbol = symbols.splice(symbolNo, 1);
        legend[alphabet[step]] = symbol[0];
      }
      return legend;
    },
  };
};

export default symbolShuffle();
