import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database';
import { User } from './modules/auth/user.model';
import { Lead } from './modules/leads/lead.model';

async function seed() {
  await connectDatabase();

  await Promise.all([Lead.deleteMany({}), User.deleteMany({})]);

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const salesPassword = await bcrypt.hash('Sales123!', 12);

  const admin = await User.create({
    name: 'Alex Morgan',
    email: 'admin@hivepulse.io',
    password: adminPassword,
    role: 'admin',
  });

  const sales = await User.create({
    name: 'Jordan Lee',
    email: 'sales@hivepulse.io',
    password: salesPassword,
    role: 'sales',
  });

  const sampleLeads = [
    { name: 'Maya Chen', email: 'maya@northwind.io', status: 'New' as const, source: 'Website' as const },
    { name: 'Ethan Brooks', email: 'ethan@lumen.co', status: 'Contacted' as const, source: 'Instagram' as const },
    { name: 'Sofia Alvarez', email: 'sofia@brightpath.com', status: 'Qualified' as const, source: 'Referral' as const },
    { name: 'Noah Patel', email: 'noah@stacklane.dev', status: 'Lost' as const, source: 'Website' as const },
    { name: 'Lena Fischer', email: 'lena@orbitlabs.de', status: 'New' as const, source: 'Referral' as const },
    { name: 'Chris Turner', email: 'chris@harborhq.com', status: 'Contacted' as const, source: 'Website' as const },
    { name: 'Ava Nguyen', email: 'ava@pulsemedia.io', status: 'Qualified' as const, source: 'Instagram' as const },
    { name: 'Marcus Reid', email: 'marcus@forgeops.net', status: 'New' as const, source: 'Website' as const },
    { name: 'Priya Sharma', email: 'priya@claritysuite.in', status: 'Contacted' as const, source: 'Referral' as const },
    { name: 'Daniel Ortiz', email: 'daniel@vertexcrm.com', status: 'Qualified' as const, source: 'Website' as const },
    { name: 'Emily Watson', email: 'emily@greenline.co', status: 'Lost' as const, source: 'Instagram' as const },
    { name: 'Ryan Kim', email: 'ryan@launchpad.studio', status: 'New' as const, source: 'Instagram' as const },
  ];

  await Lead.insertMany(
    sampleLeads.map((lead) => ({
      ...lead,
      createdBy: sales._id,
    })),
  );

  console.log('Seed complete.');
  console.log('Admin: admin@hivepulse.io / Admin123!');
  console.log('Sales: sales@hivepulse.io / Sales123!');
  console.log(`Created ${sampleLeads.length} sample leads for user ${admin.email} team.`);

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
