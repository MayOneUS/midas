#!/bin/bash

# Add a model column for notifications
psql $DATABASE_URL -c "ALTER TABLE task ADD COLUMN \"completedBy\" timestamp with time zone;"

# Update the schema version
psql $DATABASE_URL -c "UPDATE schema SET version = 9 WHERE schema = 'current';"
