CREATE TABLE `app_db`.`staff` (
    `staff_id` INT(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `role` VARCHAR(30) NOT NULL,
    `access_permission` VARCHAR(2) NOT NULL,
    `current_card_id` INT(3) UNSIGNED ZEROFILL NOT NULL,
    PRIMARY KEY (`staff_id`),
    FOREIGN KEY (`access_permission`) REFERENCES `app_db`.`access`(`access_id`),
    FOREIGN KEY (`current_card_id`) REFERENCES `app_db`.`cards`(`card_id`)
) ENGINE = InnoDB;

INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `role`, `access_permission`, `current_card_id`) VALUES (NULL, 'Jack', 'Beatty', 'CEO', 'A3', '001');