package models

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type Picture struct {
	Id      int64     `orm:"column(id);pk"                           json:"id"`
	Created time.Time `orm:"column(created);type(datetime)"          json:"created"`
	Updated time.Time `orm:"column(updated);type(datetime)"          json:"updated"`
	Url     string    `orm:"column(url);size(255)"                   json:"url"`
	Feature string    `orm:"column(feature);size(255)"               json:"feature"`
	Library *Library  `orm:"column(library);size(255);rel(fk)"       json:"-"`
	Target  *Target   `orm:"column(target);size(255);rel(fk)"        json:"-"`
}

func init() {
	orm.RegisterModel(new(Picture))
}

func NewPicture() *Picture {
	return &Picture{}
}

func (l *Picture) TableName() string {
	return "pictures"
}
