package models

import (
	_ "fmt"
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"time"

	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/lifei6671/mindoc/errs"
)

type Target struct {
	Id        int64     `orm:"column(id);pk"`
	Name      string    `orm:"column(name);size(255)"`
	Created   time.Time `orm:"column(created);type(datetime)"`
	Updated   time.Time `orm:"column(updated);type(datetime)"`
	Identity  string    `orm:"column(identity);size(255)"`
	Url       string    `orm:"column(url);size(255)"`
	Sex       string    `orm:"column(sex);size(255)"`
	Level     int64     `orm:"column(level)"`
	Age       int64     `orm:"column(age)"`
	Nation    string    `orm:"column(nation);size(255)"`
	Host      string    `orm:"column(host);size(255)"`
	Message   string    `orm:"column(message);size(255)"`
	LibraryId int64     `orm:"-"`
	Library   *Library  `orm:"column(library);size(255);rel(fk)"`
}

type ResTarget struct {
	Id       int64     `json:"id"`
	Created  time.Time `json:"created"`
	Updated  time.Time `json:"updated"`
	Name     string    `json:"name"`
	Identity string    `json:"identity"`
	Url      string    `json:"url"`
	Sex      string    `json:"sex"`
	Level    int64     `json:"level"`
	Age      int64     `json:"age"`
	Nation   string    `json:"nation"`
	Host     string    `json:"host"`
	Message  string    `json:"message"`
	Library  string    `json:"library"`
}

func init() {
	orm.RegisterModel(new(Target))
}

func NewTarget() *Target {
	return &Target{}
}

func (t *Target) TableName() string {
	return "targets"
}

// GET
func (t *Target) GetTargetByLib(libId int64) (resTs []ResTarget, err error) {
	o := orm.NewOrm()

	var ts []Target
	resTs = make([]ResTarget, 0)
	if _, err = o.QueryTable(new(Target)).Filter("library", libId).All(&ts); err != nil {
		return
	}

	for _, t := range ts {
		var res ResTarget
		res.Id = t.Id
		res.Name = t.Name
		res.Identity = t.Identity
		res.Url = t.Url
		res.Sex = t.Sex
		res.Level = t.Level
		res.Age = t.Age
		res.Nation = t.Nation
		res.Host = t.Host
		res.Message = t.Message
		if t.Library == nil {
			res.Library = ""
			err = errs.NotInAnyLibrary
			return
		} else {
			if _, err = o.LoadRelated(&t, "Library"); err != nil {
				return
			}
			res.Library = t.Library.Name
		}
		resTs = append(resTs, res)
	}
	return
}

// POST
func AddTarget(name, identity, sex, nation, host, message string, level, age, library int64, file multipart.File) (err error) {
	o := orm.NewOrm()

	defer func() {
		if err != nil {
			logs.Error(err)
		}
	}()

	fileName := identity + strconv.FormatInt(age, 10) + ".jpg"
	path := "/home/targets/" + fileName

	if err = uploadFiles(file, path); err != nil {
		return
	}

	var t Target
	t.Name = name
	t.Created = time.Now()
	t.Updated = time.Now()
	t.Identity = identity
	t.Sex = sex
	t.Url = path
	t.Level = level
	t.Age = age
	t.Nation = nation
	t.Host = host
	t.Message = message

	l, err := GetLibraryById(library)
	if err != nil {
		return
	}
	t.Library = l
	t.Library.Id = library

	if _, err = o.Insert(&t); err != nil {
		return
	}
	return
}

func uploadFiles(file multipart.File, path string) (err error) {
	defer func() {
		if err != nil {
			logs.Error(err)
		}
	}()

	img, err := os.Create(path)
	defer img.Close()
	if err != nil {
		return
	}

	if _, err = io.Copy(img, file); err != nil {
		return
	}
	return
}

// UPDATE
func (t *Target) UpdateTarget() (err error) {

	return
}

// DELETE
func (t *Target) DelTarget() (err error) {

	return
}
