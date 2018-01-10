CREATE TABLE Categories(id BIGINT KEY AUTO_INCREMENT,
                        code VARCHAR(10) NOT NULL,
                        name VARCHAR(20) NOT NULL);
                        
INSERT INTO Categories(code,name)
VALUES ('SHMP', 'Shampoo'),
('BSOAP', 'Bath Soap'),
('TPST', 'Tooth Paste');
 
CREATE TABLE Items(id BIGINT KEY AUTO_INCREMENT,
                  category_id BIGINT NOT NULL,
                  code VARCHAR(10) NOT NULL,
                  name VARCHAR(50) NOT NULL);
                   
INSERT INTO Items(category_id, code, name)
VALUES (2, 'SFG', 'Safeguard'),
(2, 'DVE', 'Dove'),
(1, 'PLMLV', 'Palmolive'),
(3, 'CLGT', 'Colgate'),
(1, 'CLR', 'Clear'),
(3, 'HPY', 'Hapee'),
(3, 'CLSUP', 'Close Up'),
(2, 'LKS', 'Likas'),
(1, 'SSLK', 'Sunsilk'),
(1, 'HDS', 'Head & Shoulders'),
(2, 'MXPL', 'Maxipeel'),
(2, 'SFG', 'Safe Guard'),
(1, 'RJC', 'Rejoice'),
(3, 'KTTAP', 'Kutitap'),
(2, 'SCR', 'Secvure'),
(3, 'UNQ', 'Unique'),
(1, 'VSLN', 'Vaseline');

CREATE TABLE Allocation(id BIGINT KEY AUTO_INCREMENT,
                        item_id BIGINT NOT NULL,
                        allocation BIGINT NOT NULL);
                        
INSERT INTO Allocation(item_id, allocation)
SELECT id, RAND()*(101-10)+10 FROM Items;

CREATE TABLE Prices(id BIGINT KEY AUTO_INCREMENT,
                    item_id BIGINT NOT NULL,
                    price BIGINT NOT NULL);
                    
INSERT INTO Prices(item_id, price)
SELECT id, RAND()*(50-10)+10 FROM Items;

CREATE TABLE TransactionMaster(id BIGINT KEY AUTO_INCREMENT,
                         item_id BIGINT NOT NULL,
                         quantity BIGINT NOT NULL,
                         transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
                         
INSERT INTO TransactionMaster(item_id, quantity)
SELECT Items.id, RAND()*(Allocation.allocation-0)
FROM Items
JOIN Allocation
ON Allocation.item_id = Items.id;

#All question requires the use of column aliasing. See Required Columns

#1
#Display all items with the corresponding allocation and price based on Categories and sort both Category Name and Item Name alphabetically descending.
#Peso currency sign is REQUIRED in Price column and add 2 decimals
#Required Columns: Category Code, Category Name, Item Code, Item Name, Allocation, Price
SELECT Categories.code AS "Category Code", Categories.name AS "Category Name", Items.code AS "Item Code", Items.name AS "Item Name", Allocation.allocation AS "Allocation", CONCAT('P', Prices.price, '.00') AS "Price"
FROM Items
JOIN Categories
ON Categories.id = Items.category_id
JOIN Allocation
ON Allocation.item_id = Items.id
JOIN Prices
ON Prices.item_id = Items.id
ORDER BY Categories.name DESC, Items.name DESC;

#2
#Display the number of items per Category
#Required Columns: Category Code, Category Name, No. of Items
SELECT Categories.code AS "Category Code", Categories.name AS "Category Name", COUNT(Items.id) AS "No. of Items"
FROM Items
JOIN Categories
ON Categories.id = Items.category_id
GROUP BY Categories.code;

#3
#Display the TOTAL number of item quantity PER Category
#Required Columns: Category Code, Category Name, Total Qty of Items
SELECT Categories.code AS "Category Code", Categories.name AS "Category Name", SUM(Allocation.allocation) AS "Total Qty of Items"
FROM Items
JOIN Categories
ON Categories.id = Items.category_id
JOIN Allocation
ON Allocation.item_id = Items.id
GROUP BY Categories.code;

#4
#Display the EXPECTED REVENUE IF ALL ITEMS are sold PER Category
#Required Columns: Category Code, Category Name, Expected Revenue
SELECT Categories.code AS "Category Code", Categories.name AS "Category Name", SUM(Allocation.allocation * Prices.price) AS "Expected Revenue"
FROM Items
JOIN Allocation
ON Allocation.item_id = Items.id
JOIN Prices
ON Prices.item_id = Items.id
JOIN Categories
ON Categories.id = Items.category_id
GROUP BY Items.category_id;

#5
#Display the Transaction Date FORMATTED AS YYYY-MM-DD HH:MM:SS, Category Name, Item Name, Item Stock QTY, how many were sold, remaining stock, price per piece, revenue, and current asset (Total Amount of the Remaining Items)
#In addition, at the bottom of the table, add the TOTAL REVENUE and TOTAL CURRENT ASSET PER CATEGORY
#Required Columns: Transaction Date, Category Name, Item Name, Stock, Stock QTY, Remaining QTY, Price, Revenue, Current Asset
SELECT DATE_FORMAT(TransactionMaster.transaction_date, '%Y-%m-%d %h:%I:%s') AS "Transaction Date", Categories.name AS "Category Name", Items.name AS "Item Name", Allocation.allocation AS "Stock", TransactionMaster.quantity AS "Sold QTY", Allocation.allocation - TransactionMaster.quantity AS "Remaining QTY", Prices.price AS "Price", TransactionMaster.quantity * Prices.price AS "Revenue", Prices.price * (Allocation.allocation - TransactionMaster.quantity) AS "Current Asset"
FROM Categories
JOIN Items
ON Items.category_id = Categories.id
JOIN Allocation
ON Allocation.item_id = Items.id
JOIN Prices
ON Prices.item_id = Items.id
JOIN TransactionMaster
ON TransactionMaster.item_id = Items.id

UNION

SELECT Categories.name, '', '', '', '', '', '', SUM(TransactionMaster.quantity * Prices.price), SUM(Prices.price * (Allocation.allocation - TransactionMaster.quantity))
FROM Categories
JOIN Items
ON Items.category_id = Categories.id
JOIN Allocation
ON Allocation.item_id = Items.id
JOIN Prices
ON Prices.item_id = Items.id
JOIN TransactionMaster
ON TransactionMaster.item_id = Items.id
GROUP BY Categories.name