import React, { Component } from 'react'
import { View, UIManager, findNodeHandle, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ICON_SIZE = 24

export default class PopupMenu extends Component<any, any> {
  constructor (props:any) {
    super(props)
    this.state = {
      icon: null
    }
  }

  onError () {
    console.log('Popup Error')
  }

  onPress = () => {
    if (this.state.icon) {
      UIManager.showPopupMenu(
        findNodeHandle(this.state.icon),
        this.props.actions,
        this.onError,
        this.props.onPress
      )
    }
  }

  render () {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <Icon
            name='keyboard-control'
            size={ICON_SIZE}
            color={'grey'}
            ref={this.onRef} />
        </TouchableOpacity>
      </View>
    )
  }

  onRef = (icon: any) => {
    if (!this.state.icon) {
      this.setState({icon})
    }
  }
}