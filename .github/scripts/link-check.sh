#!/usr/bin/env bash

# 参考
# https://note.com/minato_kame/n/n674efc3d7028
set -uo pipefail

: "${URL_LIST_FILE:?URL_LIST_FILE is required}"
: "${RESULT_FILE:?RESULT_FILE is required}"
: "${CHECKED_DATE:?CHECKED_DATE is required}"
: "${ACTIONS_RUN_URL:?ACTIONS_RUN_URL is required}"
: "${GITHUB_OUTPUT:?GITHUB_OUTPUT is required}"

# 集計用の状態と、一時出力ファイルを初期化する。
status=0
target_count=$(grep -c '^' "$URL_LIST_FILE")
counter=1
tmp_file=$(mktemp)

# 一時ファイルは終了時に必ず削除する。
cleanup() {
    rm -f "$tmp_file"
}

trap cleanup EXIT

# 結果レポートのヘッダーを先に書き出す。
{
    echo "|Checked date|Actions url|"
    echo "|---|---|"
    echo "|***${CHECKED_DATE}***|${ACTIONS_RUN_URL}|"
    echo "# Link check result"
} > "$RESULT_FILE"

# URL リストを1件ずつ検査し、失敗時だけ詳細を結果ファイルへ追記する。
while IFS= read -r url || [ -n "$url" ]; do
    [ -z "$url" ] && continue

    echo "[ $counter/$target_count ]"

    if npx blc -gi --requests 1 \
        --exclude 'twitter.com' \
        --exclude 'docs.github.com' \
        --exclude 'https://www.net-fun.co.jp/SBJ777/spec.html' \
        --exclude 'cloudflare.com' \
        --user-agent "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1" \
        --filter-level 0 "$url" > "$tmp_file"; then
        :
    else
        status=$?
        echo "Fail {$status}"
        echo "Target {$url}"
        echo "## Target URL" >> "$RESULT_FILE"
        echo "$url" >> "$RESULT_FILE"

        # 壊れたリンクは箇条書きで見やすく残す。
        if grep -q 'BROKEN' "$tmp_file"; then
            echo "### Broken" >> "$RESULT_FILE"
            grep 'BROKEN' "$tmp_file" | cut -c17- | sed 's/^/* /' >> "$RESULT_FILE"
        fi

        # broken-link-checker 自体の実行エラーも別枠で残す。
        if grep -qi 'ERROR' "$tmp_file"; then
            echo "### Error" >> "$RESULT_FILE"
            grep -i 'ERROR' "$tmp_file" | cut -c8- >> "$RESULT_FILE"
        fi

        echo >> "$RESULT_FILE"

        # BROKEN がなくてもエラーになるケースが稀にあるため、
        # Actions 上で調査できるように標準出力へも出す。
        cat "$tmp_file"
    fi

    counter=$((counter + 1))
done < "$URL_LIST_FILE"

# 全件成功した場合も、成功が分かるメッセージを結果に残す。
if [ "$status" -eq 0 ]; then
    echo "All external links operational" >> "$RESULT_FILE"
fi

# 後続 step が判定できるように終了ステータスを Actions 出力へ渡す。
echo "status {$status}"
echo "status=$status" >> "$GITHUB_OUTPUT"
