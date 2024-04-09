package transform

var (
	QueryTemplate = `
{
  "__CONTENT": [
  	{
      "id": "{{.ShortQueryId}}",
      "kind": "text",
      "prompt": "enter ...:",
      "defval": "{{.FirstWordInFirstFile}}"
    }
  ]
}
`
)
