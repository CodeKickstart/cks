package misc

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/CodeKickstart/cks-clip/logger"
	"github.com/CodeKickstart/cks-cliplib/common"
)

var ComputeRecipePathForAddAter = func(recipePath, targetAppName, recipeDirName string) (string, error) {

	if recipePath == "" {

		cwd, _ := os.Getwd()
		parent := filepath.Dir(cwd)
		recipePath = filepath.Join(parent, targetAppName, recipeDirName)
		if !common.IsDir(recipePath) {
			msg := fmt.Sprintf("The recipe-path, %s, is not a directory.", recipePath)
			logger.Log.Error(msg)
			// print("The recipe-path, ", recipePath, " is not a directory.")
			return "", fmt.Errorf(msg)
		}
	}
	return recipePath, nil
}

var ComputeRecipePathForCreateRecipe = func(sourceAppPath string, recipeContainerPath string) (string, error) {

	absRecipeContainerPath := ""
	if len(recipeContainerPath) == 0 {
		absRecipeContainerPath = filepath.Dir(sourceAppPath) // if the recipe container path is not provided, use the source path
		return absRecipeContainerPath, nil
	} else {
		absRecipeContainerPath, err := filepath.Abs(recipeContainerPath)
		if err != nil {
			return "", err
		}
		return absRecipeContainerPath, nil
	}
}
