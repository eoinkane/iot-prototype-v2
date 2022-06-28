CREATE TABLE `app_db`.`access` (
    `access_id` VARCHAR(2) NOT NULL,
    `description` VARCHAR(80) NOT NULL,
    PRIMARY KEY (`access_id`),
    UNIQUE (`access_id`)
) ENGINE = InnoDB;

INSERT INTO access VALUES ("A1", "Basic Access. Only to ground floor");
INSERT INTO access VALUES ("A2", "Medium Access. Ground Floor & 1st Floor stock room. In addition to A1 access.");
INSERT INTO access VALUES ("A3", "Full Access. Access to the 2nd Floor office. In addition to A1 & A2 access.");