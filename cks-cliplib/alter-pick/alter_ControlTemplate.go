package pick

var (
	ControlTemplate = `
[
  {
	"op": "pick",
	"directives": {
    "token_id": "{{.FullQueryId}}",
        "define": [
        {{- range $k, $v := .MoveItemsInfo }}
            {
              "movelist": [
                "{{ $k }}"
              ],
              "when": "{{ $v.Key }}"
            }
            {{- if $v.IsLastItem }}{{ else }}, {{ end -}}
        {{- end }}
        ]
    }
  }
]
`
)
