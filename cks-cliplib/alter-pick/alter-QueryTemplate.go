package pick

var (
	QueryTemplate = `
{
  "__CONTENT": [
      {
          "id": "{{.ShortQueryId}}",
          "kind": "pickmany",
          "prompt": "enter ...",
          "defval": [
        {{- range $k, $v := .MoveItemsInfo }}
            {{- $v.Index }}
            {{- if $v.IsLastItem }}{{ else }}, {{ end -}}
        {{- end -}}
          ],
          "children": {
            "kind": "literal",
              "override": [
        {{- range $k, $v := .MoveItemsInfo }}
            "{{- $v.Key }}"
            {{- if $v.IsLastItem }}{{ else }}, {{ end -}}
        {{- end -}}
              ]
            }
      }
  ]
}
`
)
