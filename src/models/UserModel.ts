import { Client } from "pg";
import { DB as DBConfig } from "../common/const";
import { User } from "../common/types";

export default class UserModel {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      host: DBConfig.HOST,
      user: DBConfig.USER,
      password: DBConfig.PASSWORD,
      database: DBConfig.DB_NAME,
      port: DBConfig.PORT,
      ssl: true
    })
  }

  async init(): Promise<void> {
    try {
      await this.client.connect();
      await this.client.query(`
        CREATE TABLE IF NOT EXISTS users (
         id VARCHAR(255) UNIQUE NOT NULL,
         email VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL
        )
        `);
    } catch (error) {
      throw error
    }
  }


  async userExists(email?: string): Promise<boolean> {
    const result = await this.client.query("SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)", [email])
    return result.rows[0].exists
  } 


  async getUserByID(id: string): Promise<User | null> {
    try {
      const response = await this.client.query(
        `SELECT * FROM users 
        WHERE id = $1`, 
        [id]
      );
      return response.rows[0]
    } catch (error) {
      return null;
    }
  }

  async getUser(email: string, id?: string): Promise<User | null> {
    try {
      const response = await this.client.query(
        `SELECT * FROM users 
        WHERE email = $1
        OR id = $2`, 
        [email, id ?? ""]
      );
      return response.rows[0]
    } catch (error) {
      return null;
    }
  }

  async getUsers(): Promise <Array<object> | null> {
    try {
      let data = await this.client.query(`SELECT * FROM users`)
      return data.rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateUser(user: User, toUpdate: object ) {
    let blobs = Object.keys(toUpdate).map((e, i) => {return `${e} = \$${i+1}`})
    let toUpdateQuery = blobs.join(" AND ");
    let query = `UPDATE users SET ${toUpdateQuery} WHERE $1 OR $2`

    try {
      this.client.query(query, [user.id, user.email]);
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  async deleteUser(user: User): Promise<User | void> {
    try {
      await this.client.query(`DELETE FROM users WHERE id = $1 OR email = $2`, [user.id, user.email]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async pushUser(user: User): Promise<User | void> {
    try {
      await this.client.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3)", [user.id, user.email, user.password]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async pushTokenForUser(token: string, userid: string): Promise<void | null> {
    try {
      await this.client.query("INSERT INTO tokens (userid, token) VALUES ($1, $2)", [userid, token]);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteTokenForUser(token?: string, userid?: string): Promise<void | null>  {
    try {
      await this.client.query("DELETE FROM tokens WHERE token = $1 OR userid = $2", [token, userid]);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}
