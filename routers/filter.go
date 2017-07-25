package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"github.com/lifei6671/mindoc/conf"
	"github.com/lifei6671/mindoc/models"
)

func init()  {
	var FilterUser = func(ctx *context.Context) {
		_, ok := ctx.Input.Session(conf.LoginSessionName).(models.Member)

		if !ok {
			ctx.Redirect(302, beego.URLFor("AccountController.Login"))
		}
	}
	beego.InsertFilter("/manager",beego.BeforeRouter,FilterUser)
	beego.InsertFilter("/manager/*",beego.BeforeRouter,FilterUser)
	beego.InsertFilter("/setting",beego.BeforeRouter,FilterUser)
	beego.InsertFilter("/setting/*",beego.BeforeRouter,FilterUser)
	beego.InsertFilter("/book",beego.BeforeRouter,FilterUser)
	beego.InsertFilter("/book/*",beego.BeforeRouter,FilterUser)
	beego.InsertFilter("/api/*",beego.BeforeRouter,FilterUser)

	var FinishRouter = func(ctx *context.Context) {
		ctx.ResponseWriter.Header().Add("MinDoc-Version",conf.VERSION)
		ctx.ResponseWriter.Header().Add("MinDoc-Site","http://www.iminho.me")
	}

	beego.InsertFilter("/*",beego.BeforeRouter ,FinishRouter, false)
}
