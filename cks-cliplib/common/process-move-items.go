package common

import (
	"strings"

	"github.com/CodeKickstart/cks-cliplib/globals"
)

var GetMoveItemMap = func(templateMap map[string]string) (map[string]globals.MoveItemDetailsT, error) {
	moveItemMap := make(map[string]globals.MoveItemDetailsT)
	moveItems := templateMap[globals.KEY_MOVE_ITEMS]
	moveItemParts := strings.Split(moveItems, ":")

	lastIndexOfMoveItems := len(moveItemParts) - 1
	index := 0
	for _, moveItemVal := range moveItemParts {
		isLastItem := false
		if index == lastIndexOfMoveItems {
			isLastItem = true
		}

		moveItemKey := strings.Replace(moveItemVal, ".", "_", -1)
		MoveItemDetails := globals.MoveItemDetailsT{Key: moveItemKey, Index: index, IsLastItem: isLastItem, IsFirstItem: index == 0}

		moveItemMap[moveItemVal] = MoveItemDetails
		index++
	}
	return moveItemMap, nil
}

// ???
// 	if _, err := os.Stat(movePath); !os.IsNotExist(err) {
// 		err := fmt.Sprintf("Move path does not exist: %v", movePath)
// 		panic(err)
// 	}
// }
