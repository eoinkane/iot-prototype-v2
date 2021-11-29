import { connect } from '../database/index';
import { config } from 'dotenv';

export const setup = async (request, context) => {
    console.log("GET /setup called. Inserting data into the database");
    
    config();

    const con = await connect();

    await con.query(
        "CREATE TABLE `app_db`.`access` ( " +
        "`access_id` VARCHAR(2) NOT NULL, " +
        "`description` VARCHAR(80) NOT NULL, " +
        "PRIMARY KEY (`access_id`), " +
        "UNIQUE (`access_id`) " +
        ") ENGINE = InnoDB;"
    );
    console.log("access table created");

    await con.query(
        "INSERT INTO access VALUES (\"A1\", \"Basic Access. Only to ground floor\");"
    );
    await con.query(
        "INSERT INTO access VALUES (\"A2\", \"Medium Access. Ground Floor & 1st Floor stock room. In addition to A1 access.\");"
    );
    await con.query(
        "INSERT INTO access VALUES (\"A3\", \"Full Access. Access to the 2nd Floor office. In addition to A1 & A2 access.\");"
    );

    console.log("access table data inserted");

    await con.query(
        "CREATE TABLE `app_db`.`cards` ( " +
        "`card_id` INT(3) ZEROFILL NOT NULL AUTO_INCREMENT, " +
        "`expiry_date` DATETIME NOT NULL, " +
        "PRIMARY KEY (`card_id`), " +
        "UNIQUE (`card_id`) " +
        ") ENGINE = InnoDB;" 
    );

    console.log("cards table created");

    await con.query(
        "INSERT INTO `cards` (expiry_date) VALUES (\"2022-10-08 20:52:40\");"
    );
    await con.query(
        "INSERT INTO `cards` (expiry_date) VALUES (\"2022-11-09 20:52:40\");"
    );
    await con.query(
        "INSERT INTO `cards` (expiry_date) VALUES (\"2022-11-10 20:52:40\");"
    );
    await con.query(
        "INSERT INTO `cards` (expiry_date) VALUES (\"2022-11-11 20:52:40\");"
    );

    console.log("cards table data inserted");

    await con.query(
        "CREATE TABLE `app_db`.`staff` ( " +
        "`staff_id` INT(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, " +
        "`first_name` VARCHAR(30) NOT NULL, " +
        "`last_name` VARCHAR(30) NOT NULL, " +
        "`phone` VARCHAR (13) NOT NULL, " +
        "`role` VARCHAR(30) NOT NULL, " +
        "`access_permission` VARCHAR(2) NOT NULL, " +
        "`current_card_id` INT(3) UNSIGNED ZEROFILL NOT NULL, " +
        "PRIMARY KEY (`staff_id`), " +
        "FOREIGN KEY (`access_permission`) REFERENCES `app_db`.`access`(`access_id`), " +
        "FOREIGN KEY (`current_card_id`) REFERENCES `app_db`.`cards`(`card_id`) " +
        ") ENGINE = InnoDB;"
    );

    console.log("staff table created");

    await con.query(
        "INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `phone`,  `role`, `access_permission`, `current_card_id`) VALUES (NULL, 'Jack', 'Beatty', '" + process.env.TEST_PHONE_NUMBER + "', 'CEO', 'A2', '001');"
    );
    await con.query(
        "INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `phone`, `role`, `access_permission`, `current_card_id`) VALUES (NULL, 'Tim', 'Jule', '" + process.env.TEST_PHONE_NUMBER + "', 'Front of House', 'A1', '002');"
    );
    await con.query(
        "INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `phone`, `role`, `access_permission`, `current_card_id`) VALUES (NULL, 'Poppy', 'Bingo', '" + process.env.TEST_PHONE_NUMBER + "', 'Executive', 'A2', '003');"
    );
    await con.query(
        "INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `phone`, `role`, `access_permission`, `current_card_id`) VALUES (NULL, 'Oliver', 'Wao', '" + process.env.TEST_PHONE_NUMBER + "', 'Facilities', 'A1', '004');"
    );

    console.log("staff table data inserted");

    await con.query(
        "CREATE TABLE `app_db`.`taps` ( " +
        "`tap_id` INT(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, " +
        "`card_id` INT(3) UNSIGNED ZEROFILL NOT NULL, " +
        "`zone` VARCHAR(2) NOT NULL, " +
        "`success` INT(1) NOT NULL CHECK(`success` IN (0,1)), " +
        "`datetime` DATETIME NOT NULL, " +
        "PRIMARY KEY (`tap_id`), " +
        "FOREIGN KEY (`card_id`) REFERENCES `app_db`.`cards`(`card_id`), " +
        "FOREIGN KEY (`zone`) REFERENCES `app_db`.`access`(`access_id`) " +
        ") ENGINE = InnoDB;"
    );

    console.log("taps table created");

    con.end()
    return { success: true };
}