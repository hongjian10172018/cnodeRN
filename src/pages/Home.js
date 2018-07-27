import React from "react";
import {
  createTabNavigator,
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";
import { BackHandler, ToastAndroid } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import My from "./My";
import Publish from "./Publish";
import List from "./List";
import Detail from "./Detail";
import RecentList from "./RecentList";
import RecentMsg from "./RecentMsg";
import Login from "./Login";
import color from "../utils/color";

const Good = () => {
  return <List tab="good" />;
};
const Share = () => {
  return <List tab="share" />;
};
const Ask = () => {
  return <List tab="ask" />;
};
const Job = () => {
  return <List tab="job" />;
};

const TopicTab = createTabNavigator(
  {
    Good: {
      screen: Good,
      navigationOptions: {
        title: "精华"
      }
    },
    Share: {
      screen: Share,
      navigationOptions: {
        title: "分享"
      }
    },
    Ask: {
      screen: Ask,
      navigationOptions: {
        title: "问答"
      }
    },
    Job: {
      screen: Job,
      navigationOptions: {
        title: "工作"
      }
    }
  },
  {
    lazy: true,
    tabBarPosition: "top", //切换条位置
    swipeEnabled: true, //是否可以滑动
    animationEnabled: true //滑动效果
  }
);

const BottomTab = createBottomTabNavigator(
  {
    TopicTab: {
      screen: TopicTab,
      navigationOptions: {
        title: "帖子"
      }
    },
    Publish: {
      screen: Publish,
      navigationOptions: {
        title: "发布"
      }
    },
    My: {
      screen: My,
      navigationOptions: {
        title: "我的"
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "TopicTab") {
          //切换不同的图标
          iconName = `ios-document${focused ? "" : "-outline"}`;
        } else if (routeName === "Publish") {
          iconName = `ios-create${focused ? "" : "-outline"}`;
        } else if (routeName === "My") {
          iconName = `ios-person${focused ? "" : "-outline"}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      }
    })
  }
);

const AppStack = createStackNavigator(
  {
    BottomTab: {
      screen: BottomTab,
      navigationOptions: {
        header: null
      }
    },
    Detail: Detail,
    RecentList: RecentList,
    RecentMsg: RecentMsg
  },
  {
    initialRouteName: "BottomTab",
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: color.blue
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

const LoginStack = createStackNavigator({
  Login: Login
});

const SwitchNav = createSwitchNavigator({
  AppStack: AppStack,
  LoginStack: LoginStack
});

//后退处理
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: "Good"
    };
  }
  handler = () => {
    if (
      this.state.currentScreen === "Good" ||
      this.state.currentScreen === "Login"
    ) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近两秒按过BACK键，可以退出应用
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show("再按一次后退键将退出APP", ToastAndroid.SHORT);
      return true;
    }
    return false;
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handler);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handler);
  }
  // 获取当前视图的路由名称
  getActiveRouteName = navigationState => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // 深入嵌套路由， 通过递归实现
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  };
  render() {
    return (
      <SwitchNav
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = this.getActiveRouteName(currentState);
          const prevScreen = this.getActiveRouteName(prevState);
          if (prevScreen !== currentScreen) {
            this.setState({
              currentScreen: currentScreen
            });
          }
        }}
      />
    );
  }
}
