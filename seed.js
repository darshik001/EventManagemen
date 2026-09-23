const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const { AdminStore } = require('./models/Admin');
const { SubscriptionPlanStore } = require('./models/SubscriptionPlan');
const { UserStore } = require('./models/User');

const seedData = async () => {
  await connectDB();

  console.log('🌱 Seeding default database records...');

  // Seed Default Admin
  const existingAdmin = await AdminStore.findOne({ email: 'admin@bookapp.com' });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await AdminStore.create({
      fullName: 'Super Admin',
      email: 'admin@bookapp.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin account seeded: admin@bookapp.com / admin123');
  }

  // Seed Default Subscription Plans
  const plans = [
    {
      _id: 'free_plan',
      title: 'Free Plan',
      price: 0,
      duration: 'Lifetime',
      description: 'Basic access to notes, tasks and basic posts with feature limits.',
      features: ['Up to 5 Event Posts', 'Up to 10 Notes', 'Text & Location Post Details', 'Basic Tasks'],
      permissions: {
        maxPosts: 5,
        maxNotes: 10,
        canAccessAudio: false,
        canAccessDrawing: false,
        canAccessAppointments: false,
        canAccessChecklist: true,
        canAccessLocation: true
      },
      isPopular: false,
      status: 'active'
    },
    {
      _id: 'basic_plan',
      title: 'Basic Plan',
      price: 9.99,
      duration: 'Monthly',
      description: 'Ideal for personal productivity with expanded storage & appointment manager.',
      features: ['Up to 50 Event Posts', 'Up to 100 Notes', 'Appointments & Checklist Access', 'Audio Post Details'],
      permissions: {
        maxPosts: 50,
        maxNotes: 100,
        canAccessAudio: true,
        canAccessDrawing: false,
        canAccessAppointments: true,
        canAccessChecklist: true,
        canAccessLocation: true
      },
      isPopular: true,
      status: 'active'
    },
    {
      _id: 'pro_plan',
      title: 'Pro Enterprise Plan',
      price: 24.99,
      duration: 'Monthly',
      description: 'Unlimited access to all features including drawing pad & audio notes.',
      features: ['Unlimited Posts & Notes', 'Full Drawing Canvas', 'Audio & Media Storage', 'Priority Support', 'Full Appointments & Tasks'],
      permissions: {
        maxPosts: -1,
        maxNotes: -1,
        canAccessAudio: true,
        canAccessDrawing: true,
        canAccessAppointments: true,
        canAccessChecklist: true,
        canAccessLocation: true
      },
      isPopular: false,
      status: 'active'
    }
  ];

  for (const plan of plans) {
    const existing = await SubscriptionPlanStore.findById(plan._id);
    if (!existing) {
      await SubscriptionPlanStore.create(plan);
      console.log(`✅ Subscription plan seeded: ${plan.title}`);
    }
  }

  // Seed sample demo user
  const demoUser = await UserStore.findOne({ email: 'user@bookapp.com' });
  if (!demoUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('user123', salt);
    await UserStore.create({
      fullName: 'John Doe',
      email: 'user@bookapp.com',
      mobile: '9876543210',
      password: hashedPassword,
      theme: 'light',
      language: 'english',
      subscription: {
        planId: 'free_plan',
        planTitle: 'Free Plan',
        status: 'active',
        startDate: new Date().toISOString()
      }
    });
    console.log('✅ Demo user seeded: user@bookapp.com / user123');
  }

  console.log('🎉 Seeding completed successfully!');
};

seedData().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
