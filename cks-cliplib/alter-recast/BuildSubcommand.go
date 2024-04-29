package recast

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/CodeKickstart/cks-cliplib/common"
	"github.com/CodeKickstart/cks-cliplib/domain"
	"github.com/CodeKickstart/cks-cliplib/globals"
)

var BuildSubcommand = func(templateMap map[string]string) error {
	var getFirstMoveItem = func(templateMap map[string]string) (string, error) {
		moveItems := templateMap[globals.KEY_MOVE_ITEMS]
		moveItemParts := strings.Split(moveItems, ":")
		if len(moveItemParts) == 0 {
			err := fmt.Errorf("no move-item is available")
			return "", err
		}
		firstMoveItem := moveItemParts[0]
		return firstMoveItem, nil
	}
	var replaceFirstMoveItemFileNameWithToken = func(templateMap map[string]string) error {
		firstMoveItem, err := getFirstMoveItem(templateMap)
		if err != nil {
			return err
		}

		storePath := filepath.Join(templateMap[globals.KEY_ALTER_PATH], globals.STORE_DIRNAME)
		if !common.IsDir(storePath) {
			err := fmt.Errorf("store-path %s does not exist", storePath)
			return err
		}
		templateMap[globals.KEY_STORE_PATH] = storePath

		oldPath := filepath.Join(storePath, firstMoveItem)
		newPath := filepath.Join(storePath, "{{name}}")

		err = os.Rename(oldPath, newPath)
		if err != nil {
			return err
		}
		return nil
	}
	err := replaceFirstMoveItemFileNameWithToken(templateMap)
	if err != nil {
		return err
	}

	_, err = domain.BuildAlterInfrastucture(templateMap, QueryTemplate, ControlTemplate)
	return err
}
