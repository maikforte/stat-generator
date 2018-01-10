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