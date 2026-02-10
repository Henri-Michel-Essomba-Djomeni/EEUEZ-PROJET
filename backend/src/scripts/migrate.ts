import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true, // Allow multiple SQL statements
        });

        console.log('Connected to MySQL server');

        const dbName = process.env.DB_NAME || 'test';

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or already exists.`);

        // Use the database
        await connection.query(`USE \`${dbName}\`;`);

        // Read schema.sql
        const schemaPath = path.join(__dirname, '../config/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        console.log('Running migration...');
        await connection.query(schema);
        console.log('Migration completed successfully.');

        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
