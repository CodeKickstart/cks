/*
Copyright © 2023 CodeKickStart dattaraybasab0@gmail.com
*/
package add

import (
	"github.com/spf13/cobra"
)
var (
	recipePath string
	targetAppName  string
	alterDirPath   string
	alterName      string
	phaseName      string
	codeBlockName  string
	dependsOnPhase string
	moveItems      string
	forceAsString  string
)

var (
	templateMap = map[string]string{}
)

var AddCmd = &cobra.Command{
	Use:   "add",
	Short: "adds a new alter directory",
	Long: `
This command only works when one of "transform", "recast" or "pick" is specified as a suffix.
		`,
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func init() {
}
