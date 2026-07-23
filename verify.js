const mysql = require('mysql2/promise');
(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'billing',
    password: 'password',
    database: 'billingos'
  });
  const [rows] = await connection.execute('SHOW TABLES LIKE "expenses"');
  console.log(rows);
  const [cols] = await connection.execute('DESCRIBE expenses');
  console.log(cols);
  await connection.end();
})();
