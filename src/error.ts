import { Request, Response, NextFunction } from "express";
// import error from "http-errors";
/**
 * GET /
 * Home page.
 */
export let error = (err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", {
        errorMsg: res.locals.message,
        status: err.status,
        title: "ERROR " + err.status
    });
};