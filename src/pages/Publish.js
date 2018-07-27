import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Picker,
  AsyncStorage,
  Alert,
  DeviceEventEmitter
} from "react-native";
import { withNavigation } from "react-navigation";
import { publishTopic } from "../utils/api";
import pxtodp from "../utils/pxtodp";

class Publish extends React.Component {
  static navigationOptions = {
    title: "发布"
  };
  constructor(props) {
    super(props);
    this.state = {
      accesstoken: "",
      tab: "dev",
      title: "",
      content: ""
    };
  }
  async componentDidMount() {
    this.init();
    // 监听到注销事件，重新初始化页面
    DeviceEventEmitter.addListener("logout", param => {
      this.init();
    });
  }
  init = async () => {
    //如果没有登录，就跳转到登录页面
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const accesstoken = JSON.parse(user).accesstoken;
      this.setState({
        accesstoken: accesstoken
      });
    } else {
      this.props.navigation.navigate("Login", { to: "Publish" });
    }
  };
  publishHandler = async () => {
    const { accesstoken, tab, title, content } = this.state;
    if (title.length == 0) {
      Alert.alert("提示", "请输入标题");
      return;
    }
    if (content.length == 0) {
      Alert.alert("提示", "请输入帖子内容");
      return;
    }
    let params = {
      accesstoken: accesstoken,
      tab: tab,
      title: title,
      content: content
    };
    let data = await publishTopic(params);
    let { success } = data;
    // 发布成功之后清空输入框
    if (success) {
      this.setState(
        {
          title: "",
          content: ""
        },
        () => {
          // 清空输入框之后跳转到列表页
          this.props.navigation.navigate("Good");
        }
      );
    } else {
      Alert.alert(data.error_msg);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.label}>类别：</Text>
          <Picker
            style={styles.picker}
            selectedValue={this.state.tab}
            onValueChange={tab => this.setState({ tab: tab })}
          >
            <Picker.Item label="测试" value="dev" />
            <Picker.Item label="分享" value="share" />
            <Picker.Item label="问答" value="ask" />
            <Picker.Item label="招聘" value="job" />
          </Picker>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>标题：</Text>
          <TextInput
            style={styles.title}
            onChangeText={val => this.setState({ title: val })}
            value={this.state.title}
          />
        </View>
        <View style={styles.box}>
          <TextInput
            style={styles.content}
            onChangeText={val => this.setState({ content: val })}
            value={this.state.content}
            multiline={true}
            numberOfLines={10}
            placeholder="请输入帖子内容"
          />
        </View>
        <Button onPress={this.publishHandler} title="发布帖子" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    padding: pxtodp(20)
  },
  box: {
    flexDirection: "row",
    flexShrink: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: pxtodp(10)
  },
  label: {
    fontSize: pxtodp(12),
    fontWeight: "bold"
  },
  picker: {
    flex: 1
  },
  title: {
    flex: 1
  },
  content: {
    width: "100%",
    textAlignVertical: "top"
  }
});

export default withNavigation(Publish);
