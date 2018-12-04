import React from "react";
import { FlatList, Button, StyleSheet, Text, View } from "react-native";
import KeyEvent from "react-native-key-event";
import Tts from "react-native-tts";

export default class App extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      voices: [],
      ttsStatus: "initiliazing",
      selectedVoice: null,
      speechRate: 0.5,
      speechPitch: 1,
      text: "This is an example text"
    };
  }

  initTts = async () => {
    const voices = await Tts.voices();
    console.log(voices);
    const availableVoices = voices
      .filter(v => !v.networkConnectionRequired && !v.notInstalled)
      .filter(v => v.language.startsWith("el"))
      .map(v => {
        return { id: v.id, name: v.name, language: v.language };
      });
    let selectedVoice = null;
    if (voices && voices.length > 0) {
      selectedVoice = voices[0].id;
      try {
        await Tts.setDefaultLanguage(voices[0].language);
      } catch (err) {
        // My Samsung S9 has always this error: "Language is not supported"
        console.log(`setDefaultLanguage error `, err);
      }
      await Tts.setDefaultVoice(voices[0].id);
      this.setState({
        voices: availableVoices,
        selectedVoice,
        ttsStatus: "initialized"
      });
    } else {
      this.setState({ ttsStatus: "initialized" });
    }
  };

  englishToGreek = {
    a: "α",
    b: "β",
    g: "γ",
    d: "δ",
    e: "ε",
    z: "ζ",
    h: "ήτα",
    u: "θ",
    i: "ι",
    k: "κ",
    l: "λ",
    m: "μ",
    n: "ν",
    j: "ξ",
    o: "ο",
    p: "π",
    r: "ρ",
    s: "σ",
    t: "τ",
    y: "υ",
    f: "φ",
    x: "χ",
    c: "ψ",
    v: "ω"
  };

  hasKey(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  remap(letter) {
    if (this.hasKey(this.englishToGreek, letter)) {
      return this.englishToGreek[letter];
    } else {
      return "Ωχ, δεν το ξέρω...";
    }
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

      const isNum = /^\d+$/.test(keyEvent.displayLabel);
      const toSay = isNum
        ? keyEvent.displayLabel
        : this.remap(keyEvent.displayLabel.toLowerCase());
      this.setState({ text: toSay });
      this.readText();
    });

    Tts.addEventListener("tts-start", event =>
      this.setState({ ttsStatus: "started" })
    );
    Tts.addEventListener("tts-finish", event =>
      this.setState({ ttsStatus: "finished" })
    );
    Tts.addEventListener("tts-cancel", event =>
      this.setState({ ttsStatus: "cancelled" })
    );
    Tts.setDefaultRate(this.state.speechRate);
    Tts.setDefaultPitch(this.state.speechPitch);
    Tts.getInitStatus().then(this.initTts);
  }

  componentWillUnmount() {
    // if you are listening to keyDown
    KeyEvent.removeKeyDownListener();

    // if you are listening to keyUp
    KeyEvent.removeKeyUpListener();

    Tts.stop();
  }

  readText = async () => {
    Tts.stop();
    Tts.speak(this.state.text);
  };

  onVoicePress = async voice => {
    try {
      await Tts.setDefaultLanguage(voice.language);
    } catch (err) {
      console.log(`setDefaultLanguage error `, err);
    }
    await Tts.setDefaultVoice(voice.id);
    this.setState({ selectedVoice: voice.id });
  };

  renderVoiceItem = ({ item }) => {
    return (
      <Button
        title={`${item.language} - ${item.name || item.id}`}
        color={this.state.selectedVoice === item.id ? undefined : "#969696"}
        onPress={() => this.onVoicePress(item)}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>key: {this.state.text}</Text>
        <Text>TTS status: {this.state.ttsStatus}</Text>
        <FlatList
          keyExtractor={item => item.id}
          renderItem={this.renderVoiceItem}
          extraData={this.state.selectedVoice}
          data={this.state.voices}
        />
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
