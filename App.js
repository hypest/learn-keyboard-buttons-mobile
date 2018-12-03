import React from "react";
import { StyleSheet, Text, View } from "react-native";
import KeyEvent from "react-native-key-event";

export default class App extends React.Component {
  constructor() {
    super( ...arguments );

    this.state = { keyDisplay: "" };
  }

  componentDidMount() {
    // if you want to react to keyDown
    KeyEvent.onKeyDownListener(keyEvent => {
      console.log(`onKeyDown keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
    });

    // if you want to react to keyUp
    KeyEvent.onKeyUpListener(keyEvent => {
      console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
      console.log(keyEvent);
      this.setState({ keyDisplay: keyEvent.displayLabel });
    });
  }

  componentWillUnmount() {
    // if you are listening to keyDown
    KeyEvent.removeKeyDownListener();

    // if you are listening to keyUp
    KeyEvent.removeKeyUpListener();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>key: {this.state.keyDisplay}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
