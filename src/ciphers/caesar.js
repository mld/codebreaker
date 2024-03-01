const caesar = () => {
    return {
        id: 'caesar',
        name: 'Caesar',
        steps: true,
        legend(alphabet, shift_characters = 1) {
            let legend = {}

            for (let step = 0; step < alphabet.length; step++) {
                legend[alphabet[step]] = alphabet[(step + shift_characters) % alphabet.length];
            }

            return legend;
        }
    }
};

export default caesar();
