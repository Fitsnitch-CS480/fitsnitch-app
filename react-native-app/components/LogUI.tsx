import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import UseLocationTracking from '../hooks/useLocationTracking';
import { globalContext } from '../navigation/appNavigator';
import { observer } from 'mobx-react-lite'

const LogUI = observer(()=>{
    const {logStore} = useContext(globalContext);

    const scrollViewRef:any = React.useRef();

    const [sticky, setSticky] = useState(true);
    const [expand, setExpand] = useState(true);

    function onScrollEnd(event:any){
        let scrollY = event.nativeEvent.contentOffset.y
        let maxY = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height
        setSticky(maxY - scrollY < 10)
    }


    function ToolBarButton({ title, onPress, color, ...props}: any) {
        return (
            <View style={[
                    styles.button,
                    color ? {backgroundColor: color} : {}
                ]}
                onTouchEnd={onPress}
                {...props}
            >
                <Text>{title}</Text>
            </View>
        )
    }


    function ToggleButton({ state, title, ...props}: any) {
        const [val, setVal] = state;
        return (
            <ToolBarButton 
                color={val? '#eee' : '#bbb' }
                title={title}
                onPress={()=>{setVal(!val)}}
                {...props}
            >
            </ToolBarButton>
        )
    }

    if (!logStore.visible) return null;

    return (
        <View style={styles.container} >

        { expand ?

            <>
            <View style={styles.toolBar} >
                <ToolBarButton title={"Collapse"}
                    onPress={()=>setExpand(false)}
                />
                
                <ToggleButton title="Sticky"
                    state={[sticky, setSticky]}
                />
                <ToolBarButton title="Record Logs"
                    color={logStore.recordLogs? '#eee' : '#bbb' }
                    onPress={()=>logStore.setRecordLogs(!logStore.recordLogs)}
                />
                <ToolBarButton title="Clear"
                    onPress={()=>logStore.clear()}
                />
            </View>


            <ScrollView 
                ref={scrollViewRef}
                style={styles.logsContainer}
                onContentSizeChange={() => {
                    if (sticky) scrollViewRef?.current?.scrollToEnd({ animated: true })
                }}
                scrollEventThrottle={1000}
                persistentScrollbar
                onScrollEndDrag={onScrollEnd}
                onMomentumScrollEnd={onScrollEnd}
            >
                {logStore.logs.map((entry) => (
                    <View style={styles.entryWrapper} key={entry.id}>
                        <Text style={[styles.logText, {textAlign:'right'}]}>{entry.created}</Text>
                        <Text style={[styles.logText]}>{entry.message}</Text>
                    </View>
                ))}
            </ScrollView>
            </>
        :

        <View style={styles.toolBar} >
            <ToolBarButton title={"Expand"}
                onPress={()=>setExpand(true)}
            />
        </View>            
        }

        </View>

    );
})

export default LogUI;


const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000000',
    },
    toolBar: {
        display: 'flex',
        flexDirection: 'row',
    },
    logsContainer: {
        height: 200,
        borderColor: '#ffffff',
        borderTopWidth: 1,
    },
    button: {
        padding: 5,
        margin: 5,
        backgroundColor: '#eee'
    },
    entryWrapper: {
      padding: 10,
      borderColor: '#666',
      borderBottomWidth: 1,
    },
    logText: {
        color: '#ffffff'
    }
  });
