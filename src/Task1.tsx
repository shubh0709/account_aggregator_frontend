import "./App.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { AccountData, UserDetails } from "./types";
import { fetchUserData, searchUserAccount } from "./api";
import fuzzysort from "fuzzysort";
import MultiSelect from "./MutliSelect";
import DatePicker from "./DatePicker";
import Modal from "./Modal";

const fetchData = searchUserAccount();

export default function Task1() {
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [inputVal, setInputVal] = useState<string>("");
  const pageNumber = useRef(1);
  const [selectedBankAccounts, setSelectedBankAccounts] = useState([]);
  const intersectionRef = useRef<IntersectionObserver>();
  const suggestionRef = useRef<HTMLTableElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const [moreDataToFetch, setMoreDataToFetch] = useState(true);

  const handleChange = useCallback(async (e: any) => {
    const val = e.target.value;
    setInputVal(val);
    if (suggestionRef.current)
      suggestionRef.current.classList.remove("hideTable");
  }, []);

  const getUserData = async () => {
    const response = await fetchUserData();
    setUserDetails(response);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getSuggestions = (val: string) => {
    const results = fuzzysort.go(val, userDetails?.keywords ?? []);
    return results.map((result) => result.target.toLowerCase());
  };

  useEffect(() => {
    setSuggestions(getSuggestions(inputVal));
  }, [inputVal]);

  const clickedSuggestion = useCallback(
    async (e: any) => {
      const val = e.target.textContent;
      if (suggestionRef.current) {
        suggestionRef.current.classList.add("hideTable");
        console.log(suggestionRef.current.classList);
      }
      setInputVal(val);
      pageNumber.current = 1;
      getData(false, val);
    },
    [selectedBankAccounts, startDate, endDate]
  );

  useEffect(() => {
    getData(false);
  }, [startDate, endDate, selectedBankAccounts]);

  const getData = async (
    appendData: boolean,
    recentSuggestionClickedVal = ""
  ) => {
    setLoading(true);
    try {
      const matchedData = await fetchData(
        recentSuggestionClickedVal ? recentSuggestionClickedVal : inputVal,
        selectedBankAccounts,
        startDate,
        endDate,
        pageNumber.current
      );
      setAccountData(matchedData);

      if (matchedData.length == 0) {
        setMoreDataToFetch(false);
      } else {
        setMoreDataToFetch(true);
      }

      if (appendData) {
        setAccountData([...accountData, ...matchedData]);
      } else {
        setAccountData(matchedData);
      }
    } catch (error) {
      setCustomError(() => "Something went wrong, please try again later");
      setAccountData([]);
    } finally {
      setLoading(false);
    }
  };

  const attachIntersection = useCallback(
    async (node: HTMLTableRowElement) => {
      // console.log({ node });
      if (loading || !moreDataToFetch) {
        return;
      }

      if (intersectionRef.current) {
        intersectionRef.current.disconnect();
      }

      intersectionRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          pageNumber.current += 1;
          getData(true);
        }
      });

      if (node) {
        intersectionRef.current.observe(node);
      } else {
        intersectionRef.current.disconnect();
      }

      return intersectionRef;
    },
    [loading, inputVal]
  );

  return (
    <div className="App">
      <h3>
        Select spend category from search box, you may add filters like bank
        accounts and have specific date range
      </h3>
      <input
        type="text"
        onChange={handleChange}
        value={inputVal}
        placeholder="Spend category search box"
      />
      <Modal>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Modal>
      {userDetails?.bankAccounts ? (
        <MultiSelect
          setSelectedBankAccounts={setSelectedBankAccounts}
          accountName={userDetails.bankAccounts}
        />
      ) : null}

      <table
        ref={suggestionRef}
        className={"tableStyle"}
        onClick={clickedSuggestion}
      >
        <tbody>
          {suggestions.length
            ? suggestions.map((row, ind) => {
                return (
                  <tr key={`${row}${ind}`}>
                    <td>{row}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
      {accountData.length ? (
        <table className="tableStyle">
          <thead>
            <tr>
              <th>AccountID</th>
              <th>Date</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {accountData.map((data, ind) => {
              return (
                <tr
                  key={ind}
                  ref={
                    accountData.length - 1 === ind ? attachIntersection : null
                  }
                >
                  <td>{data.AccountID || "N/A"}</td>
                  <td>{data.Date}</td>
                  <td>{data.Description}</td>
                  <td>
                    {data.Debit.Valid ? data.Debit.Float64.toFixed(2) : "N/A"}
                  </td>
                  <td>
                    {data.Credit.Valid ? data.Credit.Float64.toFixed(2) : "N/A"}
                  </td>
                  <td>
                    {data.Balance.Valid
                      ? data.Balance.Float64.toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      {loading && <h3>{"LOADING....."}</h3>}
      {customError !== "" && <h3 className={"customError"}>{customError}</h3>}
    </div>
  );
}