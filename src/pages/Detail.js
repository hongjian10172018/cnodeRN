import React, { Component } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Alert
} from "react-native";
import HTML from "react-native-render-html"; //渲染html成原生内容
import { getTopic, reply } from "../utils/api";
import color from "../utils/color";
import pxtodp from "../utils/pxtodp";
import ReplyItem from "../components/ReplyItem";
import ReplyForm from "../components/ReplyForm";

export default class Detail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      topic_id: "", //帖子id
      reply_id: "", //回复id
      content: "", //回复内容
      accesstoken: "", //token
      topicContent: "", //帖子内容
      replies: [] //回复内容
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    // 初始化页面
    let { navigation } = this.props;
    let topic_id = navigation.getParam("topic_id");

    // 获取数据
    let data = await getTopic(topic_id);

    // 获取token
    const user = await AsyncStorage.getItem("user");
    const accesstoken = user ? JSON.parse(user).accesstoken : "";

    // 更新数据
    this.setState({
      topic_id: topic_id,
      accesstoken: accesstoken,
      topicContent: data.data.content,
      replies: data.data.replies
    });
  };
  submitReply = async () => {
    if (this.state.content) {
      let { topic_id, accesstoken, content, reply_id } = this.state;
      let data = await reply({ topic_id, accesstoken, content, reply_id });
      // alert(JSON.stringify(data));
      if (data.success) {
        this.setState(
          {
            content: "" //清空输入框之后再刷新页面
          },
          () => {
            this.init();
          }
        );
      }
    } else {
      Alert.alert("提示", "请输入回复内容后再提交");
    }
  };
  render() {
    let { topicContent, replies, accesstoken } = this.state;
    let topic_id = this.props.navigation.getParam("topic_id"); //帖子id
    let title = this.props.navigation.getParam("title"); //帖子标题
    return (
      <ScrollView style={styles.container}>
        <View style={{ padding: 10 }}>
          <HTML
            html={topicContent}
            imagesMaxWidth={Dimensions.get("window").width - 20}
          />
        </View>
        {replies.length > 0 && (
          <Text style={styles.title}>{replies.length}个回复</Text>
        )}
        <View style={{ padding: 10 }}>
          {replies.map(item => {
            return (
              <ReplyItem
                item={item}
                topic_id={topic_id}
                title={title}
                init={this.init}
                accesstoken={accesstoken}
                reply_id={item.id}
              />
            );
          })}
        </View>
        {accesstoken ? (
          <ReplyForm
            init={this.init}
            topic_id={topic_id}
            accesstoken={accesstoken}
          />
        ) : (
          <Text />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    flexShrink: 1,
    padding: pxtodp(10),
    fontSize: pxtodp(16),
    fontWeight: "bold",
    backgroundColor: color.white
  }
});
