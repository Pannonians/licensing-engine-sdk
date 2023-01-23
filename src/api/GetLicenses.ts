import { Get } from "../http";

/* eslint-disable camelcase */
export type GetLicensesApi = {
    all: Get<{}, string[]>
  };