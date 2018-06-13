import { Request, Response, NextFunction } from "express";

import { default as User, UserModel, AuthToken } from "../models/User";
import { WriteError } from "mongodb";
import marked from "marked";
import { ENAMETOOLONG } from "constants";
import { METHODS } from "http";

/**
 * GET /
 * Home page.
 */


export let getPages = (req: Request, res: Response) => {
    const queryId: string = req.query.id;
    if (req.user === undefined || req.user.id === undefined) {
        // 如果用户未登录 那么看到的是Tony的默认博客
        User.findOne({ email: "epsacuil@foxmail.com" }, (err, user: any) => {
            const content = user.content;
            let con: any;
            content.forEach((element: any, i: number) => {
                if (element.id === queryId) {
                    con = element;
                    con.markdown = marked(element.markdown);
                }
            });

            res.render("pages", {
                title: "pages",
                data: con
            });
        });

    } else {
        User.findOne({ email: req.user.email }, (err: any, user: any, next: NextFunction) => {
            const content = user.content;
            let con: any;
            content.forEach((element: any, i: number) => {
                if (element.id === queryId) {
                    con = element;
                    con.markdown = marked(element.markdown);
                    element.totalNum = element.totalNum + 1;
                    user.save();

                }
            });

            res.render("pages", {
                title: "pages",
                data: con
            });
        });
    }
};

export let postPages = (req: Request, res: Response, next: NextFunction) => {
    const queryId: string = req.query.id;
    User.update({ _id: req.user.id }, { $pull: { content: { _id: queryId } } }, (err) => {
        if (err) { return next(err); }
        res.redirect("/");
    });
};