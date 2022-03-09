import useLocationTracking from '../hooks/useLocationTracking';
import { useNavigationState } from '@react-navigation/native';

export default function LocationTracker(){

    // const routes = useNavigationState(state => state?.routes);
    // const index = useNavigationState(state => state?.index);

    // const currScreenName = routes[index].name;

    useLocationTracking();

    return (null);
}