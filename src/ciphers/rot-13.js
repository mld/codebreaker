const rot13 = () => {
  return {
    id: "rot13",
    name: "ROT13",
    legend(alphabet) {
      let legend = {};
      const shift_characters = 13;
      for (let step = 0; step < alphabet.length; step++) {
        legend[alphabet[step]] = alphabet[(step + shift_characters) % alphabet.length];
      }

      return legend;
    },
  };
};

export default rot13();
