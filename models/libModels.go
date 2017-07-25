package models

import (
	"errors"
	_ "fmt"
	"time"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lifei6671/mindoc/errs"
)

type Library struct {
	Id          int64      `orm:"column(id);pk"                           json:"id"`
	Name        string     `orm:"column(name);size(255);unique"           json:"name"`
	Created     time.Time  `orm:"column(created);type(datetime)"          json:"created"`
	Updated     time.Time  `orm:"column(updated);type(datetime)"          json:"updated"`
	Role        string     `orm:"column(role);size(255)"                  json:"role"`
	Message     string     `orm:"column(message);size(255)"               json:"message"`
	RoleId      int64      `orm:"-"                                       json:"role"`
	TargetCount int        `orm:"-"                                       json:"aim_count"`
	PicCount    int        `orm:"-"                                       json:"pic_count"`
	User        string     `orm:"-"                                       json:"user"`
	Targets     []*Target  `orm:"column(Id);reverse(many)"                json:"-"`
	Pics        []*Picture `orm:"column(Id);reverse(many)"                json:"-"`
}

type ResLibrary struct {
	Id       int64     `json:"id"`
	Name     string    `json:"name"`
	Role     string    `json:"role"`
	AimCount int       `json:"aim_count"`
	PicCount int       `json:"pic_count"`
	User     string    `json:"user"`
	Message  string    `json:"message"`
	Created  time.Time `json:"created"`
	Updated  time.Time `json:"updated"`
}

func init() {
	orm.RegisterModel(new(Library))
}

func NewLibrary() *Library {
	return &Library{}
}

func (l *Library) TableName() string {
	return "librarys"
}

// GET
func GetAllLibrarys() (libs []Library, err error) {
	o := orm.NewOrm()

	defer func() {
		if err != nil {
			logs.Error(err)
			return
		}
	}()

	libs = make([]Library, 0)
	if _, err = o.QueryTable(new(Library)).All(&libs); err != nil {
		return
	}

	for i, lib := range libs {
		if _, err = o.LoadRelated(&lib, "Targets"); err != nil {
			return
		}
		lib.TargetCount = len(lib.Targets)
		if _, err = o.LoadRelated(&lib, "Pics"); err != nil {
			return
		}
		lib.PicCount = len(lib.Pics)
		lib.User = "admin"
		lib.Created = lib.Created
		lib.Updated = lib.Updated
		libs[i] = lib
	}

	return
}

// POST
func (l *Library) AddLibrary() (err error) {
	o := orm.NewOrm()

	l.Created = time.Now()
	l.Updated = time.Now()
	l.ResolveRoleName()
	if _, err = o.Insert(l); err != nil {
		return
	}
	return
}

// UPDATE
func (l *Library) UpdateLibrary() (err error) {
	o := orm.NewOrm()

	l.Updated = time.Now()
	l.ResolveRoleName()
	if _, err = o.Update(l); err != nil {
		logs.Error(err)
		return
	}
	return
}

// DELETE
func (l *Library) DelLibrary() (err error) {
	o := orm.NewOrm()

	if err = checkLibraryById(l.Id); err == nil {
		if _, err = o.Raw("delete from librarys where id= ?", l.Id).Exec(); err != nil {
			logs.Error(err)
			return
		}
	}
	return
}

func (l *Library) CheckLibraryById(id int64) (*Library, error) {
	o := orm.NewOrm()

	l.Id = id
	if err := o.Read(l); err != nil {
		return l, err
	}
	l.ResolveRoleName()
	return l, nil
}

func (l *Library) CheckLibraryByName(name string) (err error) {
	o := orm.NewOrm()

	if exist := o.QueryTable(new(Library)).Filter("name", name).Exist(); exist {
		return errors.New("目标库名字重复")
	}
	return nil
}

func (l *Library) ResolveRoleName() {
	if l.RoleId == 1 {
		l.Role = "普通"
	} else if l.RoleId == 2 {
		l.Role = "黑名单"
	} else if l.RoleId == 3 {
		l.Role = "罪犯"
	}

}
func checkLibraryById(id int64) (err error) {
	o := orm.NewOrm()

	num, err := o.Raw("select * from librarys where id = ?", id).QueryRows(&[]Library{})
	if err != nil {
		return
	} else if num == 0 {
		return errs.LibraryNotFound
	}
	return
}

func GetLibraryById(id int64) (l *Library, err error) {
	o := orm.NewOrm()

	if err = o.Raw("select * from librarys where id = ?", id).QueryRow(&l); err != nil {
		return
	}
	return
}
