package recast

var (
	ControlTemplate = `
[
  {
	"op": "recast",
	"directives": {
	  "declare": {
		"name": "{{.FullQueryId}}"
	  }
	}
  }
]
`
)
