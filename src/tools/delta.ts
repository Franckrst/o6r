export class DeltaModel{

    constructor(
        public key: string,
        public beffor: any,
        public after: any){}

    public hasDiff(){
        return JSON.stringify(this.beffor) !== JSON.stringify(this.after);
    }
}
