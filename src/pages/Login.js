import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  AsyncStorage,
  Alert
} from "react-native";
import { withNavigation } from "react-navigation";
import color from "../utils/color";
import { getUserByToken } from "../utils/api";
import LoginHeader from "../components/LoginHeader";

class Login extends React.Component {
  static navigationOptions = {
    //自定义登录的头部组件
    headerTitle: <LoginHeader />
  };

  constructor(props) {
    super(props);
    this.state = {
      accesstoken: ""
    };
  }
  loginlHandler = async () => {
    const { accesstoken } = this.state;
    if (accesstoken.length == 0) {
      Alert.alert("提示", "请输入accesstoken");
      return;
    }
    let data = await getUserByToken({ accesstoken: accesstoken });
    const { success } = data;
    if (success) {
      const { loginname, id, avatar_url } = data;
      let user = {
        id: id,
        loginname: loginname,
        avatar_url: avatar_url,
        accesstoken: accesstoken
      };
      // 将登录用户信息暂存到本地
      await AsyncStorage.setItem("user", JSON.stringify(user));
      // 跳转到该去的页面
      let to = this.props.navigation.getParam("to");
      let params = this.props.navigation.getParam("params");
      this.props.navigation.navigate(to, params);
    } else {
      Alert.alert("提示", data.error_msg);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.token}
          onChangeText={accesstoken => this.setState({ accesstoken })}
          value={this.state.accesstoken}
          placeholder="请输入AccessToken进行登录"
        />
        <Button title="登录" onPress={this.loginlHandler} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flexShrink: 1,
    padding: 20
  },
  token: {
    height: 40,
    borderColor: color.border,
    borderBottomWidth: 1,
    marginBottom: 20
  }
});

export default withNavigation(Login);
