import "./App.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { AccountData, UserDetails } from "./types";
import { fetchUserData, searchUserAccount } from "./api";
import fuzzysort from "fuzzysort";

const fetchData = searchUserAccount();

export default function App() {
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState<string>("");
  const pageNumber = useRef(1);
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

  const clickedSuggestion = useCallback(async (e: any) => {
    const val = e.target.textContent;
    if (suggestionRef.current) {
      suggestionRef.current.classList.add("hideTable");
      console.log(suggestionRef.current.classList);
    }
    setInputVal(val);
    const searchData = await fetchData(val, pageNumber.current);
    setAccountData(searchData);
  }, []);

  return (
    <div className="App">
      <input
        type="text"
        onChange={handleChange}
        value={inputVal}
        placeholder="Search Box"
      />
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
                <tr key={ind}>
                  <td>{data.AccountID || "N/A"}</td>
                  <td>{new Date(data.Date).toLocaleDateString()}</td>
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
