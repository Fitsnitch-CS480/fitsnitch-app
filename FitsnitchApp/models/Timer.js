import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 30};
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
          <Text style={styles.text1}>Are You Cheating?</Text>
          <Text></Text>
          <Text style={styles.seconds}>{this.fmtMSS(count)}</Text>
          <Text></Text>
          <Text style={styles.text2}>Select an option below to stop us from snitching on you! </Text>
          <Text></Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    width: '100%',
    height: "20%",
    backgroundColor: "white",
  },
  seconds: {
    fontStyle: 'italic', 
    fontSize: 50,
    fontWeight: 'bold',
    color: 'red',
    justifyContent: "space-around",
    alignSelf: "center",
    backgroundColor: 'white',
  },
  text1:{
    color: 'black',
    alignSelf: "center",
    fontSize: 30,
  },
  text2:{
    color: 'black',
    alignSelf: "center",
    fontSize: 20,
  }
});

export default Timer;