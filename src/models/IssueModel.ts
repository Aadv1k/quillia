import { Client } from "pg";
import { DB as DBConfig } from "../common/const";
import { Issue } from "../common/types";

export default class IssueModel {
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

      await this.client.query(`
        CREATE TABLE issues IF NOT EXISTS (
         userid UUID NOT NULL
         issueid UUID NOT NULL
         bookid UUID NOT NULL
        )
        `);
    } catch (error) {
      console.error(error);
    }
  }

  async pushIssue(data: Issue) { /* TODO */}
  async removeIssue(data: Issue) { /* TODO */}
  async getIssue(data: Issue) { /* TODO */}


  async close(): Promise<void> {
    await this.client.end();
  }

}
