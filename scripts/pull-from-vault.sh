#!/usr/bin/env bash
# pull-from-vault.sh — sync published notes from the Aria vault to src/posts/
#
# Used locally by the Aria publisher profile's /publish skill (and runnable manually).
# CF Pages does NOT run this — posts are committed into the repo before deploy.

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
	# strip the leading folder so we just get the basename
	basename="${vault_path##*/}"
	target="$POSTS_DIR/$basename"

	echo "  → $basename"
	aria vault note read --profile publisher --path "${vault_path#publisher/}" \
		| python3 -c "import sys,json; print(json.load(sys.stdin)['data']['body'])" \
		> "$target"
done

echo "Synced ${#PATHS[@]} note(s) to $POSTS_DIR"
echo "Next: review with 'git diff src/posts' and commit if good."
