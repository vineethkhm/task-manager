import { verifyToken } from '../lib/auth.js';

export async function authenticate(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export async function getUserIdFromRequest(req) {
  const user = await authenticate(req);
  return user ? user.userId : null;
}