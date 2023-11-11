import { AccountData, UserDetails } from "./types";

export function searchUserAccount() {
  let controller: AbortController;

  return function (val: string, pageNumber: number) {
    if (controller && controller.signal) {
      controller.abort();
    }

    if (!val) {
      pageNumber = 1;
      return Promise.resolve([]);
    }

    controller = new AbortController();

    return new Promise<AccountData[]>(async (resolve, reject) => {
      try {
        if (controller && controller?.signal?.aborted) {
          resolve([]);
          return;
        }

        const data = await fetch(
          `http://localhost:8080/search?keyword=${val}`,
          {
            signal: controller.signal,
          }
        );

        if (!data.ok) {
          throw new Error(`Request failed with status ${data.status}`);
        }

        const jsonData: AccountData[] = await data.json();

        resolve(jsonData);
      } catch (error) {
        if (controller && controller?.signal?.aborted === false) {
          reject(error);
        }

        resolve([]);
      }
    });
  };
}

export async function fetchUserData() {
  try {
    const data = await fetch("http://localhost:8080/userInfo");
    const jsonData: UserDetails = await data.json();
    console.log({ jsonData });
    return jsonData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
