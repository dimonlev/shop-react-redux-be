import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Client } from 'pg';

export const postProductPG = async (event: APIGatewayProxyEvent) => {
  const { title, description, price, count } = JSON.parse(
    JSON.stringify(event.body)
  );
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

  try {
    await client.connect();
    await client.query(`BEGIN`);
    const product = [title, description, price];
    const insertProduct =
      'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id';
    const { rows: id } = await client.query(insertProduct, product);
    console.log(product);
    const counts = [count, id[0].id];
    const insertProductCount =
      'INSERT INTO stocks (count, product_id) VALUES ($1, $2)';
    await client.query(insertProductCount, counts);

    await client.query(`COMMIT`);
    console.log(counts);
    const { rows: data } = await client.query(
      `SELECT products.id, products.title, products.price, products.description, stocks.count FROM products INNER JOIN stocks ON products.id=stocks.product_id where products.id='${id[0].id}'`
    );
    console.log('data', data[0]);
    return formatJSONResponse(data[0]);
  } catch (err) {
    throw new Error(err);
  } finally {
    client.end();
  }
};

export const main = middyfy(postProductPG);
