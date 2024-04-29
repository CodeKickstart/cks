package common

import (
	"bufio"
	"os"
	"path/filepath"

	"github.com/CodeKickstart/cks-cliplib/globals"
)

func CreateFiles(infoList globals.ScaffoldInfoTListT) error {
	for _, info := range infoList {
		filePath := info.Filepath
		text := info.Content

		parentDirpath := filepath.Dir(filePath)
		err := os.MkdirAll(parentDirpath, os.ModePerm)
		if err != nil {
			return err
		}

		f, err := os.Create(filePath)
		if err != nil {
			return err
		}
		w := bufio.NewWriter(f)

		w.WriteString(text)

		w.Flush()
		f.Close()
	}
	return nil
}
