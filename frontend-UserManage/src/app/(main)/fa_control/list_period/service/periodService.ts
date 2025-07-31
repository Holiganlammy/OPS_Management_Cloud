import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

export async function getAutoData() {
  const urls = {
    typeGroup: '/FA_Control_Assets_TypeGroup',
    nacStatus: '/FA_Control_ListStatus',
  };

  const fetchMultipleUrls = async (urls: { [key: string]: string }) => {
    try {
      const response = Object.entries(urls).map(async ([key, url]) => {
        const response = await client.get(dataConfig().http + url, { method: 'GET', headers: dataConfig().header });
        const data = await response.data;
        return { key, data };
      });
      return await Promise.all(response);
    } catch (error) {
      console.error('ข้อผิดพลาด:', error);
    }
  };

  return fetchMultipleUrls(urls);
}

export async function getAutoDataPeriod(usercode: string) {

  const urls = {
    period: '/FA_Control_Fetch_Branch_Period',
  };

  const fetchMultipleUrls = async (urls: { [key: string]: string }) => {
    try {
      const response = Object.entries(urls).map(async ([key, url]) => {
        const response = await client.post(dataConfig().http + url, { usercode }, { method: 'POST', headers: dataConfig().header });
        const data = await response.data;
        console.log(data);
        
        return { key, data };
      });

      return await Promise.all(response);
    } catch (error) {
      console.error('ข้อผิดพลาด:', error);
    }
  };

  return fetchMultipleUrls(urls);
}

