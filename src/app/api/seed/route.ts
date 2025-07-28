import { NextResponse } from 'next/server';
import { seedDemoUsers } from '@/lib/seed-demo-users';

export async function POST() {
  try {
    await seedDemoUsers();
    return NextResponse.json({ message: 'Demo users seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo users' },
      { status: 500 }
    );
  }
}