// Mission Control — Things 3 SQLite read layer (M1)
// Reads directly from the Things 3 local database. Read-only by design;
// writes should go through the `things` CLI / URL scheme, never direct SQL.

import Database from "better-sqlite3";
import os from "os";
import path from "path";

const DB_PATH = path.join(
  os.homedir(),
  "Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac/ThingsData-SACIH/Things Database.thingsdatabase/main.sqlite"
);

export type ThingsStatus = "open" | "completed" | "canceled";

export interface ThingsTask {
  uuid: string;
  title: string;
  notes: string | null;
  status: ThingsStatus;
  areaId: string | null;
  projectId: string | null;
  headingId: string | null;
  deadline: string | null; // ISO date, derived from Things' Julian-ish int encoding
  startDate: string | null;
  todayIndex: number | null;
  createdAt: string;
  modifiedAt: string;
}

export interface ThingsArea {
  uuid: string;
  title: string;
}

export interface ThingsProject {
  uuid: string;
  title: string;
  areaId: string | null;
  status: ThingsStatus;
}

function statusFromInt(n: number): ThingsStatus {
  // Things encodes: 0 = open, 3 = canceled, otherwise treated completed (e.g. 2)
  if (n === 0) return "open";
  if (n === 3) return "canceled";
  return "completed";
}

// Things stores several date fields as an Apple-epoch-based integer encoding
// (seconds-ish since 2001-01-01, bit-packed for some fields). For MVP we only
// decode the plain REAL creation/modification timestamps (Unix-epoch-like,
// seconds since 2001-01-01 per Core Data convention) which are reliable.
const CORE_DATA_EPOCH_OFFSET_SECONDS = 978307200; // 2001-01-01T00:00:00Z in Unix time

function coreDataRealToISO(value: number | null): string | null {
  if (value === null || value === undefined) return null;
  const unixSeconds = value + CORE_DATA_EPOCH_OFFSET_SECONDS;
  return new Date(unixSeconds * 1000).toISOString();
}

let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (!dbInstance) {
    // readonly + fileMustExist: never risk mutating Joey's live Things DB
    dbInstance = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return dbInstance;
}

export function getAreas(): ThingsArea[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT uuid, title FROM TMArea ORDER BY \"index\"`)
    .all() as { uuid: string; title: string }[];
  return rows;
}

export function getProjects(): ThingsProject[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT uuid, title, area, status FROM TMTask
       WHERE type = 1 AND trashed = 0
       ORDER BY \"index\"`
    )
    .all() as { uuid: string; title: string; area: string | null; status: number }[];
  return rows.map((r) => ({
    uuid: r.uuid,
    title: r.title,
    areaId: r.area,
    status: statusFromInt(r.status),
  }));
}

export function getTasks(opts: { todayOnly?: boolean } = {}): ThingsTask[] {
  const db = getDb();
  const where = ["type = 0", "trashed = 0"];
  if (opts.todayOnly) where.push("todayIndex IS NOT NULL AND todayIndex < 1000000");
  const rows = db
    .prepare(
      `SELECT uuid, title, notes, status, area, project, heading,
              todayIndex, creationDate, userModificationDate
       FROM TMTask
       WHERE ${where.join(" AND ")}
       ORDER BY \"index\"`
    )
    .all() as any[];

  return rows.map((r) => ({
    uuid: r.uuid,
    title: r.title,
    notes: r.notes,
    status: statusFromInt(r.status),
    areaId: r.area,
    projectId: r.project,
    headingId: r.heading,
    deadline: null, // TODO M1.1: decode deadline int encoding properly
    startDate: null, // TODO M1.1: decode startDate int encoding properly
    todayIndex: r.todayIndex,
    createdAt: coreDataRealToISO(r.creationDate) ?? "",
    modifiedAt: coreDataRealToISO(r.userModificationDate) ?? "",
  }));
}

export function closeDb() {
  dbInstance?.close();
  dbInstance = null;
}
