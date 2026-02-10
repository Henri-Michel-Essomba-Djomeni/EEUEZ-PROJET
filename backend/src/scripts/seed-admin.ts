import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    let connection;

    try {
        // Connect to database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'test',
        });

        console.log('✓ Connected to MySQL database');

        // Check if admin already exists
        const [existingAdmins]: any = await connection.execute(
            'SELECT * FROM users WHERE role = ? LIMIT 1',
            ['ADMIN']
        );

        if (existingAdmins.length > 0) {
            console.log('\n⚠️  Un administrateur existe déjà dans la base de données.');
            console.log(`   Email: ${existingAdmins[0].email}`);
            console.log(`   Nom: ${existingAdmins[0].name}`);
            console.log('\n   Aucune action nécessaire.\n');
            return;
        }

        // Admin credentials
        const adminEmail = 'admin@eeuez.com';
        const adminPassword = 'Admin@123';
        const adminName = 'Super Admin';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Generate avatar
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=6366f1&color=fff&bold=true`;

        // Insert admin user
        const [result]: any = await connection.execute(
            'INSERT INTO users (name, email, password, role, avatar, subscription_plan) VALUES (?, ?, ?, ?, ?, ?)',
            [adminName, adminEmail, hashedPassword, 'ADMIN', avatar, 'premium']
        );

        console.log('\n✅ Compte administrateur créé avec succès!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   IDENTIFIANTS DE CONNEXION');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   📧 Email    : ${adminEmail}`);
        console.log(`   🔑 Password : ${adminPassword}`);
        console.log(`   👤 Nom      : ${adminName}`);
        console.log(`   🆔 ID       : ${result.insertId}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!\n');

    } catch (error) {
        console.error('\n❌ Erreur lors du seeding:', error);

        if ((error as any).code === 'ER_NO_SUCH_TABLE') {
            console.error('\n⚠️  La table "users" n\'existe pas.');
            console.error('   Exécutez d\'abord la migration: npm run migrate\n');
        }

        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

seedAdmin();
