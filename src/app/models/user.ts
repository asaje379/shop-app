export class User {

    constructor(
        public id?: number,
        public username?: string,
        public password?: string,
        public isActive?: boolean,
        public createdAt?: number,
        public lastUpdatedAt?: number,
    ) {
        this.username = this.username ? this.username : null,
        this.password = this.password ? this.password : null, 
        this.isActive = true;
        this.createdAt = this.lastUpdatedAt = Date.now();
    }
}
