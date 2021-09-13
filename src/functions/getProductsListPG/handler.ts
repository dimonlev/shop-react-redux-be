import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import {
  formatJSONProductResponse,
  formatJSONResponse,
} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { Client } from 'pg';

// const getProducts = async () => {
//   const client = new Client(dbOptions);
//   await client.connect();
//   const { rows: products } = await client.query(`select * from products`);
//   return products;
// };

export const getProductsListPG: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
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
  try {
    const { rows: products } = await client.query(
      `
      SELECT * FROM products INNER JOIN stocks ON product_id = id
      `
    );
    console.log(products);
    return formatJSONResponse(products);
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsListPG);
