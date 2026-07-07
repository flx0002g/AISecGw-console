import { Modal } from "antd";
import axios from "axios";
import i18next from 'i18next';
import { ErrorComp } from './exception';

/** Dedup window for repeated error modals (ms). Prevents modal stacking during polling. */
const ERROR_DEDUP_MS = 5000;
let modalShown = false;
let lastErrorTime = 0;
let lastErrorKey = '';

const request = axios.create({
  timeout: 5 * 1000,
  baseURL: process.env.ICE_CORE_MODE === "development" ? "/api" : "",
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      Authorization: token,
      ...config.headers,
    };
  }
  if (config.method && config.method.toUpperCase() === 'GET' && config.url) {
    config.url = `${config.url}${config.url.indexOf('?') === -1 ? '?' : '&'}ts=${Date.now()}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const { status, config, data } = response;

    // console.log("response====", response);
    const statusCategory = Math.floor(status / 100);
    if (statusCategory === 2) {
      if (data && data.data) {
        return Promise.resolve(data.data);
      }
      return Promise.resolve(data);
    }
    return Promise.resolve(response);
  },
  (error) => {
    // console.log("error====", error);
    let { message, config, code } = error;
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        if (config.url.indexOf('/login') !== -1) {
          return Promise.resolve(error.response);
        }
        if (window.location.href.indexOf('/init') === -1 && window.location.href.indexOf('/login') === -1) {
          window.location.href = `/login?redirect=${window.location.pathname}`;
        }
        return Promise.reject(error);
      }
      const messageKeys = [`request.error.${status}_${config.method}`, `request.error.${status}`];
      for (const key of messageKeys) {
        const localizedMessage = i18next.t(key);
        if (localizedMessage !== key) {
          message = localizedMessage;
          break;
        }
      }
      code = status;
      if (data) {
        config.data = typeof data === 'string' ? data : JSON.stringify(data);
      }
    }
    showErrorModal(message, config, code);
    return Promise.reject(error);
  },
);

function showErrorModal(message: string, config: object, code?: number) {
  // Singleton + dedup: prevent modal stacking when 30s polling hits a failing backend.
  const now = Date.now();
  const dedupKey = `${code || ''}:${message}`;
  if (modalShown || (now - lastErrorTime < ERROR_DEDUP_MS && lastErrorKey === dedupKey)) {
    return;
  }
  modalShown = true;
  lastErrorTime = now;
  lastErrorKey = dedupKey;
  const modal = Modal.warning({
    title: i18next.t('misc.error'),
    content: <ErrorComp content={message} options={config} code={code} />,
    okText: i18next.t('misc.close'),
    width: 560,
    afterClose: () => {
      modalShown = false;
    },
  });
  // Auto-clear dedup window after ERROR_DEDUP_MS so transient errors can resurface.
  setTimeout(() => {
    lastErrorTime = 0;
    lastErrorKey = '';
  }, ERROR_DEDUP_MS);
}

export default request;
