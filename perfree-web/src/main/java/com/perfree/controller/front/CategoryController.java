package com.perfree.controller.front;

import com.perfree.commons.Constants;
import com.perfree.base.BaseController;
import com.perfree.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CategoryController extends BaseController {

    @Autowired
    private ArticleService articleService;

    @RequestMapping("/category/{categoryId}/{pageIndex}")
    public String articleListPage(@PathVariable("pageIndex") int pageIndex, @PathVariable("categoryId") String categoryId, Model model) {
        model.addAttribute("pageIndex", pageIndex);
        model.addAttribute("categoryId", categoryId);
        model.addAttribute("url", Constants.URL_ARTICLE_CATEGORY + categoryId  + "/");
        return view(currentThemePage() + "/articleList.html");
    }

    @RequestMapping("/category/{categoryId}")
    public String articleListPage(@PathVariable("categoryId") String categoryId, Model model) {
        model.addAttribute("pageIndex", 1);
        model.addAttribute("categoryId", categoryId);
        model.addAttribute("url", Constants.URL_ARTICLE_CATEGORY + categoryId  + "/");
        return view(currentThemePage() + "/articleList.html");
    }

    @RequestMapping("/categories")
    public String categories(Model model) {
        model.addAttribute("url", Constants.URL_CATEGORIES);
        return view(currentThemePage() + "/categories.html");
    }

    @RequestMapping("/categories/{pageIndex}")
    public String categoriesPage(@PathVariable("pageIndex") int pageIndex,Model model) {
        model.addAttribute("url", Constants.URL_CATEGORIES);
        model.addAttribute("pageIndex", pageIndex);
        return view(currentThemePage() + "/categories.html");
    }
}
