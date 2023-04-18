import { Client } from "pg";
import { DB as DBConfig } from "../common/const";
import { Book } from "../common/types";

export default class BookModel {
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
      await this.client.query(`CREATE TABLE IF NOT EXISTS books (
         id VARCHAR(255) UNIQUE NOT NULL,
         userid VARCHAR(255) UNIQUE NOT NULL,
         title VARCHAR(255) NOT NULL,
         author VARCHAR(255) NOT NULL,
         signature VARCHAR(255) NOT NULL,
         path VARCHAR(255) NOT NULL,
         cover VARCHAR(255) NOT NULL
        )
        `);
    } catch (error) {
      throw error;
    }
  }

  async bookExists(bookid: string): Promise<boolean> {
    const result = await this.client.query("SELECT EXISTS (SELECT 1 FROM books WHERE id = $1)", [bookid])
    return result.rows[0].exists
  } 


  async getBooks(): Promise<Array<Book> | null> {
    try {
      let response = await this.client.query("SELECT * FROM books");
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

  async deleteBook(bookid: string, userid?: string) {
    try {
      await this.client.query(`DELETE FROM books WHERE id = $1 ${userid && "AND userid = $2"}`, [bookid, userid ?? ""]);
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
