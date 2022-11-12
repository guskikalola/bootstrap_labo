/**
 * @typedef {"CHVIEW"|"LOADED"|"MKWINDOW"} MezuMota
 */

export default class Mezua {
    /**
     * 
     * @param {MezuMota} opcode 
     * @param {string} data 
     */
    constructor(opcode,data) {
        this._opcode = opcode;
        this._data = data;
    }

    /**
     * @type {MezuMota}
     */
    get opcode() {
        return this._opcode;
    }

    /**
     * @type {string}
     */
    get data() {
        return this._data;
    }

    /**
     * @return {string}
     */
    toString() {
        return this.opcode + "@" + this.data;
    }

    /**
     * 
     * @param {string} mezua 
     * @returns {Mezua}
     */
    static parse(mezua) {
        let p = mezua.split("@");
        if(p.length < 2) 
            return undefined;
        let opcode = p[0];
        let data = p[1];
        return new Mezua(opcode,data);
    }

    /**
     * 
     * @param {MezuMota} opcode 
     * @param {string} data 
     */
    static sendMezua(opcode,data) {
        let mezua = new Mezua(opcode,data);
        window.top.postMessage(mezua.toString(), '*');
    }
}