export default class User {

    public state: boolean;
    public created_at: Date;

    constructor(
        public name: string,
        public gmail: string,
        private password: string,
        public task_id?: number,
        public updated_at?: Date
    ) {
        this.state = true;
        this.created_at = new Date();

        
    }

}