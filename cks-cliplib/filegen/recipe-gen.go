package filegen

import (
	"os"
	"path/filepath"

	"github.com/CodeKickstart/cks-cliplib/common"
	"github.com/CodeKickstart/cks-cliplib/globals"
	"github.com/CodeKickstart/cks-cliplib/logger"
)

func CreatePhaseAndMiscFilesAndRun(baseDirpath string, tokenFileName string) error {
	err := os.RemoveAll(baseDirpath)
	if err != nil {
		return err
	}
	rootPath := filepath.Dir(baseDirpath)

	tokenFilePath := filepath.Join(rootPath, globals.CONTEXT_DIRNAME, globals.QUERY_DIRNAME, tokenFileName+globals.JSON_EXT)
	logger.Log.Debug(tokenFilePath)

	recipeScaffold := globals.ScaffoldInfoTListT{
		{
			Filepath: tokenFilePath,
			Content: `
{
  "__CONTENT": [
  ]
}
		`,
		},
		{
			Filepath: filepath.Join(baseDirpath, globals.PHASES_DIRNAME, "{{phase-name}}"+globals.JSON_EXT),
			Content: `
{
  "codeblock": "{{code-block-name}}",
  "ops_pipeline": [
	{
	  "remove": {
		"filter": "[*]"
	  }
	},
	{
	  "copy": {
		"filter": "~[__*]|~[.DS_Store, .gitignore]"
	  }
	}
  ]
}
		`,
		},
		{
			Filepath: filepath.Join(rootPath, globals.RUN_PY),
			Content: `
import os.path
import sys

from cks_codegen.main._main_generator import fn_codegen

if len(sys.argv) < 2:
  item_path = os.path.dirname(os.path.realpath(__file__))
else:
  item_path = sys.argv[1]

if os.path.exists(item_path) is False:
  print(f'item_path {item_path} does not exist')
  exit(1)

error, _ = fn_codegen( caller_dirpath=item_path )
if error is not None:
  print(error)
  exit(1)
  `,
		},
	}

	err = common.CreateFiles(recipeScaffold)
	return err
}
