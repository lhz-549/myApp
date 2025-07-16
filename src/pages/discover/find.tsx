import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image} from '@tarojs/components';
import ImageSwiper from '../component/ImageSwiper'; // 根据你的目录结构调整路径
import ArticleList from '../component/ArticleList';
import './find.scss';
import {AtSearchBar, AtTabs, AtTabsPane} from "taro-ui";
import PhotoShare from "../component/PhotoShare";
import SquareCard from "../component/SquareCard";
import "taro-ui/dist/style/components/tabs.scss";
import request from "../../utils/request";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";


const find = () => {
  const images = [
    'https://i.111666.best/image/VRp9bO3VSoN7ryjmrJ0dOW.jpg',
    'https://i.111666.best/image/CHBWCFQYcI3NQZkBGKD5TU.jpg',
    'https://i.111666.best/image/K0xVk5v3jBwiGxgD1v35dn.jpg',
  ];

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [articles,setArticles]= useState([
    {
      id: 1,
      articleCategory: 1,
      views: 14341,
      title: 'TA选纯视觉方案 原因大公开',
      articleText: "",
      date: '2024-05-22',
      image: 'https://i.111666.best/image/VRp9bO3VSoN7ryjmrJ0dOW.jpg',
    },
  ]);

  //const userInfo = Taro.getStorageSync('userInfo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    //console.log("current:"+current);
    request({
      url: `/article/allArticle?artcateid=3`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: item.postDate,
          image: item.articleImage,
        }));
        //console.log(proItems);
        setItems(proItems);
      } else {
        Taro.showToast({
          title: '推荐失败',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });

    request({
      url: `/article/allArticle?artcateid=1`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: formatTime(item.postDate),
          image: item.articleImage,
        }));
        //console.log(proItems);
        setArticles(proItems);
      } else {
        Taro.showToast({
          title: '推荐失败',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });

    request({
      url: `/article/allArticle?artcateid=4`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: formatTime(item.postDate),
          image: item.articleImage,
        }));
        //console.log(proItems);
        setCards(proItems);
      } else {
        Taro.showToast({
          title: '推荐失败',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });

    request({
      url: `/article/allArticle?artcateid=21`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: formatTime(item.postDate),
          image: item.articleImage,
        }));
        //console.log(proItems);
        setPlant(proItems);
      }
    });

    request({
      url: `/article/allArticle?artcateid=22`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: formatTime(item.postDate),
          image: item.articleImage,
        }));
        //console.log(proItems);
        setDali(proItems);
      }
    });

    request({
      url: `/article/allArticle?artcateid=23`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: formatTime(item.postDate),
          image: item.articleImage,
        }));
        //console.log(proItems);
        setHarvest(proItems);
      }
    });

  }, []);

  const [items,setItems ]=useState([
    {
      image: 'https://i.111666.best/image/Ie267U01WooUd3Suq2UwDV.jpg',
      title: '热门果树拍'
    },
  ]);

  const [cards,setCards] = useState([
    {
      image: 'https://i.111666.best/image/jLkVVm32QelEevISfv5VMO.jpg',
      title: '果有说'
    },
  ]);

  const [selres,setSelres] = useState([
    // {
    //   image: 'https://i.111666.best/image/jLkVVm32QelEevISfv5VMO.jpg',
    //   title: '果有说'
    // },
  ]);


  const [current, setCurrent] = useState(0);
  const [current1, setCurrent1] = useState(0);
  const handleClick1 = useCallback((value) => {
    setCurrent1(value);
  }, [])
  const handleClick = useCallback((value) => {
    setCurrent(value);
  }, [])


  const [plant,setPlant] = useState([
  ]);
  const [dali,setDali] = useState([
  ]);
  const [harvest,setHarvest] = useState([
  ]);
  const TabContent1 = () => (
    <View >
      <SquareCard cards={plant} />
    </View>
  );
  const TabContent2 = () => (
    <View >
      <SquareCard cards={dali} />
    </View>
  );
  const TabContent3 = () => (
    <View >
      <SquareCard cards={harvest} />
    </View>
  );

  const tabList = [
    { title: '栽培指南', content: <TabContent1 /> },
    { title: '日常打理', content: <TabContent2 /> },
    { title: '线下收果', content: <TabContent3 /> },
  ];

  const Tab1 = () => (
    <View>
      <ImageSwiper images={images} />
      <ArticleList articles={articles} />
    </View>
  );
  const Tab2 = () => (
    <View>
      <ImageSwiper images={images} />
      <AtTabs current={current1}  tabList={tabList.map(tab => ({ title: tab.title }))} onClick={handleClick1}>
        {tabList.map((tab, index) => (
          <AtTabsPane current={current1} index={index} key={index}>
            {tab.content}
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  );
  const Tab3 = () => (
    <View>
      <View className="card-image2">
        <Image className="card-image-inner2" src="https://i.111666.best/image/2CWEFV4gElsX3es5eI8kk0.jpg" alt="ds12.jpg" mode='cover'/>
      </View>
      <View className='app'>
        <Text className="card-title-guopu">果脯推荐</Text>
        <PhotoShare items={items} />
      </View>
    </View>
  );
  const Tab4 = () => (
    <View>
      <View className="card-image2">
        <Image className="card-image-inner2" src="https://i.111666.best/image/0Ltzhp9kHvB7YHgJZPnxHK.png" alt="ds12.jpg" mode='cover'/>
      </View>
      <View className="card-title">
        <Text className="card-title-true">果友分享</Text>
        <Text className="card-title-word">
          分享果友的真实体验，感受云栽果树的魅力
        </Text>
      </View>
      <View >
        <SquareCard cards={cards} />
      </View>
    </View>
  );
  const Tab5 = () => (
    <View>
      <View className="card-image2">
        <Image className="card-image-inner2" src="https://i.111666.best/image/Oe4DLkD7OXTG91DPd6xSLT.png" alt="ds12.jpg" mode='cover'/>
      </View>
      <View className="card-title">
        <Text className="card-title-true">查询结果</Text>
        <Text className="card-title-word">列表展示</Text>
      </View>
      <View >
        <SquareCard cards={selres} />
      </View>
    </View>
  );

  // const [tabList2,setTabList2] = useState([
  //   { title: '推荐', content: <Tab1 /> },
  //   { title: '支持', content: <Tab2 /> },
  //   { title: '果脯', content: <Tab3 /> },
  //   { title: '果树分享', content: <Tab4 /> },
  //   { title: '查询结果', content: <Tab5 /> },
  // ]);
  const tabList2 = [
    { title: '推荐', content: <Tab1 /> },
    { title: '支持', content: <Tab2 /> },
    { title: '果脯', content: <Tab3 /> },
    { title: '果树分享', content: <Tab4 /> },
    { title: '查询结果', content: <Tab5 /> },
  ];

  const [value, setValue] = useState('');
  const onChange = (val) => {
    setValue(val)
  };

  const onActionClick = () => {
    //console.log("value:"+value);
    // Taro.showToast({
    //   title: '获取列表',
    //   icon: 'success',
    //   duration: 1000,
    // });
    setCurrent(tabList2.findIndex(tab => tab.title === '查询结果'));

    // const newTab = { title: '查询结果', content: <Tab5 /> };
    // tabList2.push(newTab);
    //const newIndex = tabList2.length; // Index of the newly added tab
    //setTabList2([...tabList2, newTab]); // Update tabList2 with the new tab
    //setCurrent(newIndex); // Set current tab index to the newly added tab

    request({
      url: `/article/allArticle3?articletitle=${value}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: formatTime(item.postDate),
          image: item.articleImage,
        }));
        //console.log(proItems);
        setSelres(proItems);
      } else {
        Taro.showToast({
          title: '推荐失败',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });
  }
  const onClear = () => {
    setValue("");
    Taro.showToast({
      title: '已清除',
      icon: 'none',
      duration: 1000,
    })
  }

  return (
    <View className='viewout1'>
      <View className="searchwhere">
        <AtSearchBar
          value={value}
          onChange={onChange}
          onActionClick={onActionClick}
          onClear={onClear}
          placeholder="请输入搜索内容"
          maxLength={50}
        />
      </View>
      <AtTabs current={current} scroll tabList={tabList2.map(tab => ({ title: tab.title }))} onClick={handleClick}>
        {tabList2.map((tab, index) => (
          <AtTabsPane current={current} index={index} key={index}>
            {tab.content}
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  );
}

export default find;
