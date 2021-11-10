import { middyfy } from '@libs/lambda';

export const imageUpload = async () => {
  console.log('hi');
};

export const main = middyfy(imageUpload);
