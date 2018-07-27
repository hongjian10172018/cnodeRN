import React from "react";
import { TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import RefreshListView, { RefreshState } from "react-native-refresh-list-view";
import { getTopics } from "../utils/api";
import Item from "../components/Item";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshState: RefreshState.Idle,
      data: [],
      page: 1,
      tab: "",
      limit: 10
    };
  }
  requestData = async () => {
    //获取数据
    let { page, limit } = this.state;
    let { tab } = this.props;
    let params = { page: page, tab: tab, limit: limit };
    let data = await getTopics(params);
    return data.data;
  };
  requestFirstPage = () => {
    try {
      this.setState(
        {
          refreshState: RefreshState.HeaderRefreshing,
          page: 1
        },
        async () => {
          let dataList = await this.requestData();

          this.setState({
            data: dataList,
            refreshState: RefreshState.Idle
          });
        }
      );
    } catch (error) {
      this.setState({
        refreshState: RefreshState.Failure
      });
    }
  };
  requestNextPage = () => {
    try {
      this.setState(
        {
          refreshState: RefreshState.FooterRefreshing,
          page: this.state.page + 1
        },
        async () => {
          let dataList = await this.requestData();

          this.setState({
            data: [...this.state.data, ...dataList],
            refreshState:
              this.state.data.length > 30
                ? RefreshState.NoMoreData
                : RefreshState.Idle
          });
        }
      );
    } catch (error) {
      this.setState({
        refreshState: RefreshState.Failure
      });
    }
  };
  componentDidMount() {
    this.requestFirstPage();
  }
  onHeaderRefresh = () => {
    this.requestFirstPage();
  };
  onFooterRefresh = () => {
    this.requestNextPage();
  };
  renderItem = rowData => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("Detail", {
            topic_id: rowData.item.id,
            title: rowData.item.title
          })
        }
      >
        <Item item={rowData.item} />
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <RefreshListView
        data={this.state.data}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        refreshState={this.state.refreshState}
        onHeaderRefresh={this.onHeaderRefresh}
        onFooterRefresh={this.onFooterRefresh}
      />
    );
  }
}

export default withNavigation(List);
