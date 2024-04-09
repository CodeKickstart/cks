package common

import (
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

func GetNamedPath(dirPath string, searchPathFragment string) (string, error) {
	dirPathParts := strings.Split(dirPath, "/")
	newPath := ""
	for i, dirPathPart := range dirPathParts {
		newPath = newPath + dirPathPart + "/"
		if dirPathPart == searchPathFragment {
			fmt.Println("misc/envmgr.go::SetRecipePath: index, dirPathPart::", i, dirPathPart)
			return newPath, nil
		}
	}
	return "", fmt.Errorf("misc/envmgr.go::SetRecipePath: %s not found in %s", searchPathFragment, dirPath)
}

func IsDir(path string) bool {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false
	}
	if fileInfo.IsDir() {
		return true
	}
	return false
}


func IsFile(path string) bool {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false
	}
	if !fileInfo.IsDir() {
		return true
	}
	return false
}

// CopyDir copies the content of src to dst. src should be a full path.
func CopyDir(dst, src string) error {

	return filepath.Walk(src, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// copy to this path
		outpath := filepath.Join(dst, strings.TrimPrefix(path, src))

		if info.IsDir() {
			os.MkdirAll(outpath, info.Mode())
			return nil // means recursive
		}

		// handle irregular files
		if !info.Mode().IsRegular() {
			switch info.Mode().Type() & os.ModeType {
			case os.ModeSymlink:
				link, err := os.Readlink(path)
				if err != nil {
					return err
				}
				return os.Symlink(link, outpath)
			}
			return nil
		}

		// copy contents of regular file efficiently

		// open input
		in, _ := os.Open(path)
		if err != nil {
			return err
		}
		defer in.Close()

		// create output
		fh, err := os.Create(outpath)
		if err != nil {
			return err
		}
		defer fh.Close()

		// make it the same
		fh.Chmod(info.Mode())

		// copy content
		_, err = io.Copy(fh, in)
		return err
	})
}

