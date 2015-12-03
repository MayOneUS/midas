#!/bin/bash

# Add new badge table and relations
psql $DATABASE_URL -c "CREATE TABLE badge (
    \"user\" integer,
    \"task\" integer,
    id integer NOT NULL,
    \"type\" varchar,
    \"silent\" boolean DEFAULT false,
    \"createdAt\" timestamp with time zone,
    \"updatedAt\" timestamp with time zone,
    \"deletedAt\" timestamp with time zone
);

ALTER TABLE badge OWNER TO midas;

CREATE SEQUENCE badge_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE badge_id_seq OWNER TO midas;

ALTER SEQUENCE badge_id_seq OWNED BY badge.id;

ALTER TABLE ONLY badge ALTER COLUMN id SET DEFAULT nextval('badge_id_seq'::regclass);
"

# update user table with new attributes
psql $DATABASE_URL -c "ALTER TABLE midas_user ADD COLUMN \"completedTasks\" integer NOT NULL DEFAULT 0;"

# Update the schema version
psql $DATABASE_URL -c "UPDATE schema SET version = 11 WHERE schema = 'current';"
