import MersenneTwister from "mersenne-twister";

export default function Randomizer(seed) {
    return {
        init() {
            this.get();
        },
        rnd : {},
        get(){
            this.rnd = new MersenneTwister()
            return this.rnd
        },
    }
}
