/*
Copyright © 2023 CodeKickStart dattaraybasab0@gmail.com
*/
package add

import (
	"fmt"

	"github.com/CodeKickstart/cks-clip-lib/globals"
	"github.com/CodeKickstart/cks-clip-lib/mgr"
	"github.com/CodeKickstart/cks-clip/logger"
	"github.com/CodeKickstart/cks-clip/misc"

	"github.com/spf13/cobra"
)

// const QUOTE = "\""

var cmdPick = &cobra.Command{
	Use:   "pick",
	Short: "adds a pick operation to an alter directory",
	Long: `
It additionally either creates a new phase file, or adds a new phase entry to an
existing phase file if it already exists.
It also creates a new query context.

	`,
	Args: cobra.ExactArgs(0),
	Run: func(cmdPick *cobra.Command, args []string) {
		templateMap[globals.KEY_ALTER_SUB_COMMAND] = globals.PICK
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
			fmt.Printf("*** FAILED ***: cks-clip add pick - %s\n", error)
			return
		}
		fmt.Println("*** SUCCESS ***: cks-clip add pick")
	},
}

func init() {
	cmdPick.Flags().StringVarP(&recipePath, "recipe-path", "r", "", "recipe path")
	cmdPick.Flags().StringVarP(&targetAppName, "target", "t", "__CODE_BENCH", "the target")

	cmdPick.Flags().StringVarP(&alterDirPath, "alter-dir-path", "a", "", "(Required) relative path to where the alter directory is to be created")
	cmdPick.MarkFlagRequired("alter-dir-path")

	cmdPick.Flags().StringVarP(&alterName, "alter-name", "n", "", "(Required) name (prepended with __) which is appended to the alter-dir-path")
	cmdPick.MarkFlagRequired("alter-name")

	cmdPick.Flags().StringVarP(&moveItems, "movelist", "m", "", "colon separated list of items to move to store")

	cmdPick.Flags().StringVarP(&dependsOnPhase, "depends-on-phase", "d", "phase1", "depends-on phase runs before phase-name")
	cmdPick.Flags().StringVarP(&phaseName, "phase-name", "p", "phase2", "phase name")
	cmdPick.Flags().StringVarP(&codeBlockName, "code-block-name", "c", "base", "code block name")
	cmdPick.Flags().StringVarP(&forceAsString, "force", "f", "true", "force overwrite of existing alter directory")
	AddCmd.AddCommand(cmdPick)
}
