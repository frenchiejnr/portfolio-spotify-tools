#

### Command for creating the database

```sh
createdb -h localhost -p 5432 -U postgres spotify-tool
```

### Command for creating the tables

```sh
psql -h localhost -p 5432 -U postgres spotify-tools -a -f createTables.sql
```
