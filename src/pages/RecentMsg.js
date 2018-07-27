import React from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import color from "../utils/color";
import HTML from "react-native-render-html"; //渲染html成原生内容
import timeago from "timeago.js";

class RecentMsg extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:
        navigation.getParam("type") === "has_read_messages"
          ? "已读消息"
          : "未读消息"
    };
  };
  render() {
    let data = this.props.navigation.getParam("data");
    const timeagoInstance = timeago(); //格式日期
    return (
      <ScrollView style={{ flex: 1 }}>
        {data.length > 0 ? (
          data.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Detail", {
                    topic_id: item.topic.id,
                    title: item.topic.title
                  });
                }}
              >
                <View
                  style={{
                    flexShrink: 1,
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: color.border,
                    backgroundColor: color.white
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      {item.topic.title}
                    </Text>
                    <Text>
                      {timeagoInstance.format(
                        item.topic.last_reply_at,
                        "zh_CN"
                      )}
                    </Text>
                  </View>
                  <HTML
                    html={item.reply.content}
                    imagesMaxWidth={Dimensions.get("window").width - 20}
                  />
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{ marginTop: 50, textAlign: "center" }}>暂无消息</Text>
        )}
      </ScrollView>
    );
  }
}

export default RecentMsg;
