package pick

import (
	"github.com/CodeKickstart/cks-clip-lib/domain"
)

var BuildSubcommand = func(templateMap map[string]string) error {
	_, err := domain.BuildAlterInfrastucture(templateMap, QueryTemplate, ControlTemplate)
	return err
}
