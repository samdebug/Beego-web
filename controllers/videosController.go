package controllers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"strconv"

	"github.com/astaxie/beego/logs"
	"github.com/lifei6671/mindoc/models"
)

// Operations about Videos
type VideosController struct {
	ManagerController
}

// URLMapping ...
func (v *VideosController) URLMapping() {
	v.Mapping("GetAll", v.Videos)
	v.Mapping("Post", v.AddVideo)
	v.Mapping("Post", v.UpdateVideo)
	v.Mapping("Post", v.DelVideo)
}

// @Title GetAll
// @Description get all videos
// @Success 200 {object} models.Video
// @router / [get]
func (v *VideosController) Videos() {
	v.Prepare()
	v.TplName = "manager/videos.tpl"

	videos, err := models.GetAllVideos()

	b, err := json.Marshal(videos)

	if err != nil {
		v.Data["Results"] = template.JS("[]")
	} else {
		v.Data["Results"] = template.JS(string(b))
	}
	v.Data["Videos"] = videos
}

// @Title Create
// @Description create video
// @Param	body		body 	models.Video	true		"The object content"
// @Success 200 {string} models.Video.Id
// @Failure 403 body is empty
// @router / [post]
func (v *VideosController) AddVideo() {
	name := v.GetString("name")
	url := v.GetString("url")
	roleId, _ := v.GetInt64("role")
	message := v.GetString("description")

	video := models.NewVideo()

	video.Name = name
	video.Url = url
	video.RoleId = roleId
	video.Message = message
	if err := video.AddVideo(); err != nil {
		v.JsonResult(6006, err.Error())
	}

	v.JsonResult(0, "ok", video)
}

// @Title Update
// @Description update the video
// @Param	name		path 	string	true		"The name you want to update"
// @Param	role		path 	string	true		"The role you want to update"
// @Param	message		path 	string	true		"The message you want to update"
// @Success 200 {object} models.UpdateLib
// @Failure 403 :objectId is empty
// @router /:id [put]
func (v *VideosController) UpdateVideo() {
	v.Prepare()
	v.TplName = "manager/edit_videos.tpl"

	id, err := v.GetInt64(":id", 0)

	if id <= 0 || err != nil {
		v.Abort("404")
	}

	video, err := models.NewVideo().CheckVideoById(id)

	if v.Ctx.Input.IsPost() {
		video.Name = v.GetString("name")
		video.RoleId, _ = v.GetInt64("role")
		video.Message = v.GetString("description")

		if err = video.UpdateVideo(); err != nil {
			logs.Error(err)
			v.JsonResult(6004, "保存失败")
		}

		v.JsonResult(0, "ok")
	}
	v.Data["Video"] = video
}

// @Title Delete
// @Description delete the video
// @Param	video		path 	string	true		"The video id you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 Id is empty
// @router /:id [delete]
func (v *VideosController) DelVideo() {
	idStr := v.GetString("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return
	}

	fmt.Println(id)
	err = models.DelVideo(id)
	if err != nil {
		logs.Error("删除目标 => ", err)
		v.JsonResult(6003, "删除失败")
	}
	v.JsonResult(0, "ok")
}
