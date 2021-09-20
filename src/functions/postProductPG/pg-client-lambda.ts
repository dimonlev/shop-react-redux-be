import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  username: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

const pgClientLambda = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const ddlExtension = await client.query(
      `
      create extension if not exists "uuid-ossp"
      `
    );

    const ddlResult = await client.query(
      `
        create table products (
        id uuid primary key default uuid_generate_v4(),
        title text not null,
        description text,
        price integer)
      `
    );

    const ddlResult2 = await client.query(
      `
        create table stocks (
        count integer,
        product_id uuid primary key,
        foreign key ("product_id") references "products" ("id"))
      `
    );
  } catch (error) {
    console.error('Error during database executing: ', error);
  }
};
