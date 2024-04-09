package domain

import (
	"github.com/CodeKickstart/cks-clip-lib/common"
	"github.com/CodeKickstart/cks-clip-lib/globals"
)

var MakeQueryTokenFile = func(templateMap map[string]string, content string, queryFilePath string) error {

	queryTokenScaffold := globals.ScaffoldInfoTListT{

		{
			Filepath: queryFilePath,
			Content:  content,
		},
	}

	err := common.CreateFiles(queryTokenScaffold)
	if err != nil {
		return err
	}

	return nil
}
