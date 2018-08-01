import React, { Component } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import color from "../utils/color";
import { reply } from "../utils/api";

class ReplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      content: props.loginname ? "@" + props.loginname : "" //回复内容
    };
  }
  submitReply = async () => {
    if (this.state.content) {
      let { content } = this.state;
      let { topic_id, accesstoken, reply_id, init } = this.props;
      let data = await reply({ topic_id, accesstoken, content, reply_id });
      if (data.success) {
        this.setState(
          {
            show: false, //隐藏输入框
            content: "" //清空输入框之后再刷新页面
          },
          () => {
            init();
          }
        );
      }
    } else {
      Alert.alert("提示", "请输入回复内容后再提交");
    }
  };
  render() {
    const Form = this.state.show ? (
      <View>
        <TextInput
          style={{
            backgroundColor: color.white,
            textAlignVertical: "top",
            height: 150
          }}
          multiline={true}
          maxLength={200}
          placeholder="最多可回复200个字符"
          numberOfLines={8}
          value={this.state.content}
          onChangeText={text => {
            this.setState({ content: text });
          }}
          underlineColorAndroid="transparent"
        />
        <View style={{ padding: 10 }}>
          <Button title="提交" onPress={this.submitReply} />
        </View>
      </View>
    ) : (
      <Text />
    );
    return Form;
  }
}

export default ReplyForm;
