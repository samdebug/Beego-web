package controllers

import (
	_"encoding/json"
	_ "fmt"
	_"html/template"
	_"strconv"
	"strings"

	_"github.com/astaxie/beego/logs"
	"github.com/lifei6671/mindoc/models"
)

// Operations about Uploads
type UploadController struct {
	ManagerController
}

// URLMapping ...
func (l *UploadController) URLMapping() {
	l.Mapping("Post", l.Uploading)
}

// @Title Create
// @Description create library
// @Param	body		body 	models.Library	true		"The object content"
// @Success 200 {string} models.Library.Id
// @Failure 403 body is empty
// @router / [post]
func (l *UploadController) Uploading() {
	name := strings.TrimSpace(l.GetString("name"))
	role, _ := l.GetInt64("role")
	message := strings.TrimSpace(l.GetString("description"))

	library := models.NewLibrary()

	if err := library.CheckLibraryByName(name); err != nil {
		l.JsonResult(6006, err.Error())
	}

	if role != 0 && role != 1 && role != 2 {
		role = 1
	}

	if len(message) > 100 {
		l.JsonResult(6006, "备注超过100字")
	}

	library.Name = name
	library.RoleId = role
	library.Message = message

	if err := library.AddLibrary(); err != nil {
		l.JsonResult(6006, err.Error())
	}

	l.JsonResult(0, "ok", "haha")
}
