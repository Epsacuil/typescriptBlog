import { Request, Response, NextFunction } from "express";
import { default as User, UserModel, AuthToken } from "../models/User";
import { WriteError } from "mongodb";
import dateformat from "dateformat";


/**
 * GET /contact
 * Contact form page.
 */
export let getContact = (req: Request, res: Response) => {
  if (!req.user) {
    req.flash("success", { msg: "请先登录！" });
    return res.redirect("/");
  }
  res.render("contact", {
    title: "Contact"
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
export let postContact = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    req.flash("success", { msg: "请先登录！" });
    return res.redirect("/");
  }

  req.assert("title", "标题不能为空").notEmpty();
  req.assert("subtitle", "副标题不能为空").notEmpty();
  req.assert("markdown", "文本不能为空").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/contact");
  }
  User.findById(req.user.id, (err, user: any) => {
    if (err) {
      return next(err);
    }
    const list = {
      title: req.body.title,
      subtitle: req.body.title,
      markdown: req.body.markdown,
      date: dateformat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      totalNum: 0
    };

    User.update({ _id: req.user.id }, { $push: { content: list } }, (err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
          return res.redirect("/account");
        }
        return next(err);
      }
      req.flash("success", { msg: "文档已保存." });
      res.redirect("/contact");
    });

  });
};