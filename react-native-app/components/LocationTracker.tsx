import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import useLocationTracking from '../hooks/useLocationTracking';

export default function LocationTracker(props:any, context:any){

    const scrollViewRef:any = React.useRef();

    const [logs, setLogs] = useState([] as LogEntry[]);
    const [sticky, setSticky] = useState(true);
    const [showLog, setShowLog] = useState(true);
    const [record, setRecord] = useState(true);

    const logsQueue:LogEntry[] = []

    function addLog(...items:any[]) {
        if (record) {
            console.log(...items)
            logsQueue.push(new LogEntry(items))
            if (logs.length > 100) logs.shift()
            setLogs(logs.concat(logsQueue))
        }
    }

    useLocationTracking(addLog)


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


    return (
        <View style={styles.container} >
            <View style={styles.toolBar} >
                <ToggleButton title="Show Logs"
                    state={[showLog, setShowLog]}
                />
                <ToggleButton title="Record Logs"
                    state={[record, setRecord]}
                />
                <ToggleButton title="Sticky"
                    state={[sticky, setSticky]}
                />
                <ToolBarButton title="Clear"
                    onPress={()=>setLogs([])}
                />
            </View>


            { showLog && <ScrollView 
                ref={scrollViewRef}
                style={{height: 200}}
                onContentSizeChange={() => {
                    if (sticky) scrollViewRef?.current?.scrollToEnd({ animated: true })
                }}
                scrollEventThrottle={1000}
                persistentScrollbar
                onScrollEndDrag={onScrollEnd}
                onMomentumScrollEnd={onScrollEnd}
            >
                {logs.map((entry) => (
                    <View style={styles.entryWrapper} key={entry.id}>
                        <Text style={[styles.logText, {textAlign:'right'}]}>{entry.created}</Text>
                        <Text style={[styles.logText]}>{entry.message}</Text>
                    </View>
                ))}
            </ScrollView>}

        </View>

    );
}


const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000000',
    },
    toolBar: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: '#ffffff',
        borderBottomWidth: 1,
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



class LogEntry {
    public id: string;
    public created: string;
    public message: string;

    constructor (items: any[]) {
        this.id = new Date().toISOString()+Math.ceil(Math.random()*100);
        this.created = new Date().toTimeString();
        this.message = "";
        for (let item of items) {
            let itemStr = ""

            // if (Array.isArray(item)) {
            //     itemStr = JSON.stringify(item, null, 2)
            // }
             if (typeof item === 'object') {
                 if (this.message) this.message += "\n"
                itemStr = JSON.stringify(item, null, 2)
            }
            else if (item.toString) {
                itemStr = item.toString()
            }
            else itemStr = item;
            
            this.message += itemStr +" ";
        }
    }


}