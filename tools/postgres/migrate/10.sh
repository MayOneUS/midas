#!/bin/bash

# Add a column to volunteers for marking notifications as silent
psql $DATABASE_URL -c "ALTER TABLE volunteer ADD COLUMN silent boolean;"

# Update the schema version
psql $DATABASE_URL -c "UPDATE schema SET version = 10 WHERE schema = 'current';"
