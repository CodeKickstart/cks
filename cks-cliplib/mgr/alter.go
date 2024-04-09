package mgr

import (
	"fmt"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/CodeKickstart/cks-clip-lib/common"
	"github.com/CodeKickstart/cks-clip-lib/filegen"
	"github.com/CodeKickstart/cks-clip-lib/globals"
	"github.com/CodeKickstart/cks-clip-lib/logger"
)

const prefix = "/"

var codeBlockPath string

func AddAlter(
	templateMap map[string]string,
) error {

	forceAsString := templateMap[globals.KEY_FORCE]
	force, err := strconv.ParseBool(forceAsString)
	msg := fmt.Sprintf("force: %v", force)
	logger.Log.Debug(msg)
	if err != nil {
		force = false
	}

	templateMap[globals.KEY_TARGET_PATH] = filepath.Dir(templateMap[globals.KEY_RECIPE_PATH])
	templateMap[globals.KEY_PHASES_PATH] = filepath.Join(templateMap[globals.KEY_RECIPE_PATH], globals.PHASES_DIRNAME)

	err = addAlter(templateMap)
	if err != nil {
		logger.Log.Error(err)
		return err
	}

	return err
}

func addAlter(templateMap map[string]string) error {
	var calcAlterPath = func(templateMap map[string]string) (string, error) {
		var joinAlterDirPath = func(baseDir string, frags []string) string {
			for _, frag := range frags {
				baseDir = filepath.Join(baseDir, frag)
			}
			return baseDir
		}

		codeBlockName := templateMap[globals.KEY_CODE_BLOCK_NAME]
		recipeDirpath, err := filepath.Abs(templateMap[globals.KEY_RECIPE_PATH])
		if err != nil {
			return "", err
		}
		alterName := templateMap[globals.KEY_ALTER_NAME]

		alterDirPath := templateMap[globals.KEY_ALTER_REL_PATH]
		cutAlterDirPath := strings.TrimPrefix(alterDirPath, prefix)
		cutAlterDirParts := strings.Split(cutAlterDirPath, prefix)
		codeBlockPath = filepath.Join(recipeDirpath, "__CODE", codeBlockName)
		codeBlockPath = joinAlterDirPath(codeBlockPath, cutAlterDirParts)
		prefixedAlterName := globals.SPECIAL_DIR_PREFIX_ + alterName
		fullAlterPath := filepath.Join(codeBlockPath, prefixedAlterName)

		if common.IsDir(fullAlterPath) {
			err := fmt.Errorf("full-alter-path %s already exists", fullAlterPath)
			return fullAlterPath, err
		}

		return fullAlterPath, nil
	}

	var processAddAlterCommand = func() error {
		err := filegen.CreateOrUpdatePhaseFile(templateMap)
		if err != nil {
			return err
		}
		return nil
	}

	alterPath, err := calcAlterPath(templateMap)
	if err != nil {
		return err
	}
	templateMap[globals.KEY_ALTER_PATH] = alterPath

	fullRelativeAlterPath := filepath.Join(templateMap[globals.KEY_ALTER_REL_PATH], globals.SPECIAL_DIR_PREFIX_+templateMap[globals.KEY_ALTER_NAME])
	templateMap[globals.KEY_FULL_ALTER_REL_PATH] = fullRelativeAlterPath

	err = processAddAlterCommand()
	if err != nil {
		return err
	}
	return nil
}
