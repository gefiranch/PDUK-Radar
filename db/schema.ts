import {pgTable,text,integer,bigint,jsonb,check,index,unique} from 'drizzle-orm/pg-core';
import {sql} from 'drizzle-orm';
export const users=pgTable('app_users',{
 id:text('id').primaryKey(),passwordHash:text('password_hash'),identityId:text('identity_id').unique(),email:text('email').notNull().unique(),name:text('name').notNull(),role:text('role',{enum:['admin','user']}).notNull(),status:text('status',{enum:['active','inactive']}).notNull(),createdBy:text('created_by'),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),lastLoginAt:text('last_login_at')
},t=>[check('user_role_check',sql`${t.role} IN ('admin','user')`),check('user_status_check',sql`${t.status} IN ('active','inactive')`)]);
export const accountAudit=pgTable('account_audit',{
 id:text('id').primaryKey(),actorId:text('actor_id').notNull(),targetId:text('target_id').notNull(),action:text('action').notNull(),createdAt:text('created_at').notNull()
});

export const sessions=pgTable('app_sessions',{
 tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull().references(()=>users.id),createdAt:bigint('created_at',{mode:'number'}).notNull(),expiresAt:bigint('expires_at',{mode:'number'}).notNull()
});
export const loginAttempts=pgTable('login_attempts',{
 key:text('key').primaryKey(),failures:integer('failures').notNull(),windowStartedAt:bigint('window_started_at',{mode:'number'}).notNull()
});

// Operational state and append-only events; see migration 0002 for constraints/triggers.
export const caseRecords=pgTable('case_records',{
 employerId:text('employer_id').primaryKey(),payload:jsonb('payload').notNull(),version:integer('version').notNull().default(0),lastChangeId:text('last_change_id').notNull(),updatedAt:text('updated_at').notNull()
},t=>[check('case_version_nonnegative',sql`${t.version} >= 0`)]);
export const caseEvents=pgTable('case_events',{
 id:text('id').primaryKey(),employerId:text('employer_id').notNull().references(()=>caseRecords.employerId),version:integer('version').notNull(),actorId:text('actor_id').notNull(),actorName:text('actor_name').notNull(),actorRole:text('actor_role').notNull(),createdAt:text('created_at').notNull(),previousStatus:text('previous_status').notNull(),newStatus:text('new_status').notNull(),reason:text('reason').notNull(),payload:jsonb('payload').notNull()
},t=>[unique('case_events_employer_version_unique').on(t.employerId,t.version),index('case_events_employer_version').on(t.employerId,t.version),check('case_event_actor_role',sql`${t.actorRole} IN ('admin','user')`)]);
