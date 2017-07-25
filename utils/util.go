package utils

import (
	"bytes"
	"fmt"
	"github.com/astaxie/beego/logs"
	"os"
	"os/exec"
	"regexp"
	"runtime"
)

func Urandom() string {
	f, _ := os.OpenFile("/dev/urandom", os.O_RDONLY, 0)
	b := make([]byte, 16)
	f.Read(b)
	f.Close()
	uuid := fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
	return uuid
}

//logs
func AddLog(err interface{}, v ...interface{}) {
	if _, ok := err.(error); ok {
		pc, _, line, _ := runtime.Caller(1)
		logs.Error("[Server] ", runtime.FuncForPC(pc).Name(), line, v, err)
	} else {
		logs.Info("[Server] ", err)
	}
}

func JudgeIp(ip string) (err error) {
	if m, _ := regexp.MatchString("^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$", ip); !m {
		err = fmt.Errorf("not validate IP address")
		AddLog(err)
		return
	}
	return
}

// Cmd
func Execute(name string, cmdArgs []string, logging bool) (output string, err error) {
	if logging {
		AddLog(cmdArgs)
	}
	cmd := exec.Command(name, cmdArgs...)

	// Stdout buffer
	w := &bytes.Buffer{}
	// Attach buffer to command
	cmd.Stderr = w
	cmd.Stdout = w
	// Execute command
	err = cmd.Run() // will wait for command to return

	return string(w.Bytes()), nil
}

// Cmd
func ExecuteByStr(cmdArgs string, logging bool) (output string, err error) {
	if logging {
		AddLog(cmdArgs)
	}
	cmd := exec.Command("/bin/sh", "-c", cmdArgs)

	// Stdout buffer
	w := &bytes.Buffer{}
	// Attach buffer to command
	cmd.Stderr = w
	cmd.Stdout = w
	// Execute command
	err = cmd.Run() // will wait for command to return
	if err != nil && logging {
		AddLog(err)
		return
	} else if err != nil && !logging {
		return
	}

	return string(w.Bytes()), nil
}
