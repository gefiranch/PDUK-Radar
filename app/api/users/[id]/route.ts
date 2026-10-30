import {eq} from 'drizzle-orm';
import {users,accountAudit,sessions} from '../../../../db/schema';
import {requireAdmin,publicUser,json,apiError} from '../../../../lib/auth/session';
import {AccessError,requireSameOrigin,validateUserStatus,validateUserEdit} from '../../../../lib/auth/policy';
export const dynamic='force-dynamic';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 try{
  const {db,user:actor}=await requireAdmin();requireSameOrigin(request);const {id}=await params;
  let body:unknown;try{body=await request.json();}catch{throw new AccessError(400,'Format JSON tidak valid.');}
  const target=await db.select().from(users).where(eq(users.id,id)).get();
  if(!target)throw new AccessError(404,'Pengguna tidak ditemukan.');
  if(target.role==='admin'||target.id===actor.id)throw new AccessError(403,'Akun administrator tidak dapat diubah melalui tindakan ini.');
  const now=new Date().toISOString();
  if(body&&typeof body==='object'&&!Array.isArray(body)&&(body as Record<string,unknown>).action==='edit'){
   const {name,email}=validateUserEdit(body);const duplicate=await db.select({id:users.id}).from(users).where(eq(users.email,email)).get();
   if(duplicate&&duplicate.id!==id)throw new AccessError(409,'Email sudah terdaftar.');
   try{await db.batch([
    db.update(users).set({name,email,updatedAt:now}).where(eq(users.id,id)),
    db.insert(accountAudit).values({id:crypto.randomUUID(),actorId:actor.id,targetId:id,action:'user_updated',createdAt:now}),
    ...(email!==target.email?[db.delete(sessions).where(eq(sessions.userId,id))]:[])
   ]);}catch(e){if(String(e).includes('UNIQUE'))throw new AccessError(409,'Email sudah terdaftar.');throw e;}
   return json({user:publicUser({...target,name,email,updatedAt:now})});
  }
  const status=validateUserStatus(body);
  await db.batch([
   db.update(users).set({status,updatedAt:now}).where(eq(users.id,id)),
   db.insert(accountAudit).values({id:crypto.randomUUID(),actorId:actor.id,targetId:id,action:status==='active'?'user_activated':'user_deactivated',createdAt:now}),
   db.delete(sessions).where(eq(sessions.userId,id))
  ]);
  return json({user:publicUser({...target,status,updatedAt:now})});
 }catch(e){return apiError(e);}
}
