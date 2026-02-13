class ApiError extends Error{
    constructor(
        // statuscode,
        // message:"Somthing went wrong ",
        // error=[],
        // stack:""/
         statuscode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message),
        this.statuscode=statuscode
        this.data= null
        this.message= message
        this.stack=false;   
        this.errors=errors

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}