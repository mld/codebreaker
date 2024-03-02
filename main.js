import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import collapse from "@alpinejs/collapse";
import symbolShuffle from "./src/ciphers/symbol-shuffle.js";
import caesar from "./src/ciphers/caesar.js";
import simpleShuffle from "./src/ciphers/simple-shuffle.js";
import rot13 from "./src/ciphers/rot-13.js";
import swedish from "./src/symbols-sets/swedish.js";
import english from "./src/symbols-sets/english.js";
import symbols from "./src/symbols-sets/symbols.js";

Alpine.plugin(persist);
Alpine.plugin(collapse);

window.Alpine = Alpine;

Alpine.data("game", function () {
  return {
    fromSymbolSet: this.$persist("english"),
    fromSymbolSetFont: "",
    toSymbolSet: "symbols",
    toSymbolSetFont: "",
    cipher: this.$persist("symbol_shuffle"),
    seed: this.$persist(Math.round(Math.random() * 0xdeadbeef)),
    steps: this.$persist(Math.round((Math.random() * 0xdeadbeef) % 26) + 1),
    message: this.$persist("Hello World"),
    legend: {},
    languages: ["swedish", "english"],
    words: "",
    decodedWords: "",
    settingsModal: false,

    reset() {
      this.cipher = "symbol_shuffle";
      this.message = "Hello World";
      this.randomSeed();
      this.randomSteps();
      this.initCipher();
    },

    randomSeed() {
      this.seed = Math.round(Math.random() * 0xdeadbeef);
    },

    randomSteps() {
      this.steps = Math.round((Math.random() * 0xdeadbeef) % 26) + 1;
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

      this.fromSymbolSetFont = this.symbolSets[this.fromSymbolSet].font;
      this.toSymbolSetFont = this.symbolSets[this.toSymbolSet].font;
    },

    ciphers: {
      symbol_shuffle: symbolShuffle,
      caesar: caesar,
      simple_substitution: simpleShuffle,
      rot13: rot13,
    },

    encode() {
      if (this.message.length === 0) {
        this.decodedWords = [];
        this.words = [];
        return;
      }

      let message = "";
      [...this.message.toLowerCase()].forEach((c) => (message += Object.hasOwn(this.legend, c) ? c : " "));

      const words = message.match(/\S+/g);
      if (words === null) {
        this.decodedWords = [];
        this.words = [];
        return;
      }

      let codeWords = [];
      let clearWords = [];
      words.forEach((word) => {
        let codeWord = [];
        let clearWord = [];
        [...word].forEach((c) => {
          codeWord.push(Object.hasOwn(this.legend, c) ? this.legend[c] : "");
          clearWord.push(Object.hasOwn(this.legend, c) ? c : "");
        });
        codeWords.push(codeWord);
        clearWords.push(clearWord);
      });

      this.decodedWords = clearWords;
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

      return this.legend;
    },

    messageFilter() {
      let message = "";
      if (this.message.length > 0) {
        [...this.message].forEach((c) => (message += this.validCharacter(c) ? c : ""));
        this.message = message;
      }
    },

    validCharacter(key) {
      return Object.hasOwn(this.legend, key.toLowerCase()) || key === " ";
    },

    onKeyPress(key) {
      if (this.validCharacter(key)) {
        this.message += key;
      } else if (key === "Backspace" && this.message.length > 0 && !this.settingsModal) {
        this.message = this.message.slice(0, -1);
      }
      // ignore any characters we don't care about
    },

    init() {
      this.initCipher();
      this.updateLegend();
      this.encode();

      this.$watch("seed, steps, cipher, fromSymbolSet", () => {
        this.initCipher();
        this.updateLegend();
        this.encode();
      });
      this.$watch("message", () => {
        this.messageFilter();
        this.encode();
      });
    },
  };
});

Alpine.start();
