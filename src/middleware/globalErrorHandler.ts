import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
  // if (res.headersSent) {
  //   return next(err)
  // }
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails= err;

  // prisma client validation error
  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400
    errorMessage = 'You provided invalid fields for this request.'
    errorDetails = err.message
  }
  // prisma client known errors
  else if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code === 'P2025'){
      statusCode = 404
      errorMessage = 'The requested resource was not found.'
    }
    else if(err.code === 'P2002'){
      statusCode = 409
      errorMessage = 'A record with this unique field already exists.'
    }
    else if(err.code === 'P2003'){
      statusCode = 400
      errorMessage = 'Foreign key constraint failed.'
    }
  }
  else if(err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode = 500
    errorMessage = 'An unknown error occurred in the database client.'
  }
  else if(err instanceof Prisma.PrismaClientRustPanicError){
    statusCode = 500
    errorMessage = 'A Rust panic occurred in the database client.'
  }
  else if(err instanceof Prisma.PrismaClientInitializationError){
    if(err.errorCode === 'P1000'){
      statusCode = 401
      errorMessage = 'Authentication failed while connecting to the database.'
    }
    else if (err.errorCode === 'P1001'){
      statusCode = 400
      errorMessage = 'An error occurred while connecting to the database.'
    }
  }
  res.status(statusCode)
  res.json({ message : errorMessage, error: errorDetails })
}

export default errorHandler