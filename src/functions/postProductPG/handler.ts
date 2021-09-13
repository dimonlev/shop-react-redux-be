import { EventType } from '@functions/EventType';
import { ProductPostType } from '@functions/ProductPostType';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

export const postProductPG = async (event: EventType) => {
  const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } =
    process.env;
  const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
  };
  const client = new Client(dbOptions);
  await client.connect();
  let query = `SELECT * FROM products INNER JOIN stocks ON product_id = id`;
  const body: ProductPostType = await event.body;

  try {
    await client.query(`BEGIN`);
    await client.query(
      `
        WITH insert_data AS (
            INSERT INTO products (title, description, price) VALUES ('${body.title}', '${body.description}', ${body.price})
            RETURNING id
        ),
        insert_stock AS (INSERT INTO stocks(count,product_id) VALUES (${body.count}, (SELECT id FROM insert_data)))` +
        query
    );
    await client.query(`COMMIT`);
    const { rows: data } = await client.query(query);
    return {
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
};

export const main = middyfy(postProductPG);
