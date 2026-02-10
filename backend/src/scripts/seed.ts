import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'test',
        });

        console.log('✓ Connected to MySQL database');

        // Helper to hash passwords
        const hashPassword = async (password: string) => {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        };

        const defaultPassword = 'Password123!';
        const hashedDefaultPassword = await hashPassword(defaultPassword);

        // 1. Seed Users
        console.log('Seeding users...');
        const users = [
            { name: 'Admin User', email: 'admin@eeuez.com', role: 'ADMIN', plan: 'premium' },
            { name: 'Jean Dupont', email: 'jean.teacher@eeuez.com', role: 'TEACHER', plan: 'free' },
            { name: 'Marie Curie', email: 'marie.teacher@eeuez.com', role: 'TEACHER', plan: 'free' },
            { name: 'Alice Student', email: 'alice@student.com', role: 'STUDENT', plan: 'free' },
            { name: 'Bob Student', email: 'bob@student.com', role: 'STUDENT', plan: 'premium' },
            { name: 'Charlie Student', email: 'charlie@student.com', role: 'STUDENT', plan: 'free' },
        ];

        for (const u of users) {
            const [existing]: any = await connection.execute('SELECT id FROM users WHERE email = ?', [u.email]);
            if (existing.length === 0) {
                const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`;
                await connection.execute(
                    'INSERT INTO users (name, email, password, role, avatar, subscription_plan) VALUES (?, ?, ?, ?, ?, ?)',
                    [u.name, u.email, hashedDefaultPassword, u.role, avatar, u.plan]
                );
            }
        }

        // Get teacher IDs
        const [teachers]: any = await connection.execute('SELECT id FROM users WHERE role = "TEACHER"');
        const teacherIds = teachers.map((t: any) => t.id);

        // 2. Seed Courses
        console.log('Seeding courses...');
        const courses = [
            { title: 'Web Development Bootcamp', description: 'Learn HTML, CSS, JS and React.', instructor_id: teacherIds[0], category: 'Development', level: 'Débutant', duration: '20h' },
            { title: 'Mobile App with Flutter', description: 'Build cross-platform apps.', instructor_id: teacherIds[1], category: 'Mobile', level: 'Intermédiaire', duration: '15h' },
            { title: 'UI/UX Design Essentials', description: 'Master Figma and design principles.', instructor_id: teacherIds[0], category: 'Design', level: 'Débutant', duration: '10h' },
        ];

        for (const c of courses) {
            const [existing]: any = await connection.execute('SELECT id FROM courses WHERE title = ?', [c.title]);
            if (existing.length === 0) {
                const thumbnail = `https://picsum.photos/seed/${encodeURIComponent(c.title)}/800/600`;
                await connection.execute(
                    'INSERT INTO courses (title, description, instructor_id, thumbnail, category, level, duration) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [c.title, c.description, c.instructor_id, thumbnail, c.category, c.level, c.duration]
                );
            }
        }

        // Get course IDs
        const [dbCourses]: any = await connection.execute('SELECT id FROM courses');
        const courseIds = dbCourses.map((c: any) => c.id);

        // 3. Seed Lessons
        console.log('Seeding lessons...');
        for (const courseId of courseIds) {
            const lessons = [
                { title: 'Introduction', content: 'Welcome to the course.', duration: '10m', order_index: 1 },
                { title: 'Setting up the Environment', content: 'Get ready to code.', duration: '15m', order_index: 2 },
                { title: 'Foundations', content: 'Basic concepts.', duration: '30m', order_index: 3 },
                { title: 'Hands-on Project', content: 'Build something cool.', duration: '1h', order_index: 4 },
                { title: 'Conclusion', content: 'Next steps.', duration: '10m', order_index: 5 },
            ];

            for (const l of lessons) {
                const [existing]: any = await connection.execute('SELECT id FROM lessons WHERE course_id = ? AND title = ?', [courseId, l.title]);
                if (existing.length === 0) {
                    await connection.execute(
                        'INSERT INTO lessons (course_id, title, content, order_index, duration) VALUES (?, ?, ?, ?, ?)',
                        [courseId, l.title, l.content, l.order_index, l.duration]
                    );
                }
            }
        }

        console.log('\n✅ Seeding completed successfully!');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   DEFAULT LOGIN FOR ALL USERS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   📧 Admin   : admin@eeuez.com`);
        console.log(`   📧 Teacher : jean.teacher@eeuez.com`);
        console.log(`   📧 Student : alice@student.com`);
        console.log(`   🔑 Password: ${defaultPassword}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

seed();
