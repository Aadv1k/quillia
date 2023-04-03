import { Client } from "pg";
import { DB as DBConfig } from "../common/const";

import { v4 as uuid } from "uuid";

interface User {
  id: string;
  email: string;
  password: string;
}

export default class UserModel {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      user: DBConfig.USER,
      host: DBConfig.HOST,
      database: DBConfig.DB_NAME,
      password: DBConfig.PASSWORD,
      port: DBConfig.PORT,
      ssl: true
    })
  }

  async init(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error(error);
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

  async close(): Promise<void> {
    await this.client.end();
  }
}
