import {Response} from 'express';
import {ValidationError} from 'yup';
import StatusCodes from 'http-status-codes';
import {logger} from '.';

const {NODE_ENV = 'development'} = process.env;

export const isDevEnv = NODE_ENV.includes('dev');

export const isProdEnv = !isDevEnv;

export const handleAPIError = (error: ValidationError | Error, message: string, res: Response) => {
  const errorMessage = isDevEnv ? message : 'An error occurred, please try again.';
  logger.error(errorMessage, error);

  if (error.name === 'ValidationError') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: (error as ValidationError).errors,
      errorMessage,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error,
    errorMessage,
  });
};