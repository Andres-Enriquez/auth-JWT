import { MongoClient, Db } from "mongodb";

class Database {
    private db!: Db;

    // Conectar a la base de datos
    async connect() {
        try {
            const client = await MongoClient.connect('mongodb://localhost:27017');
            this.db = client.db('webauth');
            console.log('Connected to MongoDB!');
        } catch (err: any) {
            console.log(err);
        }
    }


    getDb(): Db {
        return this.db;
    }
}

export const database = new Database();
