package filegen

import (
	"errors"
	"os"
	"path/filepath"

	"github.com/CodeKickstart/cks-cliplib/alter"
	"github.com/CodeKickstart/cks-cliplib/common"
	"github.com/CodeKickstart/cks-cliplib/globals"
	"github.com/CodeKickstart/cks-cliplib/logger"
)

func CreateOrUpdatePhaseFile(templateMap map[string]string) error {
	lastPhase := templateMap[globals.KEY_LAST_PHASE]

	var checkDependsonPhaseFileName = func(phasePath string) (bool, error) {

		files, err := os.ReadDir(phasePath)
		if err != nil {
			return false, err
		}
		for _, file := range files {
			if !file.IsDir() {
				phaseNameFromFile := file.Name()
				lastPhaseFileFromDirective := lastPhase + globals.JSON_EXT
				if phaseNameFromFile == lastPhaseFileFromDirective {
					return true, nil
				}
			}
		}
		return false, nil
	}

	// templateMap[globals.KEY_PHASES_PATH] = filepath.Join(templateMap[globals.KEY_BLUEPRINTS_PATH], templateMap[globals.KEY_TARGET], globals.PHASES_DIRNAME)
	// phasesPath := templateMap[globals.KEY_PHASES_PATH]

	rootPathForPhases := filepath.Join(templateMap[globals.KEY_RECIPE_PATH], globals.PHASES_DIRNAME)
	logger.Log.Debug(rootPathForPhases)

	logger.Log.Info(rootPathForPhases)
	success, err := checkDependsonPhaseFileName(rootPathForPhases)
	if err != nil {
		return err
	}
	if !success {
		errNew := errors.New("The phase name " + lastPhase + " does not exist")
		return errNew
	}

	phaseName := templateMap[globals.KEY_PHASE_NAME]

	// does phase already exist?
	currentPhaseFilePath := filepath.Join(rootPathForPhases, phaseName+globals.JSON_EXT)
	isFile := common.IsFile(currentPhaseFilePath)

	if isFile {
		// update the file
		err = alter.UpdatePhaseFile(templateMap)
		if err != nil {
			return err
		}
	} else {
		// create a new file
		err = alter.CreatePhaseFile(templateMap)
		if err != nil {
			return err
		}
	}
	logger.Log.Info("SUCCESS: add alter")

	return nil
}
