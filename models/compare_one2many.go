package models

import (
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"strings"

	"github.com/astaxie/beego/logs"
	"github.com/lifei6671/mindoc/utils"
)

type Extract struct {
	Features interface{} `json:"features"`
	TimeUsed int         `json:"time_used"`
}

type Compare struct {
	Confidence float64 `json:"confidence"`
	TimeUsed   int     `json:"time_used"`
}

// New Compare
func Comparing(file1, file2 multipart.File) (conf float64, err error) {
	defer func() {
		if err != nil {
			logs.Error(err)
		}
	}()

	path1 := "/tmp/img1.jpg"
	path2 := "/tmp/img2.jpg"

	img1, _ := os.Create(path1)
	img2, _ := os.Create(path2)
	defer img1.Close()
	defer img2.Close()

	if _, err = io.Copy(img1, file1); err != nil {
		return
	}
	if _, err = io.Copy(img2, file2); err != nil {
		return
	}

	// Ensure
	if err = EnsureExist(path1); err != nil {
		return
	}

	if err = EnsureExist(path2); err != nil {
		return
	}

	var cmd []string
	cmd = append(cmd, "/tmp/img1.jpg")
	cmd = append(cmd, "/tmp/img2.jpg")
	//cmd = append(cmd, "2>/dev/null")
	o, err := utils.Execute("./verify", cmd, true)

	o = strings.TrimSpace(o)
	if out := strings.Split(o, "\n"); len(out) > 2 {
		conf, _ = strconv.ParseFloat(out[len(out)-1], 64)
	}
	os.Remove(path1)
	os.Remove(path2)
	return
}

func EnsureExist(path string) (err error) {
	if _, err := os.Stat(path); err != nil {
		return err
	}
	return
}
