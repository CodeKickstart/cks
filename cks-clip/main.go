package main

import (
	"github.com/CodeKickstart/cks-clip/cmd"
	"github.com/CodeKickstart/cks-clip/logger"
)

func main() {
	logger.Log.Info("------------------- cks-clip -----------------------")
	// fmt.Println("logger level: %v", logger.Log.GetLevel())

	cmd.Execute()

}
