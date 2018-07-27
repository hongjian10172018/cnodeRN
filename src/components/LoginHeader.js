import React from "react";
import { View, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

class LoginHeader extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("Good");
          }}
        >
          <Ionicons name="ios-home" size={32} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(LoginHeader);
