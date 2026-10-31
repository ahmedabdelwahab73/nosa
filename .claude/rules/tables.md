# Tables (dashboard and store)

- **The scroll belongs to the table, not the page.** A long table scrolls inside its own box; the page
  around it stays still (title, filters and pager remain in view).
- **The header row is fixed.** `TableHead` is `sticky top-0` with a solid background, so column names
  stay visible while the rows scroll.
- Both come from the shared `Table` in `shared/ui/table.tsx` (container `max-h-(--table-max-height)`,
  `overflow-auto`). The height token lives in `globals.css`; override it with
  `style`-free utilities (`[--table-max-height:...]`) only when a table sits in a smaller box.
- Never build a table with raw `<table>` or give a page-level `overflow` to fake this. Use `Table`.
- Short tables (a few rows) simply don't reach the max height, so nothing changes for them.
- Rows keep a stable order: sort by a field that doesn't change on edit (`createdAt`, `_id`), never by
  `updatedAt`, or a row jumps when it is toggled.
- Pagination, filters and sort go through URL params (see `performance.md`).
