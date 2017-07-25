package controllers

import (
	"encoding/json"
	"fmt"
	"html/template"

	"github.com/lifei6671/mindoc/models"
)

// Operations about Targets
type TargetController struct {
	ManagerController
}

// URLMapping ...
func (t *TargetController) URLMapping() {
	t.Mapping("GetAll", t.Targets)
	t.Mapping("Post", t.AddTarget)
	t.Mapping("Post", t.UpdateTarget)
	t.Mapping("Post", t.DelTarget)
}

// @Title GetAll
// @Description get all Targets
// @Success 200 {object} models.Target
// @router / [get]
func (t *TargetController) Targets() {
	t.Prepare()
	t.TplName = "manager/targets.tpl"

	libId, err := t.GetInt64(":lib")
	lib, _ := models.NewLibrary().CheckLibraryById(libId)

	targets, err := models.NewTarget().GetTargetByLib(libId)
	fmt.Printf("%+v", targets)
	b, err := json.Marshal(targets)

	if err != nil {
		t.Data["Results"] = template.JS("[]")
	} else {
		t.Data["Results"] = template.JS(string(b))
	}

	t.Data["Targets"] = targets
	t.Data["Lib"] = lib
}

// @Title CreateTarget
// @Description create target
// @Param	body		body 	models.Target	true		"body for target content"
// @Success 200 {int} models.Target.Id
// @Failure 403 body is empty
// @router / [post]
func (t *TargetController) AddTarget() {
	target := models.NewTarget()

	target.Name = t.GetString("name")
	target.Identity = t.GetString("identity")
	target.Sex = t.GetString("sex")
	target.Nation = t.GetString("nation")
	target.Host = t.GetString("host")
	target.Message = t.GetString("description")
	target.LibraryId, _ = t.GetInt64("library")
	target.Level, _ = t.GetInt64("level")
	target.Age, _ = t.GetInt64("age")
	//file, _, _ := t.GetFile("file")
	fmt.Printf("%+v", target)
	t.JsonResult(0, "ok", target)
}

// @Title Update
// @Description update the target
// @Param	uid		path 	string	true		"The id you want to update"
// @Param	body		body 	models.Target	true		"body for target content"
// @Success 200 {object} models.Target
// @Failure 403 :id is not int
// @router /:id [post]
func (t *TargetController) UpdateTarget() {
}

// @Title Delete
// @Description delete the target
// @Param	id		path 	string	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 id is empty
// @router /:id [post]
func (t *TargetController) DelTarget() {
}
