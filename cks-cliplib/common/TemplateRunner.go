package common

import (
	"bytes"
	"text/template"

	"github.com/CodeKickstart/cks-clip-lib/globals"
	"github.com/CodeKickstart/cks-clip-lib/logger"
)

func RunTemplate(templateText string, tmplRootData globals.SubstitionTemplateT) (string, error) {
	var buf bytes.Buffer

	template.Must(
		template.New("run").Parse(templateText),
	).Execute(&buf, tmplRootData)
	logger.Log.Debug(buf.String())

	return buf.String(), nil

}
