# Agent Rules & Instructions for Fursat

1. **Context First**: Always read `RESUME.md` and `FURSAT_HANDOFF_v10.md` first before starting any work.
2. **Git State Verification**: Run `git log` and `git status` first at the start of every session; skip work that is already committed.
3. **Environment & Shell**: Use Windows PowerShell 5 syntax (`;` instead of `&&`, use `npm.cmd` instead of bare `npm`).
4. **No Deployment**: Never run `deploy` or `deploy:login`.
5. **No Performance Audits / Hero Work**: Do not run Lighthouse, site audits, or modify hero/intro scripts unless specifically directed.
6. **File Reading & Tooling Constraints**:
   - Use the `edit` tool only for source changes.
   - Use `grep` or small line ranges; never open `dist/` HTML or full JSON files over 200 lines.
7. **Git Safety**: Never run `git checkout` or `git restore` on files with uncommitted work.
8. **Commits & Verification**:
   - Commit after each task.
   - Tick the checklist in `RESUME.md` and commit it alongside the changes.
   - Run `npm.cmd run build` once and confirm 14 pages are built cleanly.
9. **Asset Integrity**:
   - Use real photos only; never use AI-generated images or hand-made toy `.glb` models.
   - A `.glb` file is allowed only as a real 3D scan at `public/models/fursat-bar.glb`.
10. **Data Integrity**: Never invent menu data. Any unreadable prices must be marked `null` with a `TODO(client)` note.
11. **Raw Assets**: `raw_assets/` is gitignored and must never be referenced directly by the site frontend.
12. **FFmpeg**: If FFmpeg is required, install via `npm.cmd i --no-save ffmpeg-static` (reinstall on a fresh clone).
