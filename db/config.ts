import { column, defineDb, defineTable } from "astro:db";

const Board = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text(),
    name: column.text(),
  },
  indexes: {
    board_slug: { on: "slug" },
  },
});

export const COLUMN = {
  TODO: "todo",
  DONE: "done",
  IN_PROGRESS: "in_progress",
};

const Card = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    boardId: column.number({ references: () => Board.columns.id }),
    name: column.text(),
    description: column.text({ optional: true }),
    column: column.text({ default: COLUMN.TODO }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Board, Card },
});
