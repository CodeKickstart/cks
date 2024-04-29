package alter

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/CodeKickstart/cks-cliplib/common"
	"github.com/CodeKickstart/cks-cliplib/globals"
	"github.com/CodeKickstart/cks-cliplib/logger"
)

// ensure that the alter location is not already present
// add the alter location to the phase file
// write the modified phase file
// generate the alter directory at the right location
var UpdatePhaseFile = func(templateMap map[string]string) error {

	var getPhaseData = func(templateMap map[string]string) (map[string]interface{}, error) {
		phaseName := templateMap[globals.KEY_PHASE_NAME]
		phasesPath := templateMap[globals.KEY_PHASES_PATH]
		fullPhasePath := filepath.Join(phasesPath, phaseName+globals.JSON_EXT)

		if !common.IsFile(fullPhasePath) {
			err := errors.New("phase file does not exist")
			return nil, err
		}

		if !common.IsFile(fullPhasePath) {
			err := errors.New("phase file does not exist")
			return nil, err
		}
		// read the phase file
		result, err := common.ReadJsonFile(fullPhasePath)
		if err != nil {
			msg := fmt.Sprintf("phase file could not be read: %s", err.Error())
			err = errors.New(msg)
			return nil, err
		}
		return result, err
	}

	var getAlterJson = func(templateMap map[string]string) map[string]interface{} {
		// fullAlterPathWithQuotes := templateMap[globals.KEY_FULL_ALTER_PATH_WITH_QUOTES]
		fullAlterPath := templateMap[globals.KEY_FULL_ALTER_REL_PATH]

		fullAlterPathWithQuotes := globals.QUOTE + fullAlterPath + globals.QUOTE

		jsonStr := `	{
	  "alter": {
		"locator": [` +
			fullAlterPathWithQuotes + `
		]
	  }
	}`

		var jsonFrame map[string]interface{}

		json.Unmarshal([]byte(jsonStr), &jsonFrame)
		return jsonFrame
	}

	// check if the alter command locator is already present
	var checkForDuplicateAlter = func(opsPipeline []interface{}, alterCommand interface{}) error {
		for _, alterCommandInPipeline := range opsPipeline {
			pathFromPipeline := alterCommandInPipeline.(map[string]interface{})["alter"].(map[string]interface{})["locator"].([]interface{})[0].(string)
			pathFromAlterCommand := alterCommand.(map[string]interface{})["alter"].(map[string]interface{})["locator"].([]interface{})[0].(string)
			if pathFromPipeline == pathFromAlterCommand {
				return errors.New("alter command already present")
			}
		}
		return nil
	}

	var addNewAlterToPhase = func(templateMap map[string]string) (map[string]interface{}, error) {
		phaseContent, err := getPhaseData(templateMap)
		if err != nil {
			return nil, err
		}

		alterCommand := getAlterJson(templateMap)
		logger.Log.Debug("alter command to add: ", alterCommand)

		opsPipeline := phaseContent["ops_pipeline"].([]interface{})
		err = checkForDuplicateAlter(opsPipeline, alterCommand)
		if err != nil {
			return nil, err
		}

		appendedPipeline := append(opsPipeline, alterCommand)
		phaseContent["ops_pipeline"] = appendedPipeline
		return phaseContent, nil
	}

	var writePhaseFile = func(phaseContent map[string]interface{}) error {
		jsonifiedPhase, _ := json.MarshalIndent(phaseContent, "", "  ")
		logger.Log.Debug(string(jsonifiedPhase))

		// fmt.Println(string(jsonifiedPhase))
		phaseName := templateMap[globals.KEY_PHASE_NAME]
		phasesPath := templateMap[globals.KEY_PHASES_PATH]
		fullPhasePath := filepath.Join(phasesPath, phaseName+globals.JSON_EXT)

		err := os.WriteFile(fullPhasePath, jsonifiedPhase, fs.ModeAppend.Perm())
		if err != nil {
			msg := fmt.Sprintf("phase file could not be written to: %s", fullPhasePath)
			err = errors.New(msg)
			return err
		}
		return nil
	}

	err := BuildNewAlterDir(templateMap)
	if err != nil {
		return err
	}

	phaseContent, err := addNewAlterToPhase(templateMap)
	if err != nil {
		return err
	}

	err = writePhaseFile(phaseContent)
	if err != nil {
		return err
	}

	logger.Log.Info("SUCCESS: add alter - with updated phase file")
	return nil
}
