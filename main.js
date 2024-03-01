import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import collapse from '@alpinejs/collapse'
import Randomizer from "./randomizer.js";

Alpine.plugin(persist)
Alpine.plugin(collapse)

window.Alpine = Alpine

// Alpine.data('Randomizer', Randomizer)

Alpine.data('game', function () {
    return {
        fromSymbolSet: this.$persist('swedish'),
        toSymbolSet: 'symbols',
        cipher: this.$persist('symbol_shuffle'),
        seed: this.$persist(Math.round(Math.random() * 0xDEADBEEF)),
        steps: this.$persist(Math.round((Math.random() * 0xDEADBEEF) % 26) + 1),
        message: this.$persist('Hello World'),
        legend: {},
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
            swedish: {
                id: 'swedish',
                name: 'Swedish',
                alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'ä', 'ö'],
                font: '',
            },
            english: {
                id: 'english',
                name: 'English',
                alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
                font: '',
            },
            symbols: {
                id: 'symbols',
                name: 'Symbols',
                alphabet: ['🎶', '🎺', '♥️', '♦️', '♠️', '♣️', '🍒', '🍏', '🍌', '✈️', '🛸', '🚗', '🌜', '🌞', '⭐', '🤖', '☠️', '🍄', '🍀', '🐎', '🐈', '🐕', '🐀', '🦖', '🐢', '🦔', '👾', '👑', '🎈'],
                font: 'font-emoji',
            },
        },

        initCipher() {
            if (this.ciphers[this.cipher].symbols === true) {
                this.toSymbolSet = this.symbolSets.symbols.id;
            } else {
                this.toSymbolSet = this.fromSymbolSet;
            }
        },

        ciphers: {
            symbol_shuffle: {
                id: 'symbol_shuffle',
                name: 'Symbol Shuffle',
                symbols: true,
                seed: true,
                steps: false,
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
            },
            caesar: {
                id: 'caesar',
                name: 'Caesar',
                symbols: false,
                seed: false,
                steps: true,
                legend(alphabet, shift_characters = 1) {
                    let legend = {}

                    for (let step = 0; step < alphabet.length; step++) {
                        legend[alphabet[step]] = alphabet[(step + shift_characters) % alphabet.length];
                    }

                    return legend;
                }
            },
            simple_substitution: {
                id: 'simple_substitution',
                name: 'Shuffle',
                symbols: false,
                seed: true,
                steps: false,
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
            },
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
            // this function got bad fast, and will get worse if we add more ciphers needing other parameters
            // todo: find a way to clean this up, maybe adding params to an array and ...params them out?
            let alphabet = [...this.symbolSets[this.fromSymbolSet].alphabet];

            let needsSeed = this.ciphers[this.cipher].seed;
            let needsSteps = this.ciphers[this.cipher].steps;
            let needsSymbols = this.ciphers[this.cipher].symbols;

            if (needsSymbols) {
                let symbols = [...this.symbolSets.symbols.alphabet];

                if (needsSeed && needsSteps) {
                    this.legend = this.ciphers[this.cipher].legend(alphabet, symbols, this.seed, this.steps);
                } else if (!needsSeed && needsSteps) {
                    this.legend = this.ciphers[this.cipher].legend(alphabet, symbols, this.steps);
                } else if (needsSeed && !needsSteps) {
                    this.legend = this.ciphers[this.cipher].legend(alphabet, symbols, this.seed);
                }
            } else if (!needsSymbols && needsSeed) {
                if (needsSteps) {
                    this.legend = this.ciphers[this.cipher].legend(alphabet, this.seed, this.steps);
                } else if(!needsSteps) {
                    this.legend = this.ciphers[this.cipher].legend(alphabet, this.seed);
                }
            } else if (!needsSymbols && !needsSeed && needsSteps) {
                this.legend = this.ciphers[this.cipher].legend(alphabet, this.seed);
            }
            else {
                this.legend = this.ciphers[this.cipher].legend(alphabet)
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
