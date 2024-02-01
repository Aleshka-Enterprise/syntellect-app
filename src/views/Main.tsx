import React from "react";
import { view, ViewModel } from "@yoskutik/react-vvm";
import {  observable, makeObservable } from 'mobx';
import InputWithButtons from "../components/input-with-buttons/InputWithButtons";
import InputWithDropdownList from "../components/input-with-dropdown-list/InputWithDropdownList";

const blockMixin: React.CSSProperties = {
  width: "600px",
  height: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "50px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  padding: "20px",
  marginTop: "150px",
};

class MainViewModel extends ViewModel {
  @observable helloWorldField: string = "";
  @observable fieldWithNumbers: string = "";
  @observable dropDownWith3Element: string = "";
  @observable dropDownWith10Element: string = "";

  constructor() {
    super();
    makeObservable(this);
  }

  setHelloWorldField(value: string): void {
    this.helloWorldField = value;
  }

  setFieldWithNumbers(value: string): void {
    this.fieldWithNumbers = value;
  }

  setDropDownWith3Element(value: string): void {
    this.dropDownWith3Element = value;
  }

  setDropDownWith10Element(value: string): void {
    this.dropDownWith10Element = value;
  }

  checkNumber(value: string): void {
    if (value && !isNaN(Number(value))) {
      alert(value);
    }
  }
}

const Main = view(MainViewModel)(({ viewModel }) => {
  const { helloWorldField, fieldWithNumbers, dropDownWith3Element, dropDownWith10Element } = viewModel;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <div style={blockMixin}>
          <h1 style={{ display: "flex", justifyContent: "center", margin: 0 }}>Блок с кнопками</h1>
          <InputWithButtons
            buttons={[
              {
                position: "right",
                onClick: (): void => viewModel.setHelloWorldField("Hello world!"),
                title: "Привет Мир!",
              },
            ]}
            onChange={(value: string): void => viewModel.setHelloWorldField(value)}
            value={helloWorldField}
          />
          <InputWithButtons
            buttons={[
              {
                position: "left",
                onClick: (): void => viewModel.checkNumber(fieldWithNumbers),
                title: "Проверить что число",
              },
              { position: "right", onClick: () => fieldWithNumbers && alert(fieldWithNumbers), title: "Alert" },
            ]}
            onChange={(value: string): void => viewModel.setFieldWithNumbers(value)}
            value={fieldWithNumbers}
            displayClearButton={false}
          />
        </div>
        <div style={{ ...blockMixin, marginTop: "50px" }}>
          <h1 style={{ display: "flex", justifyContent: "center", margin: 0 }}>Блок со списком</h1>
          <InputWithDropdownList
            onChange={(value: string): void => viewModel.setDropDownWith3Element(value)}
            value={dropDownWith3Element}
            count={3}
            placeholder={"3 подсказки"}
          />
          <InputWithDropdownList
            onChange={(value: string): void => viewModel.setDropDownWith10Element(value)}
            value={dropDownWith10Element}
            count={10}
            placeholder={"10 подсказок"}
          />
        </div>
      </div>
    </div>
  );
});

export default Main;
