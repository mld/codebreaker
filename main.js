import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import collapse from '@alpinejs/collapse'
import symbolShuffle from "./src/ciphers/symbol-shuffle.js";
import caesar from "./src/ciphers/caesar.js";
import simpleShuffle from "./src/ciphers/simple-shuffle.js";
import rot13 from "./src/ciphers/rot-13.js";
import swedish from "./src/symbols-sets/swedish.js";
import english from "./src/symbols-sets/english.js";
import symbols from "./src/symbols-sets/symbols.js";

Alpine.plugin(persist)
Alpine.plugin(collapse)

window.Alpine = Alpine

Alpine.data('game', function () {
    return {
        fromSymbolSet: this.$persist('swedish'),
        toSymbolSet: 'symbols',
        cipher: this.$persist('symbol_shuffle'),
        seed: this.$persist(Math.round(Math.random() * 0xDEADBEEF)),
        steps: this.$persist(Math.round((Math.random() * 0xDEADBEEF) % 26) + 1),
        message: this.$persist('Hello World'),
        legend: {},
        reverseLegend: {},
        languages: ['swedish', 'english'],
        words: "",
        settingsModal: false,

        reset() {
            this.fromSymbolSet = 'swedish';
            this.cipher = 'symbol_shuffle';
            this.message = 'Hello World';
            this.randomSeed();
            this.randomSteps();
            this.initCipher()
        },

        randomSeed() {
            this.seed = Math.round(Math.random() * 0xDEADBEEF);
        },

        randomSteps() {
            this.steps = Math.round((Math.random() * 0xDEADBEEF) % 26) + 1;
        },

        symbolSets: {
            swedish: swedish,
            english: english,
            symbols: symbols,
        },

        initCipher() {
            if (this.ciphers[this.cipher].symbols === true) {
                this.toSymbolSet = this.symbolSets.symbols.id;
            } else {
                this.toSymbolSet = this.fromSymbolSet;
            }
        },

        ciphers: {
            symbol_shuffle: symbolShuffle,
            caesar: caesar,
            simple_substitution: simpleShuffle,
            rot13: rot13,
        },


        splitWords() {
            if (this.message.length === 0) {
                this.words = [];
                return;
            }

            let message = '';
            [...this.message.toLowerCase()].forEach(c => message += Object.hasOwn(this.legend, c) ? c : ' ');

            let words = message.match(/\S+/g);
            if (words === null) {
                this.words = [];
                return;
            }

            let codeWords = [];
            words.forEach((word) => {
                let codeWord = [];
                [...word].forEach(c => codeWord.push(Object.hasOwn(this.legend, c) ? this.legend[c] : ''))
                codeWords.push(codeWord)
            });

            this.words = codeWords;
        },

        updateLegend() {
            // Parameters to the cipher.legend() function must come in the order below

            let params = [];

            // the alphabet is always supplied
            let alphabet = [...this.symbolSets[this.fromSymbolSet].alphabet];
            params.push(alphabet);

            // symbols
            if (this.ciphers[this.cipher].symbols) {
                let symbols = [...this.symbolSets.symbols.alphabet];
                params.push(symbols);
            }

            // seed
            if (this.ciphers[this.cipher].seed) {
                params.push(this.seed);
            }

            // steps
            if (this.ciphers[this.cipher].steps) {
                params.push(this.steps);
            }

            // fetch the legend from the selected cipher
            this.legend = this.ciphers[this.cipher].legend(...params);

            // also save the reverse lookup table for legends, for ease of use
            this.reverseLegend = {};
            for (const [key, value] of Object.entries(this.legend)) {
                this.reverseLegend[value] = key;
            }

            return this.legend;
        },

        messageFilter() {
            let message = '';
            if (this.message.length > 0) {
                [...this.message].forEach(c => message += (this.validCharacter(c)) ? c : '');
                this.message = message;
            }
        },

        validCharacter(key) {
            return (Object.hasOwn(this.legend, key.toLowerCase()) || key === ' ');
        },

        onKeyPress(key) {
            if (this.validCharacter(key)) {
                this.message += key;
            } else if (key === 'Backspace' && this.message.length > 0 && !this.settingsModal) {
                this.message = this.message.slice(0, -1)
            }
            // ignore any characters we don't care about
        },

        init() {
            this.updateLegend();
            this.splitWords();

            this.$watch('seed, steps, cipher, fromSymbolSet, toSymbolSet', (value) => {
                this.updateLegend();
                this.splitWords();
            });
            this.$watch('message', () => {
                this.messageFilter();
                this.splitWords();
            });
        },
    }
});

Alpine.start()
