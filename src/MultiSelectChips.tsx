import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Tags({
  accountName,
  setSelectedBankAccounts,
}: {
  accountName: string[];
  setSelectedBankAccounts: Function;
}) {
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={accountName}
        getOptionLabel={(option) => option}
        defaultValue={accountName}
        filterSelectedOptions
        onChange={(event, newValue) => {
          setSelectedBankAccounts(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selected Accounts"
            placeholder="Favorites"
          />
        )}
      />
    </Stack>
  );
}
