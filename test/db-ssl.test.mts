import { sslFor } from "../lib/db.ts";
import { eq, report } from "./_assert.mts";

eq(JSON.stringify(sslFor("postgres://u:p@127.0.0.1:55491/wagecoach")), JSON.stringify(false), "no sslmode: plain (local dev)");
eq(JSON.stringify(sslFor("postgres://u:p@db.internal/db")), JSON.stringify({ rejectUnauthorized: false }), "remote host, no sslmode: encrypted");
eq(JSON.stringify(sslFor("postgres://u:p@h/db?sslmode=disable")), JSON.stringify(false), "disable");
eq(JSON.stringify(sslFor("postgres://u:p@h/db?sslmode=require")), JSON.stringify({ rejectUnauthorized: false }), "require: encrypt, self-signed ok");
eq(JSON.stringify(sslFor("postgres://u:p@h/db?sslmode=prefer")), JSON.stringify({ rejectUnauthorized: false }), "prefer");
eq(JSON.stringify(sslFor("postgres://u:p@h/db?sslmode=verify-full")), JSON.stringify({ rejectUnauthorized: true }), "verify-full verifies");
eq(JSON.stringify(sslFor("postgres://u:p@h/db?sslmode=verify-ca")), JSON.stringify({ rejectUnauthorized: true }), "verify-ca verifies");
eq(JSON.stringify(sslFor("not a url")), JSON.stringify(undefined), "unparseable: driver default");
report("db-ssl");
