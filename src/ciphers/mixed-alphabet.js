const mixedAlphabet = () => {
  return {
    id: "mixed_alphabet",
    name: "Mixed Alphabet",
    keyword: true,
    legend(alphabet, keyword = "zebras") {
      let legend = {};

      // make sure the characters we use are unique, even when characters are duplicated
      let characters = [...new Set([...keyword, ...alphabet])];

      for (let step = 0; step < alphabet.length; step++) {
        legend[alphabet[step]] = characters[step];
      }

      return legend;
    },
  };
};

export default mixedAlphabet();
