import { Platform } from 'react-native';

const baseIP = Platform.OS === 'android'
  ? '10.0.2.2'
  : 'localhost'; // safe on iOS simulator

const baseUrls = {
  EU: `http://${baseIP}:8080`,
  US: `http://${baseIP}:8081`,
  ASIA: `http://${baseIP}:8082`,
};

export const api = async <T>(
  endpoint: string,
  region: "EU" | "US" | "ASIA",
  options: RequestInit = {}
): Promise<T> => {
  if (!region) {
    throw new Error("Region is not set. Cannot determine the database to use.");
  }
  console.log('in api function, region is', region);
  console.log('in api function, endpoint is', endpoint);
  console.log('base url is', baseUrls[region]);

  const res = await fetch(`${baseUrls[region]}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
  
    const error = await res.json();
    throw new Error(error.message || "API error");
  }

  return res.json();
};