const asnynchandler=(requesthandler)=>{
    return (req,res,err,next)=>{ 
    Promise.resolve(requesthandler(req,res,next)).catch((err)=>next(err))
    }
    }

    export default asnynchandler