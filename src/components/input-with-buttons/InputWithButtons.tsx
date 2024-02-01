import React from "react";
import { view, ViewModel } from "@yoskutik/react-vvm";
import { action, observable, makeObservable } from "mobx";

interface IButtonConfig {
  onClick: () => void;
  position: "right" | "left";
  title: string;
}

interface InputWithButtonsProps {
  buttons?: IButtonConfig[];
  onChange: (value: string) => void;
  value: string;
  displayClearButton?: boolean;
}

class InputWithButtonsViewModel extends ViewModel<unknown, InputWithButtonsProps> {
  @observable value: string = this.viewProps.value;

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  handleChange(value: string): void {
    this.value = value;
    this.viewProps.onChange(value);
  }

  protected onViewMounted(): void {
    this.reaction(
      () => this.viewProps,
      state => {
        this.value = state.value;
      }
    );
  }

  renderButtons(position: "left" | "right"): React.ReactElement {
    const filteredButtons = this.viewProps.buttons?.filter(button => button.position === position) || [];

    if ([true, undefined].includes(this.viewProps.displayClearButton) && position === "right") {
      filteredButtons.push({ position: "right", onClick: () => this.handleChange(""), title: "Очистить" })
    }

    return (
      <>
        {filteredButtons.map(button => {
          return (
            <button className='button' key={button.title} onClick={button.onClick}>
              {button.title}
            </button>
          );
        })}
      </>
    );
  }
}

const InputWithButtons: React.FC<InputWithButtonsProps> = view(InputWithButtonsViewModel)(({ viewModel }) => {
  return (
    <div style={{ display: "flex" }}>
      {viewModel.renderButtons("left")}
      <input value={viewModel.value} onChange={(event): void => viewModel.handleChange(event.target.value)} />
      {viewModel.renderButtons("right")}
    </div>
  );
});

export default InputWithButtons;
