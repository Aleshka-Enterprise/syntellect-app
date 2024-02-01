import React, { ChangeEvent, FC } from "react";
import { getCountryByName } from "../../api/apiService";
import { ICountry } from "../../models/Countries";
import { view, ViewModel } from "@yoskutik/react-vvm";
import { action, observable, makeObservable } from "mobx";
import { debounce } from "../../utils/utils";

interface InputWithDropdownListProps {
  count: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

class InputWithDropdownListViewModel extends ViewModel<unknown, InputWithDropdownListProps> {
  @observable suggestions: ICountry[] = [];
  @observable isFocused: boolean = false;

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  renderDropDown(): React.ReactElement {
    return (
      <div
        style={{
          position: "absolute",
          top: "50px",
          width: "calc(100% - 40px)",
          border: "solid 1px black",
          padding: "0 20px",
          backgroundColor: "#fff",
          zIndex: 10,
        }}
      >
        {this.suggestions.map(value => {
          return (
            <div
              key={value.flag}
              style={{ width: "100%", height: "40px", display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              {value.fullName}
            </div>
          );
        })}
      </div>
    );
  }

  @action
  updateSuggestions = debounce(() => {
    if (this.viewProps.value) {
      const suggestionsList: ICountry[] = [];
      getCountryByName(this.viewProps.value).then((countryList) => {
        for (const country of countryList) {
          if (!suggestionsList.find(el => el.name === country.name)) {
            suggestionsList.push(country);
          }
          if (suggestionsList.length === this.viewProps.count) {
            break;
          }
        }
        this.suggestions = suggestionsList;
      });
    }
  }, 300);

  @action
  inputHandler(event: ChangeEvent<HTMLInputElement>): void {
    this.updateSuggestions();
    this.viewProps.onChange(event.target.value);
    this.suggestions = [];
  }

  @action
  setIsFocused(value: boolean): void {
    this.isFocused = value;
  }
}

const InputWithDropdownList: FC<InputWithDropdownListProps> = view(InputWithDropdownListViewModel)(
  ({ viewModel, value, placeholder }) => {
    return (
      <div style={{ display: "flex", position: "relative" }}>
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event): void => viewModel.inputHandler(event)}
          onFocus={(): void => viewModel.setIsFocused(true)}
          onBlur={(): void => viewModel.setIsFocused(false)}
        />
        {viewModel.isFocused && !!viewModel.suggestions.length && viewModel.renderDropDown()}
      </div>
    );
  }
);

export default InputWithDropdownList;
