package logger

import (
	"io"
	"os"
	"path/filepath"

	"github.com/sirupsen/logrus"
)

const LOG_LEVEL = logrus.FatalLevel
const LOG_DIR_PATH = "logs"
const LOG_FILE_NAME = "/app.log"

var (
	Log *logrus.Logger // share will all packages
)

func init() {
	if _, err := os.Stat(LOG_DIR_PATH); os.IsNotExist(err) {
		os.Mkdir(LOG_DIR_PATH, os.ModePerm)
	}
	logFilePath := filepath.Join(LOG_DIR_PATH, LOG_FILE_NAME)
	f, err := os.OpenFile(logFilePath, os.O_RDWR|os.O_CREATE|os.O_APPEND, os.ModePerm)

	if err != nil {
		panic(err)
	}
	Log = logrus.New()
	Log.SetFormatter(&logrus.TextFormatter{
		// ForceColors: true,
		DisableColors: false,
		PadLevelText: true,
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "@timestamp",
			logrus.FieldKeyMsg:   "@message",
			logrus.FieldKeyLevel: "@level",
			logrus.FieldKeyFunc:  "@caller",
		},
	})
	Log.SetReportCaller(true)
	Log.SetLevel(LOG_LEVEL)

	mw := io.MultiWriter(os.Stdout, f)
	Log.SetOutput(mw)
}
