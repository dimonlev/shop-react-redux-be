import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import getProductsListPG from '@functions/getProductsListPG';
import 'dotenv';

const serverlessConfiguration: AWS = {
  service: 'shop-react-redux-be',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: 'shop-db.cgronwvbqq77.eu-west-1.rds.amazonaws.com',
      PG_PORT: '5432',
      PG_DATABASE: 'postgres',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: 'AUh3kaUyvlpDpcOqCYSU',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, getProductsListPG },
};

module.exports = serverlessConfiguration;
