import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Button,
  DeviceEventEmitter
} from "react-native";
import color from "../utils/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserByLoginname, getMsg } from "../utils/api";
import pxtodp from "../utils/pxtodp";

export default class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "", //用户信息
      msg: "" //消息
    };
  }
  componentDidMount() {
    this.init();
    // 监听到注销事件，重新初始化页面
    DeviceEventEmitter.addListener("logout", param => {
      this.init();
    });
  }
  init = async () => {
    //如果没有登录，就跳转到登录页面
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const { loginname, accesstoken } = JSON.parse(userStr);
      //获取用户信息
      let user = await getUserByLoginname(loginname);
      user = user.data;
      this.setState({ user });
      //获取消息
      let msg = await getMsg({ accesstoken: accesstoken });
      msg = msg.data;
      this.setState({ msg });
    } else {
      this.props.navigation.navigate("Login", { to: "My" });
    }
  };
  logout = async () => {
    await AsyncStorage.clear(); //清空本地缓存
    DeviceEventEmitter.emit("logout"); //通知所有页面用户已经注销
    this.props.navigation.navigate("Good"); //回到首页去
  };
  render() {
    let { user, msg } = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{ uri: user && user.avatar_url }}
          />
          <Text style={styles.loginname}>{user && user.loginname}</Text>
        </View>
        <View style={styles.baseInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.blueColor}>{user && user.score}个</Text>
            <Text style={styles.smallFont}>积分</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.redColor}>
              {user && user.recent_replies.length}条
            </Text>
            <Text style={styles.smallFont}>回复</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.greenColor}>
              {user && user.recent_topics.length}条
            </Text>
            <Text style={styles.smallFont}>发布</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.redColor}>
              {msg && msg.has_read_messages.length}条
            </Text>
            <Text style={styles.smallFont}>已读</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.greenColor}>
              {msg && msg.hasnot_read_messages.length}条
            </Text>
            <Text style={styles.smallFont}>未读</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("RecentList", {
              type: "recent_topics",
              data: user && user.recent_topics
            });
          }}
        >
          <View style={styles.list}>
            <View style={styles.left}>
              <Ionicons name="ios-create" size={24} color={color.black} />
              <Text style={{ marginLeft: 10 }}>最近发布</Text>
            </View>
            <Ionicons name="ios-arrow-forward" size={12} color={color.black} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("RecentList", {
              type: "recent_replies",
              data: user && user.recent_replies
            });
          }}
        >
          <View style={styles.list}>
            <View style={styles.left}>
              <Ionicons name="ios-redo" size={24} color={color.black} />
              <Text style={{ marginLeft: 10 }}>最近回复</Text>
            </View>
            <Ionicons name="ios-arrow-forward" size={12} color={color.black} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("RecentMsg", {
              type: "has_read_messages",
              data: msg && msg.has_read_messages
            });
          }}
        >
          <View style={styles.list}>
            <View style={styles.left}>
              <Ionicons
                name="ios-chatboxes-outline"
                size={24}
                color={color.black}
              />
              <Text style={{ marginLeft: 10 }}>已读消息</Text>
            </View>
            <Ionicons name="ios-arrow-forward" size={12} color={color.black} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("RecentMsg", {
              type: "hasnot_read_messages",
              data: msg && msg.hasnot_read_messages
            });
          }}
        >
          <View style={styles.list}>
            <View style={styles.left}>
              <Ionicons name="ios-chatboxes" size={24} color={color.black} />
              <Text style={{ marginLeft: 10 }}>未读消息</Text>
            </View>
            <Ionicons name="ios-arrow-forward" size={12} color={color.black} />
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 20, padding: 10 }}>
          <Button title="注销" onPress={this.logout} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.gray
  },
  header: {
    flexShrink: 1,
    padding: pxtodp(20),
    backgroundColor: color.blue,
    alignItems: "center"
  },
  avatar: {
    width: pxtodp(48),
    height: pxtodp(48),
    borderRadius: pxtodp(24)
  },
  loginname: {
    color: color.white,
    fontSize: pxtodp(16)
  },
  baseInfo: {
    flexDirection: "row",
    backgroundColor: color.white
  },
  infoItem: {
    flex: 1,
    flexShrink: 1,
    padding: pxtodp(10),
    borderRightWidth: 1,
    borderColor: color.border,
    alignItems: "center"
  },
  blueColor: {
    color: color.blue
  },
  redColor: {
    color: color.red
  },
  greenColor: {
    color: color.green
  },
  smallFont: {
    fontSize: pxtodp(12)
  },
  list: {
    flexDirection: "row",
    flexShrink: 1,
    padding: pxtodp(10),
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: pxtodp(10),
    backgroundColor: color.white
  },
  left: {
    flexDirection: "row",
    alignItems: "center"
  }
});
