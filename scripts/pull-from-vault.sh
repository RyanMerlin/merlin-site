#!/usr/bin/env bash
# pull-from-vault.sh — sync approved notes from the Aria vault into Astro page
# bundles at src/posts/<year>/<slug>/index.md (YAML frontmatter).
#
# Used locally by the Aria publisher profile's /pub publish flow (and runnable
# manually). CF Pages does NOT run this — posts are committed into the repo,
# then `bun run build` (astro) renders them at deploy time.
# NOTE: VAULT_FOLDER tracks the documented vault folder; if the staging folder
# is renamed (published -> pre-published), update it here.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POSTS_DIR="$REPO_ROOT/src/posts"
VAULT_FOLDER="publisher/published"

if ! command -v aria >/dev/null 2>&1; then
	echo "error: aria CLI not on PATH" >&2
	exit 1
fi

mkdir -p "$POSTS_DIR"

echo "Listing $VAULT_FOLDER ..."
mapfile -t PATHS < <(aria vault list --profile publisher --folder "$VAULT_FOLDER" \
	| python3 -c "import sys,json; [print(n['path']) for n in json.load(sys.stdin)['data']['notes'] if n['path'].endswith('.md')]")

if [[ ${#PATHS[@]} -eq 0 ]]; then
	echo "No published notes found."
	exit 0
fi

for vault_path in "${PATHS[@]}"; do
	# vault_path looks like: publisher/published/2026-05-10-foo.md
	basename="${vault_path##*/}"
	name="${basename%.md}"

	# Astro expects page bundles: src/posts/<year>/<slug>/index.md
	# Derive <year>/<slug> from the dated vault filename (YYYY-MM-DD-<slug>).
	if [[ "$name" =~ ^([0-9]{4})-[0-9]{2}-[0-9]{2}-(.+)$ ]]; then
		year="${BASH_REMATCH[1]}"
		slug="${BASH_REMATCH[2]}"
	else
		year="$(date +%Y)"
		slug="$name"
	fi

	target_dir="$POSTS_DIR/$year/$slug"
	mkdir -p "$target_dir"
	target="$target_dir/index.md"

	echo "  → $year/$slug/index.md"
	# The note body must carry YAML frontmatter (title/created/status/tags/summary)
	# matching src/content.config.ts. Colocated images are NOT synced by this
	# script — place any ./img.png next to index.md by hand.
	aria vault note read --profile publisher --path "${vault_path#publisher/}" \
		| python3 -c "import sys,json; print(json.load(sys.stdin)['data']['body'])" \
		> "$target"
done

echo "Synced ${#PATHS[@]} note(s) to $POSTS_DIR"
echo "Next: review with 'git diff src/posts', run 'bun run build' to validate, then commit if good."
