/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";
import { MUTATIONS_TYPES } from "../store/types";
import { ACTIONS_TYPES as UI_ACTIONS_TYPES } from "@/store/modules/ui/types";
import {
  ModalComponents,
  ACTIONS_TYPES as MODAL_ACTIONS_TYPES
} from "@/store/modules/modal/types";
import { ACTIONS_TYPES as GLOBAL_ACTIONS_TYPES } from "@/store/types";
import { Commit, Dispatch } from "vuex";

export default (appContext: {
  commit: Commit;
  dispatch: Dispatch;
  token: string;
  action: string;
  payload?: object;
  withErrorMessage: boolean;
  dataType?: string;
}) => {
  const options: AxiosRequestConfig = {
    baseURL: `${process.env.VUE_APP_BE_URL}/api/v1`,
    headers: {
      "Content-Type": appContext.dataType
        ? appContext.dataType
        : "application/json",
      Authorization: appContext.token ? `Bearer ${appContext.token}` : ""
    }
  };
  const errorHandler = async (error: any) => {
    if (_.get(error, "response.status", undefined) === 401) {
      appContext.commit(MUTATIONS_TYPES.SET_IS_SESSION_EXPIRED, true, {
        root: true
      });
      if (process.env.VUE_APP_IS_LOCAL) {
        appContext.dispatch(
          `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
          {
            component: ModalComponents.LOCAL_SESSION_EXPIRED
          },
          { root: true }
        );
      } else {
        await appContext.dispatch(
          GLOBAL_ACTIONS_TYPES.REFRESH_USER_ACCESS_TOKEN,
          {},
          { root: true }
        );
        if (appContext.payload) {
          await appContext.dispatch(appContext.action, appContext.payload);
        } else {
          await appContext.dispatch(appContext.action);
        }
      }
    }
    if (_.get(error, "response.status", undefined) === 403) {
      appContext.dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.PERMISSION_ERROR
        },
        { root: true }
      );
    }
    if (
      _.get(error, "response.status", undefined) !== 403 &&
      _.get(error, "response.status", undefined) !== 401
    ) {
      appContext.dispatch(
        `modal/${MODAL_ACTIONS_TYPES.OPEN_MODAL}`,
        {
          component: ModalComponents.ERROR_MODAL
        },
        { root: true }
      );
    }
    if (appContext.withErrorMessage) {
      appContext.dispatch(
        `ui/${UI_ACTIONS_TYPES.SHOW_MESSAGE}`,
        {
          text: "An error has ocurred",
          type: "error",
          position: "top-center",
          duration: 1000
        },
        { root: true }
      );
    }
    return Promise.reject(error);
  };

  const instance = axios.create(options);
  instance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      return response;
    },
    error => errorHandler(error)
  );
  return instance;
};
