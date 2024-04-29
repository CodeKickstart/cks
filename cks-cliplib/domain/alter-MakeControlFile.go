package domain

import (
	"github.com/CodeKickstart/cks-cliplib/common"
	"github.com/CodeKickstart/cks-cliplib/globals"
)

var MakeControlFile = func(templateMap map[string]string, content string) error {

	jsonControlFileScaffold := globals.ScaffoldInfoTListT{

		{
			Filepath: templateMap[globals.KEY_CONTROL_JSON_PATH],
			Content:  content,
		},
	}

	err := common.CreateFiles(jsonControlFileScaffold)
	if err != nil {
		return err
	}
	return nil
}
