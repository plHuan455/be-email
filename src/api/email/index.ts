import { EMAIL_API_URL } from './../../constants/EmailAPI/index';
import { Receiver } from '@layouts/InformationBar';
import ApiClient, { ApiResponse } from '@api/ApiClient';
import { AxiosResponse } from 'axios';

// export interface Receiver {}

// interface FileType {
//   path: string;
// }

export interface CreateEmailParam {
  subject: string;
  to: string[];
  from: string;
  content: string;
  html_string: string;
  cc: string[];
  bcc: string[];
  file: any[];
}

export interface EmailResponse {
  id: number;
  to: string[];
  from: string;
  content: string;
  cc: string[];
  status: string;
  writer_name: string;
  writer_id: number;
}

//GET EMAIL WITH STATUS
export const getEmailWithQueryParam = async (params?: {
  status?: string;
  email?: string | null;
  hashtag?: string;
}): Promise<AxiosResponse<EmailResponse[]>> => {
  const url = `${EMAIL_API_URL}`;
  const res = await ApiClient.get(
    url,
    { status: params?.status, email: params?.email, hashtag: params?.hashtag },
    {},
  );
  console.log('🚀 ~ file: index.ts ~ line 45 ~ res', res.data);
  return res.data;
};

//GET EMAIL WITH sender
export const getEmailWithSender = async (
  email: string,
): Promise<AxiosResponse<EmailResponse>> => {
  const url = EMAIL_API_URL;
  const res = await ApiClient.get(url, undefined, {});
  return res;
};

//APPROVE EMAIL
export const changeEmailStatus = async (
  email: string,
  status: string,
): Promise<AxiosResponse<EmailResponse>> => {
  const url = EMAIL_API_URL;
  const res = await ApiClient.put(url, undefined, {});
  return res;
};

//GET ALL EMAIL
export const getAllEmail = async (): Promise<AxiosResponse<EmailResponse>> => {
  const url = EMAIL_API_URL;
  const res = await ApiClient.get(url, undefined, {});
  return res;
};

//SEND EMAIL
export const sendEmail = async (
  params: CreateEmailParam,
): Promise<AxiosResponse<EmailResponse>> => {
  const url = EMAIL_API_URL;
  const res = await ApiClient.post(url, undefined, params);
  return res;
};

//DELETE EMAIL
export const deleteEmail = async (
  id: string,
): Promise<AxiosResponse<EmailResponse>> => {
  const url = EMAIL_API_URL;
  const res = await ApiClient.delete(`${url}/${id}`, undefined);
  return res;
};
