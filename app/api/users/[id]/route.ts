import {atomic} from '../../../../db';
import {validatePasswordReset} from '../../../../lib/auth/password-reset';
import {hashPassword,sessionCookie} from '../../../../lib/auth/password';
import {eq} from 'drizzle-orm';
import {users,accountAudit,sessions} from '../../../../db/schema';
import {requireAdmin,publicUser,json,apiError} from '../../../../lib/auth/session';
import {AccessError,requireSameOrigin,validateUserStatus,validateUserEdit} from '../../../../lib/auth/policy';
export const dynamic='force-dynamic';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 try{
  const {db,user:actor}=await requireAdmin();requireSameOrigin(request);const {id}=await params;
  let body:unknown;try{body=await request.json();}catch{throw new AccessError(400,'Format JSON tidak valid.');}
  const target=await db.select().from(users).where(eq(users.id,id)).then(rows=>rows[0]);
  if(!target)throw new AccessError(404,'Pengguna tidak ditemukan.');
  if(body&&typeof body==='object'&&!Array.isArray(body)&&(body as Record<string,unknown>).action==='reset-password'){
   const {password}=validatePasswordReset(body);const passwordHash=await hashPassword(password);const now=new Date().toISOString();
   await atomic(db,tx=>[
    tx.update(users).set({passwordHash,updatedAt:now}).where(eq(users.id,id)),
    tx.delete(sessions).where(eq(sessions.userId,id)),
    tx.insert(accountAudit).values({id:crypto.randomUUID(),actorId:actor.id,targetId:id,action:'password_reset',createdAt:now})
   ]);
   return json({ok:true,reauthenticate:target.id===actor.id},200,target.id===actor.id?{'Set-Cookie':sessionCookie('',request,true)}:{});
  }
  if(target.role==='admin'||target.id===actor.id)throw new AccessError(403,'Akun administrator tidak dapat diubah melalui tindakan ini.');
  const now=new Date().toISOString();
  if(body&&typeof body==='object'&&!Array.isArray(body)&&(body as Record<string,unknown>).action==='edit'){
   const {name,email}=validateUserEdit(body);const duplicate=await db.select({id:users.id}).from(users).where(eq(users.email,email)).then(rows=>rows[0]);
   if(duplicate&&duplicate.id!==id)throw new AccessError(409,'Email sudah terdaftar.');
   try{await atomic(db,tx=>[
    tx.update(users).set({name,email,updatedAt:now}).where(eq(users.id,id)),
    tx.insert(accountAudit).values({id:crypto.randomUUID(),actorId:actor.id,targetId:id,action:'user_updated',createdAt:now}),
    ...(email!==target.email?[tx.delete(sessions).where(eq(sessions.userId,id))]:[])
   ]);}catch(e){if((e as {cause?:{code?:string};code?:string}).cause?.code==='23505'||(e as {code?:string}).code==='23505')throw new AccessError(409,'Email sudah terdaftar.');throw e;}
   return json({user:publicUser({...target,name,email,updatedAt:now})});
  }
  const status=validateUserStatus(body);
  await atomic(db,tx=>[
   tx.update(users).set({status,updatedAt:now}).where(eq(users.id,id)),
   tx.insert(accountAudit).values({id:crypto.randomUUID(),actorId:actor.id,targetId:id,action:status==='active'?'user_activated':'user_deactivated',createdAt:now}),
   tx.delete(sessions).where(eq(sessions.userId,id))
  ]);
  return json({user:publicUser({...target,status,updatedAt:now})});
 }catch(e){return apiError(e);}
}
