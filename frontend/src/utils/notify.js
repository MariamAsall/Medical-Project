import { toast } from "react-toastify";

export const notifySuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
    });
};

export const notifyError = (msg) => {
    toast.error(msg, {
        position: "top-right",
    });
};

export const notifyInfo = (msg) => {
    toast.info(msg, {
        position: "top-right",
    });
};

export const notifyWarning = (msg) => {
    toast.warn(msg, {
        position: "top-right",
    });
};