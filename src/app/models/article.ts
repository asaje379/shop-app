export class Article {

    constructor(
        public id?: number,
        public lib?: string,
        public createdAt?: number,
        public lastUpdatedAt?: number,
        public isActive?: boolean,
        public quantite?: number
    ) {
        this.quantite = this.quantite ? this.quantite : 0;
        this.lib = this.lib ? this.lib : null;
        this.createdAt = this.lastUpdatedAt = Date.now();
        this.isActive = true;
    }
}
