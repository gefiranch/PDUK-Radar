import {cookies} from 'next/headers';
import {and,eq,gt} from 'drizzle-orm';
import {getDb} from '../../db';
import {users,sessions} from '../../db/schema';
import {AccessError,requireRole} from './policy';
import {hashToken} from './password';
export async function getSession(){const token=(await cookies()).get('pduk_session')?.value;if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token))throw new AccessError(401,'Silakan masuk untuk melanjutkan.');const db=getDb(),sessionHash=await hashToken(token);const record=await db.select({user:users,session:sessions}).from(sessions).innerJoin(users,eq(sessions.userId,users.id)).where(and(eq(sessions.tokenHash,sessionHash),gt(sessions.expiresAt,Date.now()))).get();if(!record)throw new AccessError(401,'Sesi berakhir. Silakan masuk kembali.');if(record.user.status!=='active')throw new AccessError(403,'Akun dinonaktifkan. Hubungi administrator.');return {user:record.user,db,sessionHash};}
export async function requireAdmin(){const s=await getSession();requireRole(s.user.role,'admin');return s;}
export const publicUser=(u:typeof users.$inferSelect)=>({id:u.id,name:u.name,email:u.email,role:u.role,status:u.status,createdAt:u.createdAt,updatedAt:u.updatedAt,lastLoginAt:u.lastLoginAt,hasSignedIn:!!u.lastLoginAt,hasPassword:!!u.passwordHash});
export function json(data:unknown,status=200,headers:Record<string,string>={}){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});}
export function apiError(error:unknown){if(error instanceof AccessError)return json({error:error.message},error.status);console.error('PDUK API request failed');return json({error:'Layanan belum dapat diakses. Coba lagi beberapa saat.'},500);}
