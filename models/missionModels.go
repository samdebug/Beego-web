package models

import (
	_ "fmt"
	"time"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lifei6671/mindoc/errs"
)

type Mission struct {
	Id      int64     `orm:"column(id);pk"                           json:"id"`
	Name    string    `orm:"column(name);size(255)"                  json:"name"`
	Created time.Time `orm:"column(created);type(datetime)"          json:"created"`
	Updated time.Time `orm:"column(updated);type(datetime)"          json:"updated"`
	Role    string    `orm:"column(role);size(255)"                  json:"role"`
	RoleId  int       `orm:"-"                                       json:"role"`
	Message string    `orm:"column(message);size(255)"               json:"message"`
	Library *Library  `orm:"column(library);size(255);rel(fk)"`
}

type ResMission struct {
	Id      int64     `orm:"column(id);pk"                           json:"id"`
	Name    string    `orm:"column(name);size(255)"                  json:"name"`
	Created time.Time `orm:"column(created);type(datetime)"          json:"created"`
	Updated time.Time `orm:"column(updated);type(datetime)"          json:"updated"`
	Role    string    `orm:"column(role);size(255)"                  json:"role"`
	RoleId  int       `orm:"-"                                       json:"role"`
	Message string    `orm:"column(message);size(255)"               json:"message"`
	Library *Library  `orm:"column(library);size(255);rel(fk)"`
}

func init() {
	orm.RegisterModel(new(Mission))
}

func NewMission() *Mission {
	return &Mission{}
}

func (m *Mission) TableName() string {
	return "missions"
}

// GET
func GetAllMissions() (resLibs []ResMission, err error) {
	o := orm.NewOrm()

	defer func() {
		if err != nil {
			logs.Error(err)
			return
		}
	}()

	libs := make([]Mission, 0)
	resLibs = make([]ResMission, 0)
	if _, err = o.QueryTable(new(Mission)).All(&libs); err != nil {
		return
	}

	for _, lib := range libs {
		var res ResMission
		res.Id = lib.Id
		res.Name = lib.Name
		res.Role = lib.Role
		res.Created = lib.Created
		res.Updated = lib.Updated
		if _, err = o.LoadRelated(&lib, "Pics"); err != nil {
			return
		}
		resLibs = append(resLibs, res)
	}

	return
}

// POST
func (m *Mission) AddMission() (err error) {
	o := orm.NewOrm()

	m.Created = time.Now()
	m.Updated = time.Now()
	m.ResolveRoleName()
	if _, err = o.Insert(m); err != nil {
		return
	}
	return
}

// UPDATE
func (m *Mission) UpdateMission() (err error) {
	o := orm.NewOrm()

	m.Updated = time.Now()
	m.ResolveRoleName()
	if _, err = o.Update(m); err != nil {
		logs.Error(err)
		return
	}
	return
}

// DELETE
func DelMission(id int64) (err error) {
	o := orm.NewOrm()

	if err = checkMissionById(id); err == nil {
		if _, err = o.Raw("delete from librarys where id= ?", id).Exec(); err != nil {
			logs.Error(err)
			return
		}
	}
	return
}

func (m *Mission) CheckMissionById(id int64) (*Mission, error) {
	o := orm.NewOrm()

	m.Id = id
	if err := o.Read(m); err != nil {
		return m, err
	}
	m.ResolveRoleName()
	return m, nil
}

func (m *Mission) ResolveRoleName() {
	if m.RoleId == 1 {
		m.Role = "普通"
	} else if m.RoleId == 2 {
		m.Role = "黑名单"
	} else if m.RoleId == 3 {
		m.Role = "罪犯"
	}

}
func checkMissionById(id int64) (err error) {
	o := orm.NewOrm()

	num, err := o.Raw("select * from librarys where id = ?", id).QueryRows(&[]Mission{})
	if err != nil {
		return
	} else if num == 0 {
		return errs.MissionNotFound
	}
	return
}

func GetMissionById(id int64) (m *Mission, err error) {
	o := orm.NewOrm()

	if err = o.Raw("select * from librarys where id = ?", id).QueryRow(&m); err != nil {
		return
	}
	return
}
