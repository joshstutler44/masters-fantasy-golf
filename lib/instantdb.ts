import { init, i } from "@instantdb/react";

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID!;

const schema = i.schema({
  entities: {
    submissions: i.entity({
      playerName: i.string(),
      golfers: i.json<string[]>(),
      totalSalary: i.number(),
      createdAt: i.number(),
    }),
  },
});

const db = init({ appId: APP_ID, schema });

export default db;
export type DB = typeof db;
