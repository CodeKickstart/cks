package common

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/CodeKickstart/cks-cliplib/logger"
)

const CONTENT_START = "{{"
const CONTENT_END = "}}"

func ReplaceUsingTemplateMap(templateMap map[string]string, dirpath string) error {
	var substituteContents = func(templateMap map[string]string, filePatterns []string) filepath.WalkFunc {
		var substitute = func(in_text string, templateMap map[string]string) string {
			out_text := strings.Clone(in_text)
			for old, new := range templateMap {
				out_text = strings.Replace(out_text, old, new, -1)
			}
			return out_text
		}

		err := filepath.WalkFunc(func(path string, fileInfo os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if fileInfo.IsDir() {
				return nil
			}

			var matched bool
			for _, pattern := range filePatterns {
				var err error
				matched, err = filepath.Match(pattern, fileInfo.Name())
				if err != nil {
					return err
				}

				if matched {
					read, err := os.ReadFile(path)
					if err != nil {
						return err
					}

					path_substitute := substitute(path, templateMap)

					msg := fmt.Sprintf("Substituting: %s --> %v", path, path_substitute)
					logger.Log.Debug(msg)

					// newContents := strings.Replace(string(read), old, new, -1)
					newContents := substitute(string(read), templateMap)

					// Create parent directory for substituted path if it doesn't exist
					parentDir := filepath.Dir(path_substitute)
					if !IsDir(parentDir) {
						err = os.MkdirAll(parentDir, os.ModePerm)
						if err != nil {
							return err
						}
						err = os.RemoveAll(path)
						if err != nil {
							return err
						}
					}

					err = os.WriteFile(path_substitute, []byte(newContents), os.ModePerm)
					if err != nil {
						return err
					}
				}
			}
			return nil
		})

		if err != nil {
			return err
		}
		return nil
	}
	cleanupList := []string{}
	var collectCleanups = func(templateMap map[string]string) filepath.WalkFunc {

		err := filepath.WalkFunc(
			func(path string, fileInfo os.FileInfo, err error) error {
				if err != nil {
					return err
				}

				pathName := filepath.Base(path)
				if strings.Contains(pathName, CONTENT_START) || strings.Contains(pathName, CONTENT_END) {
					cleanupList = append(cleanupList, path)
				}
				return nil
			})
		return err
	}

	patterns := []string{"*.*"}
	err := filepath.Walk(dirpath, substituteContents(templateMap, patterns))
	if err != nil {
		return err
	}

	err = filepath.Walk(dirpath, collectCleanups(templateMap))
	if err != nil {
		return err
	}

	for _, path := range cleanupList {
		err = os.RemoveAll(path)
		if err != nil {
			return err
		}
	}
	return nil
}
