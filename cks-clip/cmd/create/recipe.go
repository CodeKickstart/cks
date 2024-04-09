/*
Copyright © 2023 CodeKickStart dattaraybasab0@gmail.com
*/
package create

import (
	"fmt"

	// "log"
	"os"
	"path/filepath"

	"github.com/CodeKickstart/cks-clip-lib/globals"
	"github.com/CodeKickstart/cks-clip-lib/mgr"
	"github.com/CodeKickstart/cks-clip/logger"
	"github.com/CodeKickstart/cks-clip/misc"

	"github.com/spf13/cobra"
)

var (
	pathToSource        string
	recipeContainerPath string
	forceAsString       string
	targetAppName       string
	phaseName           string
	codeblockName       string
	tokenFileName       string
)

var (
	templateMap = map[string]string{}
)

// recipeCmd represents the ping command
var recipeCmd = &cobra.Command{
	Use:   "recipe",
	Short: "This creates a recipe from a source repository",
	Long: `
The recipe is stored in a local directory named __RECIPE.
	`,
	Args: cobra.ExactArgs(0),
	Run: func(cmd *cobra.Command, args []string) {
		templateMap[globals.KEY_PHASE_NAME] = phaseName
		templateMap[globals.KEY_CODE_BLOCK_NAME] = codeblockName
		templateMap[globals.KEY_TARGET_APP_NAME] = targetAppName
		templateMap[globals.KEY_TOKEN_FILE_NAME] = tokenFileName
		templateMap[globals.KEY_FORCE] = forceAsString
		templateMap[globals.KEY_RECIPE_CONTAINER_PATH] = recipeContainerPath

		cwd, _ := os.Getwd()
		logger.Log.Debug("cwd: ", cwd)
		absSrcAppPath, err := filepath.Abs(pathToSource)
		if err != nil {
			print(err)
		}
		templateMap[globals.KEY_SRC_APP_PATH] = absSrcAppPath

		absRecipeContainerPath, err := misc.ComputeRecipePathForCreateRecipe(
			templateMap[globals.KEY_SRC_APP_PATH],
			templateMap[globals.KEY_RECIPE_CONTAINER_PATH])
		if err != nil {
			print(err)
		}

		recipePath := filepath.Join(absRecipeContainerPath, targetAppName, globals.RECIPE_ROOT_DIR_)
		templateMap[globals.KEY_RECIPE_PATH] = recipePath
		templateMap[globals.KEY_TARGET_PATH] = filepath.Dir(templateMap[globals.KEY_RECIPE_PATH])

		err = mgr.CreateRecipe(templateMap)
		if err != nil {
			logger.Log.Error(err)
			msg := fmt.Sprintf("*** FAILED ***: to create recipe at: %s", recipePath)
			fmt.Println(msg)
		}
		fmt.Println("*** SUCCESS ***: created recipe at: ", recipePath)
	},
}

func init() {
	recipeCmd.Flags().StringVarP(&targetAppName, "target", "t", "__CODE_BENCH", "the target application name")

	recipeCmd.Flags().StringVarP(&pathToSource, "source-path", "s", ".", "the path to the source repository")
	recipeCmd.Flags().StringVarP(&recipeContainerPath, "recipe-container-path", "r", "", "the path to the recipe path container")
	recipeCmd.Flags().StringVarP(&forceAsString, "force", "f", "true",
		`overwrites existing directories/files instead of returning an error`)

	recipeCmd.Flags().StringVarP(&phaseName, "phase-name", "p", "phase1", "the phase name")
	recipeCmd.Flags().StringVarP(&codeblockName, "code-block-name", "c", "base", "the code block")

	recipeCmd.Flags().StringVarP(&tokenFileName, "token-file-name", "q", "core-context", "name of the query token file")

	CreateCmd.AddCommand(recipeCmd)
}
