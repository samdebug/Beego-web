package models

import (
	_ "fmt"
	"time"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lifei6671/mindoc/errs"
)

type Camera struct {
	Id      int64     `orm:"column(id);pk"                           json:"id"`
	Name    string    `orm:"column(name);size(255)"                  json:"name"`
	Created time.Time `orm:"column(created);type(datetime)"          json:"created"`
	Updated time.Time `orm:"column(updated);type(datetime)"          json:"updated"`
	Role    string    `orm:"column(role);size(255)"                  json:"role"`
	RoleId  int64     `orm:"-"                                       json:"roleid"`
	Url     string    `orm:"column(url);size(255)"                   json:"url"`
	Message string    `orm:"column(message);size(255)"               json:"message"`
}

func init() {
	orm.RegisterModel(new(Camera))
}

func NewVideo() *Camera {
	return &Camera{}
}

func (c *Camera) TableName() string {
	return "cameras"
}

// GET
func GetAllVideos() (videos []Camera, err error) {
	o := orm.NewOrm()

	videos = make([]Camera, 0)
	if _, err = o.QueryTable(new(Camera)).All(&videos); err != nil {
		return
	}

	return
}

// POST
func (c *Camera) AddVideo() (err error) {
	o := orm.NewOrm()

	c.Created = time.Now()
	c.Updated = time.Now()
	c.ResolveRoleName()
	if _, err = o.Insert(c); err != nil {
		return
	}
	return
}

// UPDATE
func (c *Camera) UpdateVideo() (err error) {
	o := orm.NewOrm()

	c.Updated = time.Now()
	c.ResolveRoleName()
	if _, err = o.Update(c); err != nil {
		logs.Error(err)
		return
	}
	return
}

// DELETE
func DelVideo(id int64) (err error) {
	o := orm.NewOrm()

	if err = checkVideoById(id); err == nil {
		if _, err = o.Raw("delete from cameras where id= ?", id).Exec(); err != nil {
			logs.Error(err)
			return
		}
	}
	return
}

func (c *Camera) CheckVideoById(id int64) (*Camera, error) {
	o := orm.NewOrm()

	c.Id = id
	if err := o.Read(c); err != nil {
		return c, err
	}
	c.ResolveRoleName()
	return c, nil
}

func (c *Camera) ResolveRoleName() {
	if c.RoleId == 1 {
		c.Role = "直连"
	} else if c.RoleId == 2 {
		c.Role = "转码"
	} else if c.RoleId == 3 {
		c.Role = "罪犯"
	}

}
func checkVideoById(id int64) (err error) {
	o := orm.NewOrm()

	num, err := o.Raw("select * from cameras where id = ?", id).QueryRows(&[]Camera{})
	if err != nil {
		return
	} else if num == 0 {
		return errs.VideoNotFound
	}
	return
}

func GetVideoById(id int64) (c *Camera, err error) {
	o := orm.NewOrm()

	if err = o.Raw("select * from ipc where id = ?", id).QueryRow(&c); err != nil {
		return
	}
	return
}
