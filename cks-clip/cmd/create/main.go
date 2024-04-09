/*
Copyright © 2023 CodeKickStart dattaraybasab0@gmail.com
*/
package create

import (
	"github.com/spf13/cobra"
)


var CreateCmd = &cobra.Command{
	Use:   "create",
	Short: "Creates a new recipe directory",
	Long: `
This command only works when "recipe" is specified as a suffix.
		`,
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func init() {
}
