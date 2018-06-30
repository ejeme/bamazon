DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INTEGER (10) NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price REAL,
  stock_quantity REAL
);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (1,"pasta","food",3.99,3);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (2,"babyformula","food",11.99,12);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (3,"toastedQuinoa","food",8.99,15);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (4,"candy","food",2.99,30);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (5,"cheetos","food",11.99,6);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (6,"cookingOil","food",7.99,24);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (7,"coffee","food",11.99,12);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (8,"tea","food",11.99,8);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (9,"oatbars","food",11.99,23);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (10,"maplesyrup","food",11.99,32);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (11,"nutella","food",11.99,14);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (12,"goldfish","food",11.99,31);

INSERT INTO products (item_id, product_name,department_name,price,stock_quantity)
VALUES (13,"oreos","food",11.99,17);
;