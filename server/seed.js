const bcrypt = require('bcryptjs');
const { writeJSON, exists } = require('./utils/fileStore');

const defaultContent = require('./data/content.json');

async function seed() {
  if (!exists('admin.json')) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminData = {
      users: [
        {
          id: '1',
          email: 'admin@galler.com',
          password: hashedPassword,
          name: 'Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'admin@gmail.com',
          password: hashedPassword,
          name: 'Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ]
    };

    writeJSON('admin.json', adminData);
    console.log('✓ Default admin users created:');
    console.log('  - admin@galler.com / admin123');
    console.log('  - admin@gmail.com / admin123');
  }

  if (!exists('content.json')) {
    writeJSON('content.json', defaultContent);
    console.log('✓ Default homepage content created');
  }
}

module.exports = seed;
