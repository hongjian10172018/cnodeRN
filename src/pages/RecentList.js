import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import Item from "../components/Item";

class RecentList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:
        navigation.getParam("type") === "recent_topics"
          ? "最近发布"
          : "最近回复"
    };
  };
  render() {
    let data = this.props.navigation.getParam("data");
    return (
      <ScrollView style={{ flex: 1 }}>
        {data.map(item => {
          return (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Detail", {
                  topic_id: item.id,
                  title: item.title
                })
              }
            >
              <Item item={item} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }
}

export default RecentList;
