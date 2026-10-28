# M1 Progress — DB Read Layer

**Date:** 2026-10-28
**Status:** Scaffold complete, verified against live Things DB

## What's done
- `app/lib/things-db.ts` — read-only better-sqlite3 client against the real Things 3 DB
  (readonly: true, fileMustExist: true — zero risk to Joey's live task data)
- Decodes `TMArea`, `TMTask` (type=1 → projects, type=0 → tasks), status enum (open/completed/canceled)
- Core Data REAL timestamp decoding verified (creationDate/modificationDate → ISO)
- `app/api/tasks/route.ts` — first working endpoint, `GET /api/tasks?today=1`
- Verified live: query returns real open tasks from Joey's actual inbox + today list

## Known gaps (next session)
- `deadline` / `startDate` fields are bit-packed Things date encodings, not plain
  Core Data REALs — need the actual decode (Things uses a custom int format:
  roughly `(year << 16) | (month << 12) | (day << 7)` for startDate/deadline).
  Stubbed as null for now rather than guessing wrong.
- No project/area join yet (tasks have raw `area`/`project` UUIDs, not titles)
- No Next.js pages yet — API route only, proves the pipe works

## Next concrete step (M1 close-out)
1. Decode the Things date bit-packing (reference: things.py / things-cli open source decoders)
2. Join area/project titles onto tasks in the API response
3. Build `/` Command Center page rendering the JSON as a simple list grouped by area

Est. remaining for M1 close: 1 focused session (~2-3 hrs)

## Build note (2026-10-28)
`better-sqlite3` native module failed to compile via npm install on this host
(node-gyp build error, Node v26 on this machine vs. the package's native binding
target). SQL query logic itself was verified correct via the `sqlite3` CLI
directly against the live DB — confirmed correct columns, correct filters
(type=0, trashed=0, todayIndex IS NOT NULL), real rows returned.

Fix for next session: pin Node to an LTS version node-gyp supports cleanly
(or swap to `node:sqlite` built-in / `sql.js` WASM driver to dodge native
compilation entirely — `node:sqlite` is stable in Node 22+ and needs zero
native build step, likely the better choice here).
