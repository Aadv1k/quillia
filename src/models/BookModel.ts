import { Client } from "pg";
import { DB as DBConfig } from "../common/const";
import { Book } from "../common/types";

export default class BookModel {
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

  async getBooks(userid: string): Promise<Array<Book> | null> {
    try {
      let response = await this.client.query("SELECT * FROM books WHERE userid = $1", [userid]);
      return response.rows;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async pushBook(book: Book): Promise<Book | null> {
    try {
      await this.client.query(`
        INSERT INTO books (id, userid, author, title, path, cover, signature) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
        [book.id, book.userid, book.author, book.title, book.path, book?.cover ?? "", book.signature]
      )
      return book;
    } catch (error) {
      console.error(error); 
      return null;
    }
  }

  async deleteBook(bookid: string) {
    try {
      await this.client.query("DELETE FROM books WHERE id = $1", [bookid]);
      return bookid;
    } catch (error) {
      console.error(error); 
      return null;
    }
  }

  async getBook(bookid: string, sig?: string): Promise<Book | null> {
    try {
      const response = await this.client.query(`SELECT * FROM books WHERE ${bookid ? "id = $1" : "signature = $1"}`, [bookid || sig]);
      return response.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateBook() { /* TODO */ }

  async close(): Promise<void> {
    await this.client.end();
  }

}
