import 'source-map-support/register';

// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { products } from '../products';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { findProduct } from '@functions/findProduct';

// import schema from './schema';

const getProductsById = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters.productId;
  return formatJSONResponse(findProduct(products, id));
};

export const main = middyfy(getProductsById);
