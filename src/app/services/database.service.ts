import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_USERS ='myuserdb';

export interface User{ 
  id:number
  name:string
  active:number
}
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  private sqlite:SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!:SQLiteDBConnection;

  private user:WritableSignal<User[]> =signal<User[]>([]);

  async initializPlugin(){
    this.db = await this.sqlite.createConnection(
      DB_USERS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, active INTEGER DEFAULT 1);`;

    await this.db.execute(schema);
    this.loadUsers();
    return true;
  }
  getUsers(){
    return this.user;
  }

  // CRUD 
  async loadUsers(){
    const users = await this.db.query(
      'SELECT * FROM users;'
    );
    this.user.set(users.values || [])
  }

  async addUser(name:string){
    const query = `INSERT INTO users (name) VALUES ('${name})`;
    const result = await this.db.query(query);
     this.loadUsers();
     return result;
  }

  async updateUserById(id:string, active:number)
{
  const query = `UPDATE users SET active=${active} WHERE id=${id}`;
  const result = await this.db.query(query);
  this.loadUsers();
  return result;
}

  async deleteUserById(id: string){
    const query = `DELETE FROM users WHERE id=${id}`;
    const result = await this.db.query(query);

    this.loadUsers();
    return result;
  }
}
