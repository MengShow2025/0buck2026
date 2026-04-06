#!/bin/bash
TOKEN=$NOTION_TOKEN
if [ -z "$TOKEN" ]; then
    echo "❌ Error: NOTION_TOKEN environment variable not set."
    exit 1
fi
DB_IDS=("3372ab9f-0c63-8178-949c-d102b7f0fba2" "3372ab9f-0c63-8128-adc2-fb5b2478bab7" "3372ab9f-0c63-8187-b726-f7990d0192d9" "3372ab9f-0c63-8102-890b-e6613df329b6")

for DB_ID in "${DB_IDS[@]}"
do
    echo "Querying DB: $DB_ID"
    curl -s -X POST "https://api.notion.com/v1/databases/$DB_ID/query" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -H "Notion-Version: 2022-06-28" | jq -r '.results[] | "\(.properties.\"Product Name\".title[0].text.content) | \(.properties.Status.status.name // .properties.Status.select.name // \"N/A\")"'
    echo "-------------------"
done
