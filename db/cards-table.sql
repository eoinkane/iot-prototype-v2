CREATE TABLE `app_db`.`cards` (
    `card_id` INT(3) ZEROFILL NOT NULL AUTO_INCREMENT,
    `expiry_date` DATETIME NOT NULL,
    PRIMARY KEY (`card_id`),
    UNIQUE (`card_id`)
) ENGINE = InnoDB;

INSERT INTO `cards` (expiry_date) VALUES ("2022-10-08 20:52:40");
INSERT INTO `cards` (expiry_date) VALUES ("2022-11-08 20:52:40");