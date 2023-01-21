import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = this.configureProps(props);
  }

  configureProps(props) {
    let endTime =  props.endTime;
    if (!endTime) {
      let duration = (props.duration ?? 30) * 1000;
      endTime = Date.now() + duration;
    }
    return {
      endTime,
      remaining: this.getTimeRemaining(endTime),
    };
  }

  componentDidMount() {
    console.log("MOUNTED NEW TIMER!!!");
    this.resetTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  resetTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      let {endTime} = this.state;
      this.setState({
        endTime,
        remaining: this.getTimeRemaining(endTime)
      });
    }, 1000);
  }
  
  componentDidUpdate(prevProps, prevState, snapShot){
    console.log("UPDATING TIMER!", this.state.endTime, prevState.endTime)
    
    if(prevState.remaining !== this.state.remaining && this.state.remaining <= 0){
      clearInterval(this.timer);
      if(this.props.onTimesUp){
        this.props.onTimesUp();
      }
    }

    if (this.props.endTime != prevProps.endTime) {
      this.setState(this.configureProps(this.props));
      this.resetTimer();
    }
  }

  getTimeRemaining(endTime) {
    return endTime - Date.now();
  }

  fmtMSS() { 
    let {remaining} = this.state;
    if (remaining <= 0) {
      return "00:00"
    }
    var minutes = Math.floor(remaining/60000);
    var seconds = Math.floor((remaining - minutes * 60000) / 1000);

    return (minutes<10 ? "0" : "") + minutes + ":" + (seconds<10 ? "0" : "") + seconds
  };

  render() {
    return(
        <View>
          <Text style={styles.seconds}>{this.fmtMSS()}</Text>
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