import {sqliteTable,text,integer,check,index,unique} from 'drizzle-orm/sqlite-core';
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
 key:text('key').primaryKey(),failures:integer('failures').notNull(),windowStartedAt:integer('window_started_at').notNull()
});

// Operational state and append-only events; see migration 0002 for constraints/triggers.
export const caseRecords=sqliteTable('case_records',{
 employerId:text('employer_id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull().default(0),lastChangeId:text('last_change_id').notNull(),updatedAt:text('updated_at').notNull()
},t=>[check('case_payload_json',sql`json_valid(${t.payload})`),check('case_version_nonnegative',sql`${t.version} >= 0`)]);
export const caseEvents=sqliteTable('case_events',{
 id:text('id').primaryKey(),employerId:text('employer_id').notNull().references(()=>caseRecords.employerId),version:integer('version').notNull(),actorId:text('actor_id').notNull(),actorName:text('actor_name').notNull(),actorRole:text('actor_role').notNull(),createdAt:text('created_at').notNull(),previousStatus:text('previous_status').notNull(),newStatus:text('new_status').notNull(),reason:text('reason').notNull(),payload:text('payload').notNull()
},t=>[unique('case_events_employer_version_unique').on(t.employerId,t.version),index('case_events_employer_version').on(t.employerId,t.version),check('case_event_payload_json',sql`json_valid(${t.payload})`),check('case_event_actor_role',sql`${t.actorRole} IN ('admin','user')`)]);
