import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const UserAutoComplete = ({ usersList, value, setValue }) => {
  const [inputValue, setInputValue] = React.useState("");
  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="user-authcomplete"
        options={usersList}
        renderInput={(params) => <TextField {...params} label="Users" />}
      />
    </div>
  );
};

export default UserAutoComplete;
