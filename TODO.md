# TODO

## Step 1: Gather context
- [x] Read `Portfolio_Frontend/src/components/Projects.tsx` to locate status/grouping logic.

## Step 2: Plan fix
- [x] Update status logic so badges/sections support exactly 3 statuses: `active`, `complete/past`, `funded`.


## Step 3: Implement code changes
- [ ] Modify filtering so `funded` and `complete/past` are separate buckets.
- [ ] Normalize badge text/classes: map `project.status` / `project.category` into 3 labels.
- [ ] Ensure `project?` URL auto-expansion still works with new keys.

## Step 4: Verify
- [ ] Run frontend typecheck/build (if available) or `npm test`/`npm run build` for `Portfolio_Frontend`.

