INSERT INTO users (email, password, role, username) VALUES ('admin@naver.com','$2b$12$HDEyS866CzDnC5nfoEiHf.Qee/TwsKCi1pQOkbYrrnuuWxUe5ts6e', 'ADMIN', 'admin');

INSERT INTO categories (category_name) VALUES ('채소');
INSERT INTO categories (category_name) VALUES ('발효식품');
INSERT INTO categories (category_name) VALUES ('버섯류');
INSERT INTO categories (category_name) VALUES ('육류');
INSERT INTO categories (category_name) VALUES ('가공식품');
INSERT INTO categories (category_name) VALUES ('축산품');
INSERT INTO categories (category_name) VALUES ('곡류');
INSERT INTO categories (category_name) VALUES ('과일');

INSERT INTO storage_methods (storage_method_name) VALUES ('냉장');
INSERT INTO storage_methods (storage_method_name) VALUES ('실온');

INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (7, 14);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (10, 14);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (30, 60);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (5, 7);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (7, 10);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (3, 5);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (2, 4);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (2, 3);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (14, 21);
INSERT INTO shelf_lifes (sell_by_days, use_by_days) VALUES (180, 365);

-- 'items' 테이블에 데이터 삽입
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('김치', (SELECT category_id FROM categories WHERE category_name = '발효식품'),(SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'),(SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 14));

INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('토마토', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 14));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('방울토마토', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 10 AND use_by_days = 14));
-- INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('김치', (SELECT category_id FROM categories WHERE category_name = '발효식품'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 30 AND use_by_days = 60));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('가지', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 5 AND use_by_days = 7));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('오이', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 5 AND use_by_days = 7));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('애호박', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 5 AND use_by_days = 7));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('팽이버섯', (SELECT category_id FROM categories WHERE category_name = '버섯류'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('새송이버섯', (SELECT category_id FROM categories WHERE category_name = '버섯류'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('돼지고기', (SELECT category_id FROM categories WHERE category_name = '육류'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 3 AND use_by_days = 5));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('닭고기', (SELECT category_id FROM categories WHERE category_name = '육류'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 2 AND use_by_days = 4));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('소고기', (SELECT category_id FROM categories WHERE category_name = '육류'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 3 AND use_by_days = 5));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('두부', (SELECT category_id FROM categories WHERE category_name = '가공식품'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 2 AND use_by_days = 3));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('콩나물', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 2 AND use_by_days = 3));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('대파', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('양파', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '실온'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 30 AND use_by_days = 60));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('마늘', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '실온'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 30 AND use_by_days = 60));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('시금치', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 3 AND use_by_days = 5));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('고추', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('깻잎', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 3 AND use_by_days = 5));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('당근', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 14 AND use_by_days = 21));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('감자', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '실온'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 30 AND use_by_days = 60));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('고구마', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '실온'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 30 AND use_by_days = 60));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('계란', (SELECT category_id FROM categories WHERE category_name = '축산품'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 14 AND use_by_days = 21));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('무', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 14 AND use_by_days = 21));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('파프리카', (SELECT category_id FROM categories WHERE category_name = '채소'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('게맛살', (SELECT category_id FROM categories WHERE category_name = '가공식품'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('쌀', (SELECT category_id FROM categories WHERE category_name = '곡류'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '실온'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 180 AND use_by_days = 365));
INSERT INTO items (item_name, category_id, storage_method_id, shelf_life_id) VALUES ('어묵', (SELECT category_id FROM categories WHERE category_name = '가공식품'), (SELECT storage_method_id FROM storage_methods WHERE storage_method_name = '냉장'), (SELECT shelf_life_id FROM shelf_lifes WHERE sell_by_days = 7 AND use_by_days = 10));
