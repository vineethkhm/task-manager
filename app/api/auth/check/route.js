import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '../../../../middleware/authMiddleware.js';

export async function GET(request) {
  const userId = await getUserIdFromRequest(request);
  if (userId) {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}