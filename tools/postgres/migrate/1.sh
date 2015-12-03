#!/bin/bash

# Add schema table
psql $DATABASE_URL -c "CREATE TABLE \"schema\" (
  \"schema\" varchar,
  \"version\" integer
);
INSERT INTO \"schema\" (schema, version) VALUES ('current', 1);"
