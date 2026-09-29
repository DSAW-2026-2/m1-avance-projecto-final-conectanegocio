import { distributors } from './organizations.js';
import { products } from './products.js';

export const supplierOffers = products.flatMap((product, productIndex) =>
  distributors.map((distributor, distributorIndex) => ({
    id: `of${String(productIndex * distributors.length + distributorIndex + 1).padStart(3, '0')}`,
    productId: product.id,
    distributorId: distributor.id,
    price: 4200 + productIndex * 430 + distributorIndex * 260,
    stock: 35 + ((productIndex + 2) * (distributorIndex + 3)) % 90,
    deliveryDays: distributor.deliveryDays ?? distributorIndex + 2,
  })),
);
