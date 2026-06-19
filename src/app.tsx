import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useRouteStore } from './store/routeStore';
import { useRideStore } from './store/rideStore';
import { useActivityStore } from './store/activityStore';
import { useUserStore } from './store/userStore';
import './app.scss';

function App(props) {
  const initRoutes = useRouteStore(state => state.initRoutes);
  const initRides = useRideStore(state => state.initRides);
  const initActivities = useActivityStore(state => state.initActivities);
  const initUser = useUserStore(state => state.initUser);

  useEffect(() => {
    const initAll = async () => {
      await Promise.all([
        initRoutes(),
        initRides(),
        initActivities(),
        initUser()
      ]);
    };
    initAll();
  }, [initRoutes, initRides, initActivities, initUser]);

  useDidShow(() => {});
  useDidHide(() => {});

  return props.children;
}

export default App;
