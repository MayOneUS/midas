#!/bin/bash

# Add a model column for notifications
psql $DATABASE_URL -c "ALTER TABLE notification ADD COLUMN model json;"

# Update the schema version
psql $DATABASE_URL -c "UPDATE schema SET version = 7 WHERE schema = 'current';"
