-- Operational case state is separate from the immutable analytic snapshot.
CREATE TABLE case_records (
 employer_id TEXT PRIMARY KEY NOT NULL,
 payload TEXT NOT NULL CONSTRAINT case_payload_json CHECK(json_valid(payload)),
 version INTEGER NOT NULL DEFAULT 0 CONSTRAINT case_version_nonnegative CHECK(version >= 0),
 last_change_id TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE case_events (
 id TEXT PRIMARY KEY NOT NULL,
 employer_id TEXT NOT NULL REFERENCES case_records(employer_id),
 version INTEGER NOT NULL,
 actor_id TEXT NOT NULL,
 actor_name TEXT NOT NULL,
 actor_role TEXT NOT NULL CONSTRAINT case_event_actor_role CHECK(actor_role IN ('admin','user')),
 created_at TEXT NOT NULL,
 previous_status TEXT NOT NULL,
 new_status TEXT NOT NULL,
 reason TEXT NOT NULL,
 payload TEXT NOT NULL CONSTRAINT case_event_payload_json CHECK(json_valid(payload)),
 CONSTRAINT case_events_employer_version_unique UNIQUE(employer_id,version)
);
--> statement-breakpoint
CREATE INDEX case_events_employer_version ON case_events(employer_id,version);
--> statement-breakpoint
CREATE TRIGGER case_events_no_update BEFORE UPDATE ON case_events BEGIN SELECT RAISE(ABORT,'Case history is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER case_events_no_delete BEFORE DELETE ON case_events BEGIN SELECT RAISE(ABORT,'Case history is append-only'); END;
