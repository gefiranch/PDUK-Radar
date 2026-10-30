import {sqliteTable,text,integer,check} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';
export const users=sqliteTable('app_users',{
 id:text('id').primaryKey(),passwordHash:text('password_hash'),identityId:text('identity_id').unique(),email:text('email').notNull().unique(),name:text('name').notNull(),role:text('role',{enum:['admin','user']}).notNull(),status:text('status',{enum:['active','inactive']}).notNull(),createdBy:text('created_by'),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),lastLoginAt:text('last_login_at')
},t=>[check('user_role_check',sql`${t.role} IN ('admin','user')`),check('user_status_check',sql`${t.status} IN ('active','inactive')`)]);
export const accountAudit=sqliteTable('account_audit',{
 id:text('id').primaryKey(),actorId:text('actor_id').notNull(),targetId:text('target_id').notNull(),action:text('action').notNull(),createdAt:text('created_at').notNull()
});

export const sessions=sqliteTable('app_sessions',{
 tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull().references(()=>users.id),createdAt:integer('created_at').notNull(),expiresAt:integer('expires_at').notNull()
});
export const loginAttempts=sqliteTable('login_attempts',{
 key:text('kegit inity').primaryKey(),failures:integer('failures').notNull(),windowStartedAt:integer('window_started_at').notNull()
});
