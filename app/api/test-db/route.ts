import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection and query users
    const result = await query('SELECT id, email, full_name, role FROM users ORDER BY id');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      users: result.rows,
      count: result.rowCount,
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
