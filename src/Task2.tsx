import "./App.css";
import { useEffect, useState, useCallback, useRef } from "react";
import Trend from "./Trend";
import DatePicker from "./DatePicker";
import fuzzysort from "fuzzysort";
import { fetchUserData } from "./api";
import Aggregate from "./Aggregate";
import { UserDetails } from "./types";
import Modal from "./Modal";
import { start } from "repl";

export default function Task2() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [inputVal, setInputVal] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const suggestionRef = useRef<HTMLTableElement | null>(null);

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

  const handleChange = useCallback(async (e: any) => {
    const val = e.target.value;
    setInputVal(val);
    if (suggestionRef.current)
      suggestionRef.current.classList.remove("hideTable");
  }, []);

  const clickedSuggestion = useCallback(
    async (e: any) => {
      const val = e.target.textContent;
      if (suggestionRef.current) {
        suggestionRef.current.classList.add("hideTable");
        console.log(suggestionRef.current.classList);
      }
      setInputVal(val);
      setCategory(val);
    },
    [startDate, endDate]
  );

  return (
    <div>
      <h5>
        Accounts data from csv files has been updated to the database for axis,
        hdfc, icici
      </h5>
      <h5>
        By default data from all your accounts and all dates will be shown
      </h5>

      <h3>
        Select date range and category (search bar) to see the Trends and
        Aggregates
      </h3>
      <div>
        <h5>following categories have been detected from all the accounts</h5>
        {userDetails?.keywords.map((val) => (
          <>
            <span>{`${val}`}</span>
            <span style={{ width: "1rem" }} />
          </>
        ))}
      </div>
      <span style={{ height: "2rem" }} />
      <div>
        <input
          className="searchBox"
          type="text"
          onChange={handleChange}
          value={inputVal}
          placeholder="Type to select category"
        />
      </div>
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
      <span style={{ height: "1rem" }} />
      <Modal>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Modal>
      <span style={{ height: "1rem" }} />
      <div>
        <span>{`start date: ${startDate === "" ? "none" : startDate}`}</span>
        <span className={"horizontalSpace"} />
        <span>{`end date: ${endDate === "" ? "none" : endDate}`}</span>
      </div>
      <span style={{ height: "1rem" }} />
      <Trend category={category} startTime={startDate} endTime={endDate} />
      <span style={{ height: "2rem" }} />
      <Aggregate category={category} startTime={startDate} endTime={endDate} />
    </div>
  );
}
