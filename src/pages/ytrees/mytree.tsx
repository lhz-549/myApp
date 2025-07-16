import React, {useEffect, useState} from 'react';
import './mytree.scss';
import {Image, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import request from '../../utils/request'

const mytree = () => {
  const userInfo = Taro.getStorageSync('userInfo');
  const[trees,setTrees]=useState([])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    const userid=userInfo.id;
    request({
      url: `/plant/allplantinfobyuseridGrow?userid=${userid}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          productId: item.productId,
          growupValue: item.growupValue,
          createTime: formatTime(item.createTim),
          updateTime: formatTime(item.updateTime),
          growupandlife: item.growupandlife,
          dailymaintenance: item.dailymaintenance,
          categoryName: item.categoryName,
          categoryDescription: item.categoryDescription,
          pdescription: item.pdescription,
          pimage:item.pimage,
          pname:item.pname,
          growId:item.growId,
          stage:item.stage,
          stageDesc:item.stageDesc,
          isHealth:item.isHealth,
          adopt:item.adopt,
          growTime:item.growTime,
          gstate:item.gstate,
        }));
        //console.log(proItems);
        setTrees(proItems);
      }
    });
  },[]);

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };

  const jks = (ish)=>{
    if(ish==="健康"){
      return 'isHealth';
    }else if(ish==="亚健康"){
      return 'isYaHealth';
    }else if(ish==="病态"){
      return 'isNotHealth';
    }
  };
  //控制记录image显示

  const [expandedIndices, setExpandedIndices] = useState(Array(trees.length).fill(false));
  const toggleExpand = (index) => {
    setExpandedIndices(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const stages = ["幼苗期", "成长期", "成熟期"];
  const renderStages = (currentStage) => {
    const currentIndex = stages.indexOf(currentStage);
    return stages.map((stage, index) => (
      <Text key={index} className={index <= currentIndex ? 'highlight' : ''}>
        {stage}
        {index < stages.length - 1 ? '<<':''}
      </Text>
    ));
  };

  return (
    <View className="order">
      <Text className="ordertitle">我的种植</Text>
      {trees.map((item, index) => (
        <View  key={item.id}  >
          <View className='orderinfo2'>
            <View>
              <Text className="orderiteminfo1">我的第{index+1}颗树</Text>
              <Text className="orderiteminfo1">{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{item.pname}</Text>
              <Text className="orderiteminfo1">{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{item.growId}</Text>
              {/*<Text className="orderiteminfo1">{'\u00A0\u00A0'}|{'\u00A0\u00A0'}记录号:{item.id}</Text>*/}
            </View>
            <Text className="orderiteminfo1">{item.stage }</Text>
          </View>
          <View className='orderinfo'>
            <View className="oiimage">
              <Image className="icon" src={item.pimage}></Image>
            </View>
            <View className="oitext">
              <Text className="orderiteminfo2">成长历程{'\u00A0\u00A0'}{renderStages(item.stage)}</Text>
              <View className="oitext2">
                <Text className="orderiteminfo2">健康状态{'\u00A0\u00A0'}<Text className={jks(item.isHealth)}>{item.isHealth }</Text>{'\u00A0\u00A0'}</Text>
                <Text className="orderiteminfo2">|{'\u00A0\u00A0'}时间{'\u00A0\u00A0'}{formatTime(item.growTime)}</Text>
              </View>
            </View>
          </View>
          <View className='orderinfo3'>
            <Text className="orderiteminfo3">养护帮助：</Text>
            <Text
              // className="orderiteminfo"
              className={`orderiteminfo ${expandedIndices[index] ? 'expanded' : ''}`}
              onClick={() => toggleExpand(index)}
            >{item.adopt}</Text>
          </View>
        </View>
      ))}
    </View>
  );

};

export default mytree;
