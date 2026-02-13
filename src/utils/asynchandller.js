const asynchandler=(requesthandler)=>{
    return (req,res,next)=>{ 
    Promise.resolve(requesthandler(req,res,next)).catch((err)=>next(err))
    }
    }

    export  {asynchandler}

// const asynchandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }


// export { asynchandler }
//mai chutiya hu mera ek hi up ho sakta hai wobhi giveup