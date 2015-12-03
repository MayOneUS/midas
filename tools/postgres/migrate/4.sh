#!/bin/bash

# Add a data column for tagEntities
psql $DATABASE_URL -c "ALTER TABLE tagentity ADD COLUMN data json;"

# Update the schema version
psql $DATABASE_URL -c "UPDATE schema SET version = 4 WHERE schema = 'current';"
