import React, {useEffect, useRef, useState} from 'react';
import './achieve.scss';
import {Image, Text, View, ScrollView} from "@tarojs/components";
import Taro, {createSelectorQuery} from "@tarojs/taro";
import request from '../../utils/request'

const achieve = () => {
  const userInfo = Taro.getStorageSync('userInfo');
  const[yhachlist,setYhachlist]=useState([
    {

    },
  ])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
      request({
        url: `/achievement/selallach`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const proItems = res.data.map(item => ({
            achId: item.achId,
            achCateid: item.achCateid,
            achcateName: item.achcateName,
            achImage: item.achImage,
            achName: item.achName,
            achCondition: item.achCondition,
            achDesc: item.achDesc,
            achExp: item.achExp,
            achieveTime: null,
            completed: false,
          }));
          //console.log(proItems);
          setYhachlist(proItems);

          request({
            url: `/achievesuccess/selallachsuccessbyuserid?userid=${userInfo.id}`,
            method: 'POST',
            header: {
              //'token': `Bearer ${Taro.getStorageSync('token')}`,
              'Content-Type': 'application/json',
            }
          }).then(res => {
            if (res.message === "success") {
              const completedItems = res.data;
              // 匹配并更新成就列表
              const updatedYhachlist = proItems.map(item => {
                const completedItem = completedItems.find(completed => completed.achId === item.achId);
                if (completedItem) {
                  return {
                    ...item,
                    achieveTime: completedItem.achieveTime,
                    completed: true,
                  };
                }
                return item;
              });
              setYhachlist(updatedYhachlist);
            }
          }).catch(err => {
            Taro.showToast({
              title: '请求失败: ' + err.message,
              icon: 'none',
            });
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '请求失败: ' + err.message,
          icon: 'none',
        });
      });

  },[])

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };


  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAchieveTimeIndex, setShowAchieveTimeIndex] = useState({ index: -1, idx: -1 });
  //const [showAchieveTimeIndex, setShowAchieveTimeIndex] = useState({ index: null, idx: null });
  const Opentime = (index,idx) => {
    if (showAchieveTimeIndex.index === index && showAchieveTimeIndex.idx === idx) {
      setShowAchieveTimeIndex({ index: null, idx: null }); // 再次点击隐藏
    } else {
      setShowAchieveTimeIndex({ index, idx }); // 显示对应成就的时间内容
    }
  };

  const Iscomplete=(comp)=>{
      if(comp){
        return "https://i.111666.best/image/oqJXny1iWG3AppslT5938E.png";
      }else{
        return "https://i.111666.best/image/zA3zq2GWwoO7deyLGVBW58.png";
        //return "https://i.111666.best/image/5GSL30aQYH4HI4ZMli6MuJ.png";
      }
  }

  const groupedAchievements = yhachlist.reduce((groups, item) => {
    if (!groups[item.achcateName]) {
      groups[item.achcateName] = [];
    }
    groups[item.achcateName].push(item);
    return groups;
  }, {});

  // const contentScrollViewRef = useRef(null);
  const [scrollIntoViewId, setScrollIntoViewId] = useState('');
  const handleCategoryClick = (achcateName) => {
    setSelectedCategory(achcateName);
    const categories = Object.keys(groupedAchievements);
    // 查找指定成就类型的索引
    const indexofg = categories.indexOf(achcateName);
    setScrollIntoViewId(`category-${indexofg}`);
  };

  const scrollStyle = {
    height: '500px',
    marginTop: '80px'
  };

  const handleScroll = () => {
    setScrollIntoViewId('');
  };

  return (
    <View className="order">
      <View className="fixed-header">
        <View className="image-container">
          <Text className="ordertitle">成就列表</Text>
        </View>
        <View className="sidebar">
          {Object.keys(groupedAchievements).map((achcateName, index) => (
            <View key={index} onClick={() => handleCategoryClick(achcateName)}  className={ `sidebar-item ${selectedCategory === achcateName ? 'sidebar-item-selected' : 'sidebar-item-text'}`}>
              <Text>{achcateName}</Text>
            </View>
          ))}
        </View>
      </View>

      {/*<View className="container">*/}
        <ScrollView className="content"
                    scrollY="true"
                    style={scrollStyle}
                    scrollIntoView={scrollIntoViewId}
                    // ref={scrollViewRef}
                    onScroll={handleScroll}>
          {Object.keys(groupedAchievements).map((achcateName, index) => (
            <View key={index} id={`category-${index}`} >
              <View className="achcatenamestyle">
                <Text className="ordertitle2" >{achcateName}</Text>
              </View>

              {groupedAchievements[achcateName].map((item, idx) => (
                <View key={idx} onClick={() => Opentime(index,idx)}>
                  <View className={` ${item.completed && showAchieveTimeIndex.index === index && showAchieveTimeIndex.idx === idx ? 'orderinfo2' : 'orderinfo'}`}>
                    <View className="ach-info">
                      <View className="image-container">
                        <Image className="achievement-icon"
                               src={item.achImage}
                        />
                      </View>
                      <View className="achievement-info">
                        <Text className={` ${item.completed ? 'infoTest' : 'infoTest2'}`}>{item.achName}</Text>
                        <Text className={` ${item.completed ? 'infoTest3' : 'infoTest2'}`}>{item.achCondition}</Text>
                      </View>
                      <View className="image-container">
                        <Image className="achievement-icon"
                               src={Iscomplete(item.completed)}
                        />
                      </View>
                    </View>
                  </View>
                  {item.completed && showAchieveTimeIndex.index === index && showAchieveTimeIndex.idx === idx && (
                    <View className='achtime'>
                      <Text className='infoTest4'>达成时间{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{formatTime(item.achieveTime)}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      {/*</View>*/}
    </View>
  );
};

export default achieve;
