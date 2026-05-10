export function buildShopAddress(shop: {
  addressLine1?: string | null
  addressLine2?: string | null
  postalCode?: string | null
  city?: string | null
  country?: string | null
}): string {
  return [
    shop.addressLine1,
    shop.addressLine2,
    shop.postalCode,
    shop.city,
    shop.country,
  ]
    .filter(Boolean)
    .join(', ')
}
