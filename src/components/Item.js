import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import timeago from "timeago.js";
import color from "../utils/color";
import pxtodp from "../utils/pxtodp";

class Item extends React.Component {
  render() {
    let { item } = this.props;
    const timeagoInstance = timeago(); //格式日期
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.content}>
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
              <Text style={styles.desc}>{item.author.loginname}</Text>
              <Text style={styles.desc}>
                {timeagoInstance.format(item.create_at, "zh_CN")}
              </Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={styles.desc}>
              {item.reply_count ? item.reply_count : "--"} /{" "}
              {item.visit_count ? item.visit_count : "--"}
            </Text>
            <Text style={styles.desc}>
              {timeagoInstance.format(item.last_reply_at, "zh_CN")}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: color.border,
    padding: pxtodp(20),
    flexShrink: 1,
    backgroundColor: color.white
  },
  titleBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pxtodp(10)
  },
  flag: {
    paddingHorizontal: pxtodp(8),
    paddingVertical: pxtodp(5),
    marginRight: pxtodp(10),
    color: color.white,
    borderRadius: 5,
    backgroundColor: color.primary
  },
  title: {
    fontSize: pxtodp(12),
    color: color.title,
    fontWeight: "bold",
    flexShrink: 1
  },
  desc: {
    fontSize: pxtodp(10)
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  left: {
    flexDirection: "row",
    alignItems: "center"
  },
  right: {
    justifyContent: "center"
  },
  avatar: {
    width: pxtodp(48),
    height: pxtodp(48),
    borderRadius: pxtodp(24),
    marginRight: pxtodp(10)
  }
});

export default Item;
