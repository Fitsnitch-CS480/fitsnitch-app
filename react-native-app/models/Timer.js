import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: props.duration ?? 30};
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      let {count} = this.state;
      this.setState({
        count: count - 1
      });
    }, 1000);
  }
  
  componentDidUpdate(prevProps, prevState, snapShot){
    if(prevState.count !== this.state.count && this.state.count === 0){
      clearInterval(this.timer);
      if(this.props.onTimesUp){
        this.props.onTimesUp();
      }
    }
  }

  fmtMSS(s) { return(s-(s%=60))/60+(9<s?':':':0')+s}

  render() {;
    let {count} = this.state;
    return(
        <View>
          <Text style={styles.seconds}>{this.fmtMSS(count)}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  seconds: {
    fontStyle: 'italic', 
    fontSize: 50,
    fontWeight: 'bold',
    color: 'red',
    justifyContent: "space-around",
    alignSelf: "center",
    backgroundColor: 'white',
  },
});

export default Timer;