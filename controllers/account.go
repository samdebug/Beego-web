package controllers

import (
	"time"
	"strings"
	"regexp"

	"net/smtp"
	"github.com/lifei6671/mindoc/conf"
	"github.com/lifei6671/mindoc/models"
	"github.com/lifei6671/mindoc/utils"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/lifei6671/gocaptcha"
	"strconv"
)

// AccountController 用户登录与注册.
type AccountController struct {
	BaseController
}

// Login 用户登录.
func (c *AccountController) Login()  {
	c.Prepare()
	c.TplName = "account/login.tpl"

	var remember struct { MemberId int ; Account string; Time time.Time}

	//如果Cookie中存在登录信息
	if cookie,ok := c.GetSecureCookie(conf.GetAppKey(),"login");ok{

		if err := utils.Decode(cookie,&remember); err == nil {
			if member,err := models.NewMember().Find(remember.MemberId); err == nil {
				c.SetMember(*member)

				c.Redirect(beego.URLFor("HomeController.Index"), 302)
				c.StopRun()
			}
		}
	}

	if c.Ctx.Input.IsPost() {
		account := c.GetString("account")
		password := c.GetString("password")
		captcha := c.GetString("code")
		is_remember := c.GetString("is_remember")

		//如果开启了验证码
		if v,ok := c.Option["ENABLED_CAPTCHA"]; ok && strings.EqualFold(v,"true") {
			v,ok := c.GetSession(conf.CaptchaSessionName).(string);
			if !ok || !strings.EqualFold(v,captcha){
				c.JsonResult(6001,"验证码不正确")
			}
		}
		member,err := models.NewMember().Login(account,password)

		//如果没有数据
		if err == nil {
			member.LastLoginTime = time.Now()
			member.Update()

			c.SetMember(*member)
			if strings.EqualFold(is_remember,"yes") {
				remember.MemberId = member.MemberId
				remember.Account = member.Account
				remember.Time = time.Now()
				v ,err := utils.Encode(remember)
				if err == nil {
					c.SetSecureCookie(conf.GetAppKey(),"login",v)
				}

			}

			c.JsonResult(0,"ok")
		}else{
			logs.Error("用户登录 =>",err)
			c.JsonResult(500,"账号或密码错误",nil)
		}

		return
	}
}

//用户注册.
func (c *AccountController) Register()  {
	c.TplName = "account/register.tpl"

	//如果没有开启用户注册
	if v,ok := c.Option["ENABLED_REGISTER"]; ok && !strings.EqualFold(v,"true") {
		c.Abort("404")
	}

	if c.Ctx.Input.IsPost() {
		account := c.GetString("account")
		password1 := c.GetString("password1")
		password2 := c.GetString("password2")
		email := c.GetString("email")
		captcha := c.GetString("code")

		if ok,err := regexp.MatchString(conf.RegexpAccount,account); account == "" || !ok || err != nil {
			c.JsonResult(6001,"账号只能由英文字母数字组成，且在3-50个字符")
		}
		if  l := strings.Count(password1,"") ; password1 == "" || l > 50 || l < 6{
			c.JsonResult(6002,"密码必须在6-50个字符之间")
		}
		if password1 != password2 {
			c.JsonResult(6003,"确认密码不正确")
		}
		if  ok,err := regexp.MatchString(conf.RegexpEmail,email); !ok || err != nil || email == "" {
			c.JsonResult(6004,"邮箱格式不正确")
		}
		//如果开启了验证码
		if v,ok := c.Option["ENABLED_CAPTCHA"]; ok && strings.EqualFold(v,"true") {
			v,ok := c.GetSession(conf.CaptchaSessionName).(string);
			if !ok || !strings.EqualFold(v,captcha){
				c.JsonResult(6001,"验证码不正确")
			}
		}

		member := models.NewMember()

		if _,err := member.FindByAccount(account); err == nil && member.MemberId > 0 {
			c.JsonResult(6005,"账号已存在")
		}

		member.Account = account
		member.Password = password1
		member.Role = conf.MemberGeneralRole
		member.Avatar = conf.GetDefaultAvatar()
		member.CreateAt = 0
		member.Email = email
		member.Status = 0
		if err := member.Add(); err != nil {
			beego.Error(err)
			c.JsonResult(6006,"注册失败，请联系系统管理员处理")
		}

		c.JsonResult(0,"ok",member)
	}
}

//找回密码.
func (c *AccountController) FindPassword()  {
	c.TplName = "account/find_password_setp1.tpl"
	mail_conf := conf.GetMailConfig()

	if c.Ctx.Input.IsPost() {

		email := c.GetString("email")
		captcha := c.GetString("code")

		if email == "" {
			c.JsonResult(6005,"邮箱地址不能为空")
		}
		if !mail_conf.EnableMail {
			c.JsonResult(6004,"未启用邮件服务")
		}

		//如果开启了验证码
		if v,ok := c.Option["ENABLED_CAPTCHA"]; ok && strings.EqualFold(v,"true") {
			v,ok := c.GetSession(conf.CaptchaSessionName).(string);
			if !ok || !strings.EqualFold(v,captcha){
				c.JsonResult(6001,"验证码不正确")
			}
		}

		member ,err := models.NewMember().FindByFieldFirst("email",email)
		if err != nil {
			c.JsonResult(6006,"邮箱不存在")
		}
		if member.Status != 0 {
			c.JsonResult(6007,"账号已被禁用")
		}
		if member.AuthMethod == conf.AuthMethodLDAP {
			c.JsonResult(6011,"当前用户不支持找回密码")
		}

		count,err := models.NewMemberToken().FindSendCount(email,time.Now().Add(-1*time.Hour),time.Now())

		if err != nil {
			beego.Error(err)
			c.JsonResult(6008,"发送邮件失败")
		}
		if count > mail_conf.MailNumber {
			c.JsonResult(6008,"发送次数太多，请稍候再试")
		}

		member_token := models.NewMemberToken()

		member_token.Token = string(utils.Krand(32,utils.KC_RAND_KIND_ALL))
		member_token.Email = email
		member_token.MemberId = member.MemberId
		member_token.IsValid = false
		if _,err := member_token.InsertOrUpdate(); err != nil {
			c.JsonResult(6009,"邮件发送失败")
		}

		data := map[string]interface{}{
			"SITE_NAME" : c.Option["SITE_NAME"],
			"url" : c.BaseUrl() + beego.URLFor("AccountController.FindPassword", "token",member_token.Token,"mail",email),
		}

		body,err := c.ExecuteViewPathTemplate("account/mail_template.tpl",data)
		if err != nil {
			beego.Error(err)
			c.JsonResult(6003,"邮件发送失败")
		}

		go func(mail_conf *conf.SmtpConf,email string,body string) {
			auth := smtp.PlainAuth(
				"",
				mail_conf.SmtpUserName,
				mail_conf.SmtpPassword,
				mail_conf.SmtpHost,
			)

			mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n";
			subject := "Subject: 找回密码!\n"

			err = smtp.SendMail(
				mail_conf.SmtpHost + ":" + strconv.Itoa(mail_conf.SmtpPort),
				auth,
				mail_conf.FormUserName,
				[]string{ email },
				[]byte(subject + mime +"\n" +body),
			)
			if err != nil {
				beego.Error("邮件发送失败 => ",email,err)
			}
		}(mail_conf,email,body)


		c.JsonResult(0,"ok", c.BaseUrl() + beego.URLFor("AccountController.Login"))
	}

	token := c.GetString("token")
	mail := c.GetString("mail")

	if token != "" && mail != "" {
		member_token,err := models.NewMemberToken().FindByFieldFirst("token",token)

		if err != nil {
			beego.Error(err)
			c.Data["ErrorMessage"] = "邮件已失效"
			c.TplName = "errors/error.tpl"
			return
		}
		sub_time := member_token.SendTime.Sub(time.Now())

		if !strings.EqualFold(member_token.Email,mail) || sub_time.Minutes() > float64(mail_conf.MailExpired) || !member_token.ValidTime.IsZero() {
			c.Data["ErrorMessage"] = "验证码已过期，请重新操作。"
			c.TplName = "errors/error.tpl"
			return
		}
		c.Data["Email"] = member_token.Email
		c.Data["Token"] = member_token.Token
		c.TplName = "account/find_password_setp2.tpl"

	}
}

//校验邮件并修改密码.
func (c *AccountController) ValidEmail() {
	c.Prepare()
	password1 := c.GetString("password1")
	password2 := c.GetString("password2")
	captcha := c.GetString("code")
	token := c.GetString("token")
	mail := c.GetString("mail")

	if password1 == "" {
		c.JsonResult(6001,"密码不能为空")
	}
	if l :=  strings.Count(password1,""); l <6 || l > 50{
		c.JsonResult(6001,"密码不能为空且必须在6-50个字符之间")
	}
	if password2 == ""{
		c.JsonResult(6002,"确认密码不能为空")
	}
	if password1 != password2 {
		c.JsonResult(6003,"确认密码输入不正确")
	}
	if captcha == "" {
		c.JsonResult(6004,"验证码不能为空")
	}
	v,ok := c.GetSession(conf.CaptchaSessionName).(string);
	if !ok || !strings.EqualFold(v,captcha){
		c.JsonResult(6001,"验证码不正确")
	}

	mail_conf := conf.GetMailConfig()
	member_token,err := models.NewMemberToken().FindByFieldFirst("token",token)

	if err != nil {
		beego.Error(err)
		c.JsonResult(6007,"邮件已失效")
	}
	sub_time := member_token.SendTime.Sub(time.Now())

	if !strings.EqualFold(member_token.Email,mail) || sub_time.Minutes() > float64(mail_conf.MailExpired) || !member_token.ValidTime.IsZero() {

		c.JsonResult(6008,"验证码已过期，请重新操作。")
	}
	member ,err := models.NewMember().Find(member_token.MemberId)
	if err != nil{
		beego.Error(err)
		c.JsonResult(6005,"用户不存在")
	}
	hash ,err := utils.PasswordHash(password1);

	if  err != nil {
		beego.Error(err)
		c.JsonResult(6006,"保存密码失败")
	}

	member.Password = hash

	err = member.Update("password")
	member_token.ValidTime = time.Now()
	member_token.IsValid = true
	member_token.InsertOrUpdate()

	if  err != nil {
		beego.Error(err)
		c.JsonResult(6006,"保存密码失败")
	}
	c.JsonResult(0,"ok",c.BaseUrl() + beego.URLFor("AccountController.Login"))
}


// Logout 退出登录.
func (c *AccountController) Logout(){
	c.SetMember(models.Member{});

	c.SetSecureCookie(conf.GetAppKey(),"login","",-3600)
	
	c.Redirect(beego.URLFor("AccountController.Login"),302)
}

//验证码.
func (c *AccountController) Captcha()  {
	c.Prepare()

	captchaImage, err := gocaptcha.NewCaptchaImage(140, 40, gocaptcha.RandLightColor())

	if err != nil {
		beego.Error(err)
		c.Abort("500")
	}

	captchaImage.DrawNoise(gocaptcha.CaptchaComplexLower)

	//captchaImage.DrawTextNoise(gocaptcha.CaptchaComplexHigh)
	txt := gocaptcha.RandText(4)

	c.SetSession(conf.CaptchaSessionName,txt)

	captchaImage.DrawText(txt)
	//captchaImage.Drawline(3);
	captchaImage.DrawBorder(gocaptcha.ColorToRGB(0x17A7A7A))
	//captchaImage.DrawHollowLine()


	captchaImage.SaveImage(c.Ctx.ResponseWriter, gocaptcha.ImageFormatJpeg)
	c.StopRun()
}