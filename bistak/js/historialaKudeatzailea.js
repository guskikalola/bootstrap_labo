export default class HistorialaKudeatzailea {
    /**
     * @type {HistorialaKudeatzailea}
     */
    static _instance = null;

    static getInstance() {
        if (!HistorialaKudeatzailea._instance) HistorialaKudeatzailea._instance = new HistorialaKudeatzailea();
        return HistorialaKudeatzailea._instance;
    }

    constructor() {
        this._memoria = new Set();
    }

    /**
     * @returns {number[]} Bisitatutako akten id-ak
     */
    getHistoriala() {
        return localStorage.getItem("historiala") ? JSON.parse(localStorage.getItem("historiala")) : [];
    }

    /**
     * Gehitu akta bat historialera
     * @param {number} id Bisitatu den aktaren id-a 
     */
    gordeHistorialan(id) {
        if (!localStorage.getItem("historiala"))
            localStorage.setItem("historiala", JSON.stringify([]));
        if (articulos[id]) {
            let historiala = this.getHistoriala();
            if (historiala.indexOf(id) == -1) {
                historiala.push(id);
                localStorage.setItem("historiala", JSON.stringify(historiala));
            }
        }
        else throw new Error("Ez da exititzen id hori duen artikulurik. Id: " + id);
    }
}