export function getOffersForProduct(productId, offers, distributors) {
  return offers.filter((offer) => offer.productId === productId)
    .map((offer) => ({ ...offer, distributor: distributors.find(({ id }) => id === offer.distributorId) }))
    .filter(({ distributor }) => distributor);
}

export const sortOffersByPrice = (offers) => [...offers].sort((a, b) => a.price - b.price);
export const sortOffersByDelivery = (offers) => [...offers].sort((a, b) => a.deliveryDays - b.deliveryDays);
export const sortOffersByStock = (offers) => [...offers].sort((a, b) => b.stock - a.stock);

export function getSupplierOrders(orders, distributorId) {
  return orders.filter((order) => order.orderType === 'supplier' && order.distributorId === distributorId);
}
