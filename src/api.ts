import { AccountData, AggregateData, TrendData, UserDetails } from "./types";

export function searchUserAccount() {
  let controller: AbortController;

  return function (
    val: string,
    selectedBankAccounts: string[],
    startDate: string,
    endDate: string,
    pageNumber: number
  ) {
    if (controller && controller.signal) {
      controller.abort();
    }

    // if (!val) {
    //   pageNumber = 1;
    //   return Promise.resolve([]);
    // }

    // controller = new AbortController();

    return new Promise<AccountData[]>(async (resolve, reject) => {
      try {
        if (controller && controller?.signal?.aborted) {
          resolve([]);
          return;
        }

        const params = new URLSearchParams({
          keyword: val,
          start: startDate,
          end: endDate,
          page: `${pageNumber}`,
        });

        // Append each account separately if `selectedBankAccounts` is an array of strings
        selectedBankAccounts.forEach((account) => {
          params.append("accounts", account);
        });

        const data = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/search?${params.toString()}`,
          {
            // signal: controller.signal,
          }
        );

        if (!data.ok) {
          throw new Error(`Request failed with status ${data.status}`);
        }

        const jsonData: AccountData[] = await data.json();
        if (!jsonData) {
          resolve([]);
        }

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
    const data = await fetch("${process.env.REACT_APP_SERVER_URL}/userInfo");
    const jsonData: UserDetails = await data.json();
    return jsonData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const fetchAggregateData = async (
  category: string,
  startTime: string,
  endTime: string
) => {
  const params = new URLSearchParams({
    keyword: category,
    start: startTime,
    end: endTime,
  });

  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/aggregate?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const jsonData: AggregateData = await response.json();

    if (
      !jsonData ||
      (jsonData.total == 0 &&
        (jsonData.total_credit == 0 || jsonData.total_debit == 0))
    ) {
      return null;
    }

    return jsonData;
  } catch (error) {
    console.error("Error fetching aggregate data", error);
    return null;
  }
};

export const fetchTrendData = async (
  category: string,
  startTime: string,
  endTime: string
) => {
  const params = new URLSearchParams({
    keyword: category,
    start: startTime,
    end: endTime,
  });

  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/trend?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const jsonData: TrendData[] = await response.json();
    if (!jsonData) {
      return [];
    }

    return jsonData;
  } catch (error) {
    console.error("Error fetching trend data", error);
    return [];
  }
};
