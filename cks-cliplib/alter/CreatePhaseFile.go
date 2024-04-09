package alter

import (
	"github.com/CodeKickstart/cks-clip-lib/common"
)

var CreatePhaseFile = func(templateMap map[string]string) error {
	err := BuildNewAlterDir(templateMap)
	if err != nil {
		return err
	}

	phaseFilepath, err := BuildNewPhaseFile(templateMap)
	if err != nil {
		return err
	}

	// substitute the templateMap values
	err = common.ReplaceUsingTemplateMap(templateMap, phaseFilepath)
	if err != nil {
		return err
	}

	return nil
}
