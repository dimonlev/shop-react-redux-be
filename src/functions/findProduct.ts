import { Product } from '@functions/ProductType';

export const findProduct = (arr: Product[], id: string) =>
  arr.find((product) => product.id === id);
