package com.perfree.controller;

import com.perfree.common.Constants;
import com.perfree.common.ResponseBean;
import com.perfree.controller.admin.ArticleController;
import com.perfree.model.Menu;
import com.perfree.model.User;
import com.perfree.service.OptionService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.UUID;

/**
 * 控制首页地址
 */
@Controller
public class SystemController extends BaseController{
    private final Logger logger = LoggerFactory.getLogger(SystemController.class);
    /**
     * 后台首页
     * @return String
     */
    @RequestMapping("/admin")
    public String adminIndex(Model model) {
        List<Menu> menus = getAdminMenuByUserId();
        model.addAttribute("menus", menus);
        model.addAttribute("user", getUser());
        return "admin/pages/index";
    }

    /**
     * 前台首页
     * @return String
     */
    @RequestMapping("/")
    public String index() {

        return "themes/" + currentTheme() + "/index";
    }

    /**
     * 登陆页
     * @return String
     */
    @RequestMapping("/login")
    public String login() {
        return "public/login";
    }

    /**
     * 登录
     * @return ResponseBean
     */
    @RequestMapping(method = RequestMethod.POST, path = "/doLogin")
    @ResponseBody
    public ResponseBean doLogin(User user,Boolean rememberMe, HttpSession session) {
        ResponseBean responseBean;
        if(rememberMe == null) {
            rememberMe = false;
        }
        try {
            UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(user.getAccount(),user.getPassword(),rememberMe);
            Subject subject = SecurityUtils.getSubject();
            subject.login(usernamePasswordToken);
            responseBean = new ResponseBean(ResponseBean.SUCCESS_CODE, "登录成功", null);
        }catch (IncorrectCredentialsException e) {
            responseBean = new ResponseBean(ResponseBean.ERROR_CODE, "密码错误", e.getMessage());
        }catch (UnknownAccountException e) {
            responseBean = new ResponseBean(ResponseBean.ERROR_CODE, "账户不存在", e.getMessage());
        }catch (Exception e) {
            responseBean = new ResponseBean(ResponseBean.ERROR_CODE, "系统异常", e.getMessage());
        }
        return responseBean;
    }

    /**
     * 登录
     * @return ResponseBean
     */
    @RequestMapping(method = RequestMethod.POST, path = "/logout")
    @ResponseBody
    public ResponseBean logout() {
        try {
            Subject subject = SecurityUtils.getSubject();
            subject.logout();
            return ResponseBean.success("退出登录成功", null);
        }catch (Exception e) {
            logger.error("退出登录失败,{}", e.getMessage());
            return ResponseBean.fail("退出登录失败", e.getMessage());
        }
    }

    public static void main(String args[]){
        String uuid = UUID.randomUUID().toString().replaceAll("-","");
        System.out.println(uuid);
        String md5Hash = new Md5Hash("111111", uuid).toString();
        System.out.println(md5Hash);
    }
}
