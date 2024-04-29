/*
Copyright © 2023 CodeKickStart dattaraybasab0@gmail.com
*/
package add

import (
	"fmt"

	"github.com/CodeKickstart/cks-clip/logger"
	"github.com/CodeKickstart/cks-clip/misc"
	"github.com/CodeKickstart/cks-cliplib/globals"
	"github.com/CodeKickstart/cks-cliplib/mgr"

	"github.com/spf13/cobra"
)

// const QUOTE = "\""

var cmdRecast = &cobra.Command{
	Use:   "recast",
	Short: "adds a recast operation to an alter directory",
	Long: `
It additionally either creates a new phase file, or adds a new phase entry to an
existing phase file if it already exists.
It also creates a new query context.
	`,
	Args: cobra.ExactArgs(0),
	Run: func(cmdalter *cobra.Command, args []string) {
		templateMap[globals.KEY_ALTER_SUB_COMMAND] = globals.RECAST
		templateMap[globals.KEY_TARGET_APP_NAME] = targetAppName
		templateMap[globals.KEY_PHASE_NAME] = phaseName
		templateMap[globals.KEY_CODE_BLOCK_NAME] = codeBlockName
		templateMap[globals.KEY_MOVE_ITEMS] = moveItems
		templateMap[globals.KEY_RECIPE_PATH] = recipePath
		templateMap[globals.KEY_LAST_PHASE] = dependsOnPhase
		templateMap[globals.KEY_DEPENDS_ON_PHASE] = dependsOnPhase
		templateMap[globals.KEY_ALTER_REL_PATH] = alterDirPath
		templateMap[globals.KEY_ALTER_NAME] = alterName
		templateMap[globals.KEY_FORCE] = forceAsString

		recipePath, err := misc.ComputeRecipePathForAddAter(recipePath, targetAppName, globals.RECIPE_DIRNAME)
		if err != nil {
			logger.Log.Error(err)
			fmt.Printf("*** FAILED ***: cks-clip add pick - %s\n", err)
			return
		}
		templateMap[globals.KEY_RECIPE_PATH] = recipePath

		logger.Log.Debug("template-map: ", templateMap)
		error := mgr.AddAlter(
			templateMap)
		if error != nil {
			logger.Log.Error(error)
			fmt.Printf("*** FAILED ***: cks-clip add recast - %s\n", error)
			return
		}
		fmt.Println("*** SUCCESS ***: cks-clip add recast")
	},
}

func init() {
	cmdRecast.Flags().StringVarP(&recipePath, "recipe-path", "r", "", "recipe path")
	cmdRecast.Flags().StringVarP(&targetAppName, "target app name", "t", "__CODE_BENCH", "the target")

	cmdRecast.Flags().StringVarP(&alterDirPath, "alter-dir-path", "a", "", "(Required) relative path to where the alter directory is to be created")
	cmdRecast.MarkFlagRequired("alter-dir-path")

	cmdRecast.Flags().StringVarP(&alterName, "alter-name", "n", "", "(Required) name (prepended with __) which is appended to the alter-dir-path")
	cmdPick.MarkFlagRequired("alter-name")
	cmdRecast.MarkFlagRequired("alter-name")

	cmdRecast.Flags().StringVarP(&moveItems, "movelist", "m", "", "colon separated list of items (both files and folders) to move to store")
	cmdRecast.Flags().StringVarP(&dependsOnPhase, "depends-on-phase", "d", "phase1", "depends-on phase runs before phase-name")
	cmdRecast.Flags().StringVarP(&phaseName, "phase-name", "p", "phase2", "phase name")
	cmdRecast.Flags().StringVarP(&codeBlockName, "code-block-name", "c", "base", "code block name")
	cmdRecast.Flags().StringVarP(&forceAsString, "force", "f", "true", "force overwrite of existing alter directory")
	AddCmd.AddCommand(cmdRecast)
}
