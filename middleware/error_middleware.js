
export const globalError =  (err, req, res, next) => {
    err.statusCode = err.statusCode ||500;
    err.status = err.status || "error"
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        msg: err.message,
        stack: err.stack
    });
}