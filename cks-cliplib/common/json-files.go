package common

import (
	"encoding/json"
	"io"

	"os"

	"github.com/CodeKickstart/cks-clip-lib/logger"
)

func ReadJsonFile(filePath string) (map[string]interface{}, error) {
	jsonFile, err := os.Open(filePath)

	if err != nil {
		return nil, err
	}
	logger.Log.Info("Successfully Opened users.json")
	defer jsonFile.Close()

	byteValue, _ := io.ReadAll(jsonFile)

	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)

	return result, nil

}
