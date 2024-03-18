import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { hasUncaughtExceptionCaptureCallback } from 'process';


@Injectable()
export class AxiosRequest {
  constructor() {}

  async postAxiosRequest(body,url,key) {
    const data = JSON.stringify(body);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Authorization: `key=${key}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
    return response;
  }

  async getAxiosRequest(url,key) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Authorization: `key=${key}`,
        'Content-Type': 'application/json',
      },
    };
    const response = axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
    return response;
  }

  async queryDb(hasuraUrl,adminSecretKey,query: string, variables?: Record<string, any>): Promise<any> {
    try {
      const response = await axios.post(
        hasuraUrl,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': adminSecretKey
          },
        }
      );
      // if (response?.data?.errors) {
      //   throw new ErrorResponse({
      //     errorCode: response.data.errors[0].extensions,
      //     errorMessage: response.data.errors[0].message,
      //   });
      // }
      return response.data;
    } catch (ErrorResponse) {
      throw ErrorResponse;
    }
  }
}
