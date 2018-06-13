import { Request, Response } from "express";

import { default as User, UserModel, AuthToken } from "../models/User";
import { WriteError } from "mongodb";
/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  if (req.user === undefined || req.user.id === undefined) {
    // 如果用户未登录 那么看到的是Tony的默认博客
    User.findOne({ email: "epsacuil@foxmail.com" }, (err, user: any) => {
      res.render("home", {
        title: "Home",
        data: user.content
      });
    });

  } else {

    User.findById(req.user.id, (err, user: any) => {
      res.render("home", {
        title: "Home",
        data: user.content
      });
    });

  }


};
