CREATE TABLE `app_db`.`taps` (
    `tap_id` INT(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    `card_id` INT(3) UNSIGNED ZEROFILL NOT NULL,
    `zone` VARCHAR(2) NOT NULL,
    `success` INT(1) NOT NULL CHECK(`success` IN (0,1)),
    `datetime` DATETIME NOT NULL,
    PRIMARY KEY (`tap_id`),
    FOREIGN KEY (`card_id`) REFERENCES `app_db`.`cards`(`card_id`),
    FOREIGN KEY (`zone`) REFERENCES `app_db`.`access`(`access_id`)
) ENGINE = InnoDB;

INSERT INTO `taps` (`tap_id`, `card_id`, `zone`, `success`, `datetime`) VALUES (NULL, '001', 'A2', 1, "2022-10-08 21:24:40");

SELECT `card_id`, IF((MOD(COUNT(`tap_id`), 2)) = 1, "true", "false") AS `on_site` FROM taps WHERE card_id = '001';

SELECT `on_site_t`.`card_id`, `on_site_t`.`on_site`, `zone_t`.`zone` FROM ( SELECT `taps`.`card_id` AS `card_id`, IF( (MOD(COUNT(`taps`.`tap_id`), 2)) = 1, "true", "false" ) AS `on_site` FROM taps WHERE `taps`.`success` = 1 AND `taps`.`card_id` = '001' ) `on_site_t` JOIN( SELECT `taps`.`tap_id`, `taps`.`card_id`, `taps`.`zone` FROM `taps` WHERE `taps`.`success` = 1 AND `taps`.`card_id` = '001' ORDER BY `taps`.`tap_id` DESC LIMIT 1 ) `zone_t`;