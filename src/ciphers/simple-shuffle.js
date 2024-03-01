import MersenneTwister from "mersenne-twister";

const simpleShuffle = () => {
  return {
    id: "simple_substitution",
    name: "Simple Shuffle",
    seed: true,
    legend(alphabet, seed) {
      let legend = {};
      const digits = alphabet.length;
      let symbols = [...alphabet];

      const rnd = new MersenneTwister();
      rnd.init_seed(seed);

      for (let step = 0; step < digits; step++) {
        const symbol = symbols.splice(rnd.random_int() % symbols.length, 1);
        legend[alphabet[step]] = symbol[0];
      }

      return legend;
    },
  };
};

export default simpleShuffle();
