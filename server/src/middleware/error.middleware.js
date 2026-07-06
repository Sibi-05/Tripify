export const notFound = (req,res,next)=>{
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

export const errorHandler = (error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    error.status(error.code || 500).json({message:error.message ||'unknown error'})
}
