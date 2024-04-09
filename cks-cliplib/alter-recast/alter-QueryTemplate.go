package recast

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
            {{- if $v.IsFirstItem }}{{- $v.Index }}{{ else }}{{ end -}}
        {{- end -}}
          ],
          "children": {
            "kind": "literal",
              "override": [
        {{- range $k, $v := .MoveItemsInfo }}
            {{- if $v.IsFirstItem }}"{{- $v.Key }}"{{ else }}{{ end -}}
        {{- end -}}
              ]
            }
      }
  ]
}
`
)
