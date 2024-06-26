package pick

import (
	"github.com/CodeKickstart/cks-cliplib/domain"
)

var BuildSubcommand = func(templateMap map[string]string) error {
	_, err := domain.BuildAlterInfrastucture(templateMap, QueryTemplate, ControlTemplate)
	return err
}
