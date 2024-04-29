package alter

import (
	"errors"
	"path/filepath"
	"strings"

	pick "github.com/CodeKickstart/cks-cliplib/alter-pick"
	recast "github.com/CodeKickstart/cks-cliplib/alter-recast"
	transform "github.com/CodeKickstart/cks-cliplib/alter-transform"
	"github.com/CodeKickstart/cks-cliplib/domain"
	"github.com/CodeKickstart/cks-cliplib/globals"
	"github.com/CodeKickstart/cks-cliplib/logger"
)

var BuildNewAlterDir = func(templateMap map[string]string) error {

	templateMap[globals.KEY_STORE_DIR_PATH] = filepath.Join(templateMap[globals.KEY_ALTER_PATH], globals.STORE_DIRNAME)
	templateMap[globals.KEY_CONTROL_JSON_PATH] = filepath.Join(templateMap[globals.KEY_ALTER_PATH], globals.CONTROL_JSON_FILE)
	templateMap[globals.KEY_CODE_BLOCK_ROOT_PATH] = filepath.Join(templateMap[globals.KEY_RECIPE_PATH], globals.CODE_DIRNAME, templateMap[globals.KEY_CODE_BLOCK_NAME])

	alterRelPath := templateMap[globals.KEY_ALTER_REL_PATH]
	alterRelPath = strings.TrimPrefix(alterRelPath, "/")
	alterRelPathParts := strings.Split(alterRelPath, "/")
	codeBlockPath := templateMap[globals.KEY_CODE_BLOCK_ROOT_PATH]
	for _, part := range alterRelPathParts {
		codeBlockPath = filepath.Join(codeBlockPath, part)
	}
	templateMap[globals.KEY_CODE_BLOCK_PATH] = codeBlockPath

	// templateMap[globals.KEY_CODE_BLOCK_PATH] = filepath.Join(templateMap[globals.KEY_RECIPE_PATH], globals.CODE, templateMap[globals.KEY_CODE_BLOCK_NAME])

	err := domain.BuildStore(templateMap)
	if err != nil {
		return err
	}

	switch templateMap[globals.KEY_ALTER_SUB_COMMAND] {
	case globals.TRANSFORM:
		err = transform.BuildSubcommand(templateMap)
		if err != nil {
			return err
		}
	case globals.RECAST:
		err = recast.BuildSubcommand(templateMap)
		if err != nil {
			return err
		}
	case globals.PICK:
		err = pick.BuildSubcommand(templateMap)
		if err != nil {
			return err
		}
	default:
		msg := "FAILED: unknown alter sub-command"
		logger.Log.Error(msg)
		return errors.New(msg)
	}

	return nil
}
