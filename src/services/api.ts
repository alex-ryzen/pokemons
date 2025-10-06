import axios from "axios";
import { StatusCodes } from "http-status-codes";

const BACKEND_URL = process.env.REACT_APP_BACKEND_API_URL;

const StatusCodeMapping: Record<number, boolean> = {
    [StatusCodes.OK]: false,
    [StatusCodes.BAD_REQUEST]: true,
    [StatusCodes.UNAUTHORIZED]: true,
    [StatusCodes.NOT_FOUND]: true,
};

