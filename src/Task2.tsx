import "./App.css";
import { useEffect, useState, useCallback, useRef } from "react";
import Trend from "./Trend";
import DatePicker from "./DatePicker";
import fuzzysort from "fuzzysort";
import { fetchUserData } from "./api";
import Aggregate from "./Aggregate";
import { UserDetails } from "./types";
import Modal from "./Modal";

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
    <div className="App">
      <h3>
        Select date range and category (search bar) to see the Trends and
        Aggregates
      </h3>
      <Modal>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Modal>
      <input
        type="text"
        onChange={handleChange}
        value={inputVal}
        placeholder="Spend category search box"
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

      <Trend category={category} startTime={startDate} endTime={endDate} />
      <Aggregate category={category} startTime={startDate} endTime={endDate} />
    </div>
  );
}
