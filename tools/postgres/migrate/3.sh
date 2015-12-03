#!/bin/bash

# Set up a table to store sessions
psql $DATABASE_URL -c "ALTER TABLE \"task\"
  ADD COLUMN \"publishedAt\" timestamp with time zone,
  ADD COLUMN \"assignedAt\" timestamp with time zone,
  ADD COLUMN \"completedAt\" timestamp with time zone;"

# Update the schema version
psql $DATABASE_URL -c "UPDATE schema SET version = 3 WHERE schema = 'current';"
