import React from "react";
import ReactDOM from "react-dom";
import {
  Provider,
  Dialog,
  Button,
  Tab,
  TabList,
  TabPanel,
  RoverState,
  useDialogState,
  useTabState,
  TabStateReturn,
  DialogStateReturn,
  DialogBackdrop,
  Separator
} from "reakit";
import * as system from "reakit-system-bootstrap";
import { useObserver } from "mobx-react";
import { observable, autorun, reaction, extendObservable } from "mobx";

class AppState {
  @observable tab: TabStateReturn = {};
  @observable dialog: DialogStateReturn = {};
  @observable showTabs = false;
  selectTab2 = () => {
    this.tab.select("tab2");
  };
  selectUnknownTab = () => {
    this.tab.select("sdafasdfasdf");
  };
  deselectTab = () => {
    this.tab.select(null);
  };
  toggleShowTabs = () => {
    this.showTabs = !this.showTabs;
  };
}

const app = new AppState();
window.app = app;
autorun(() => {
  console.log(`APP: Selected Tab is ${app.tab.selectedId}`);
  console.log(`APP: Dialog is ${app.dialog.visible}`);
});

// const useBoundLocalState = (binder, unbinder, deps) => {
//   React.useEffect(() => {
//     binder();
//     console.debug("local bound to app");
//     return () => {
//       console.debug("local unbound from app");
//       unbinder();
//     };
//   }, []);

//   // react to state changes by binding the new tab
//   React.useEffect(() => {
//     console.debug("bound changed occured");
//     binder();
//   }, deps);
// };

const useBoundLocalState2 = (value, binder) => {
  React.useEffect(() => {
    binder(value);
    console.debug("local bound to app", value);
    return () => {
      console.debug("local unbound from app", value);
      binder(null);
    };
  }, []);

  // react to state changes by binding the new tab
  React.useEffect(() => {
    console.debug("bound changed occured", value);
    binder(value);
  }, [value]);
};

const TabDemo = () => {
  const dialog = useDialogState();
  const tab = useTabState({
    manual: true,
    selectedId: "tab1"
  });

  // useBoundLocalState(() => (app.tab = tab), () => (app.tab = {}), [tab]);
  useBoundLocalState2(tab, tab => (app.tab = { ...tab }));
  //useBoundLocalState2(dialog, dialog => (app.dialog = { ...dialog }));

  // bind the initial instance into the mobx state store
  // React.useEffect(() => {
  //   console.log("local state bound into app", tab);
  //   app.tab = tab;
  //   return () => {
  //     console.log("local state unbound from app", tab);
  //     app.tab = {};
  //   };
  // }, []);

  // // react to state changes by binding the new tab
  // React.useEffect(() => {
  //   console.log("boundState changed", tab);
  //   app.tab = tab;
  // }, [tab]);

  const handleOnClick = () => {
    // show dialog only when changing tabs
    if (tab.selectedId !== tab.currentId) {
      dialog.show();
    }
  };
  const handleSave = () => {
    console.log("TODO: handleSave() not yet implemented");
  };
  const handleOnConfirm = () => {
    dialog.hide();
    handleSave();
    // tab.currentId will change when another tab is focused/pressed (before click)
    tab.select(tab.currentId);
  };
  const handleOnCancel = () => {
    dialog.hide();
  };

  React.useEffect(() => {
    if (!dialog.visible) {
      tab.move(tab.currentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.visible, tab.currentId]);

  return useObserver(() => (
    <React.Fragment>
      <TabList {...tab} aria-label="My tabs">
        <Tab {...tab} stopId="tab1">
          {/* We can use render props to override the underlying onClick */}
          {props => (
            <button {...props} onClick={handleOnClick}>
              Tab 1
            </button>
          )}
        </Tab>
        <Tab {...tab} stopId="tab2">
          {props => (
            <button {...props} onClick={handleOnClick}>
              Tab 2
            </button>
          )}
        </Tab>
        <Tab {...tab} stopId="tab3">
          {props => (
            <button {...props} onClick={handleOnClick}>
              Tab 3
            </button>
          )}
        </Tab>
      </TabList>
      <TabPanel {...tab} stopId="tab1">
        Tab 1
      </TabPanel>
      <TabPanel {...tab} stopId="tab2">
        Tab 2
      </TabPanel>
      <TabPanel {...tab} stopId="tab3">
        Tab 3
      </TabPanel>
      <DialogBackdrop {...dialog} />
      <Dialog {...dialog} role="alertdialog" aria-label="Confirm discard">
        <p>
          Are you sure you want change tab? This will save any changes you made.
        </p>
        <div style={{ display: "grid", gridGap: 16, gridAutoFlow: "column" }}>
          <Button onClick={handleOnCancel}>No, do not chage yet!</Button>
          <Button onClick={handleOnConfirm}>Yes, please do it!</Button>
        </div>
      </Dialog>
      <Button onClick={app.selectTab2}>Select Tab 2</Button>
      <Button onClick={app.deselectTab}>DeSelect Tab</Button>
      <Button onClick={app.selectUnknownTab}>select unknown tab</Button>
    </React.Fragment>
  ));
};
const App = props =>
  useObserver(() => (
    <React.Fragment>
      <Button onClick={app.toggleShowTabs}>Toggle Show Tabs</Button>
      <Separator />
      {app.showTabs && <TabDemo />}
    </React.Fragment>
  ));

ReactDOM.render(
  <Provider unstable_system={system}>
    <App />
  </Provider>,
  document.getElementById("root")
);
