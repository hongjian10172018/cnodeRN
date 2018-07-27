import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import timeago from "timeago.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import HTML from "react-native-render-html"; //渲染html成原生内容
import { withNavigation } from "react-navigation";
import color from "../utils/color";
import pxtodp from "../utils/pxtodp";
import { ups } from "../utils/api";
import ReplyForm from "../components/ReplyForm";

class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ups: props.item.ups,
      show: false //默认不显示回复框
    };
  }
  up = async (topic_id, title, item) => {
    //如果没有登录，就跳转到登录页面
    const user = await AsyncStorage.getItem("user");
    let replyID = item.id;
    let upsClone = [...this.state.ups];
    if (user) {
      const { accesstoken } = JSON.parse(user);
      let data = await ups({ replyID, accesstoken });

      if (data.success) {
        if (data.action === "down") {
          upsClone.pop();
          this.setState({
            ups: upsClone
          });
        } else {
          upsClone.push("up");
          this.setState({
            ups: upsClone
          });
        }
      } else {
        Alert.alert("提示", data.error_msg);
      }
    } else {
      this.props.navigation.navigate("Login", {
        to: "Detail",
        params: { topic_id: topic_id, title: title }
      });
    }
  };
  reply = () => {
    this.setState({
      show: !this.state.show
    });
  };
  render() {
    let { item, topic_id, title, init, reply_id, accesstoken } = this.props;
    const timeagoInstance = timeago(); //格式日期
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.left}>
            <Image
              style={styles.avatar}
              source={{
                uri: /^\//.test(item.author.avatar_url)
                  ? "http:" + item.author.avatar_url
                  : item.author.avatar_url
              }}
            />
            <View>
              <Text>{item.author.loginname}</Text>
              <Text>{timeagoInstance.format(item.create_at, "zh_CN")}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity
              onPress={() => {
                this.up(topic_id, title, item);
              }}
            >
              <Ionicons name="ios-thumbs-up" size={25} color={color.black} />
            </TouchableOpacity>
            <Text style={styles.upcount}>{this.state.ups.length}</Text>
            <TouchableOpacity onPress={this.reply}>
              <Ionicons name="ios-redo" size={25} color={color.black} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <HTML
            html={item.content}
            imagesMaxWidth={Dimensions.get("window").width - 20}
          />
        </View>
        {this.state.show && (
          <ReplyForm
            init={init}
            topic_id={topic_id}
            accesstoken={accesstoken}
            reply_id={reply_id}
            loginname={item.author.loginname}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: color.border,
    paddingVertical: pxtodp(10)
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  left: {
    flexDirection: "row",
    alignItems: "center"
  },
  right: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: pxtodp(48),
    height: pxtodp(48),
    borderRadius: pxtodp(24),
    marginRight: pxtodp(10)
  },
  upcount: {
    marginHorizontal: pxtodp(10)
  }
});

export default withNavigation(ReplyList);
