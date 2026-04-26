-- Delete all ShopCategory entries for the 'modest-fashion' category
DELETE FROM "ShopCategory" 
WHERE "categoryId" = (SELECT id FROM "Category" WHERE slug = 'modest-fashion');

-- Delete the 'modest-fashion' category
DELETE FROM "Category" WHERE slug = 'modest-fashion';
