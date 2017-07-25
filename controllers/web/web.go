package web

import (
	"github.com/astaxie/beego/logs"
)

func NewResponse(detail interface{}, err error) map[string]interface{} {
	o := make(map[string]interface{})
	if err == nil {
		o["status"] = "success"
		if detail != nil {
			o["detail"] = detail
		}
	} else {
		o["status"] = "error"
		o["errcode"] = 1
		o["description"] = err.Error()
		logs.Error(err)
	}
	return o
}
