CREATE DATABASE IF NOT EXISTS `chargebee_dev`;
CREATE DATABASE IF NOT EXISTS `chargebee_test`;
CREATE DATABASE IF NOT EXISTS `chargebee_prod`;

CREATE USER IF NOT EXISTS 'devuser'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON `chargebee_dev`.* TO 'devuser'@'%';
GRANT ALL PRIVILEGES ON `chargebee_test`.* TO 'devuser'@'%';
GRANT ALL PRIVILEGES ON `chargebee_prod`.* TO 'devuser'@'%';
FLUSH PRIVILEGES;
